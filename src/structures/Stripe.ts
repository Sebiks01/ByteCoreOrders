import * as bodyParser from "body-parser";
import StripeLib from "stripe";
import express from "express";

import openedOrdersSchema, { OpenedOrders } from "../models/openedOrders";
import successfulPaymentsSchema from "../models/successfulPayments";
import { ByteCoreOrdersClient } from "./ByteCoreOrdersClient";
import { error, info, success, warn } from "../util/logger";
import { LicenseAPI } from "./LicenseAPI";

export class Stripe {
  private _stripe: StripeLib;
  private _secret: string;
  private _webhookSecret: string;
  private _webhookPort: number;
  private _licenseAPI: LicenseAPI;

  constructor(licenseAPI: LicenseAPI) {
    const secret = process.env.STRIPE_SECRET_KEY;
    const webHookSecret = process.env.STRIPE_WH_SECRET_KEY;
    const webhookPort = process.env.STRIPE_WH_PORT;

    if (!secret) {
      error("No stripe secret provided! Exiting...");
      process.exit(1);
    }

    if (!webHookSecret) {
      error("No stripe webhook secret provided! Exiting...");
      process.exit(1);
    }

    if (!webhookPort) {
      error("No stripe webhook port provided! Exiting...");
      process.exit(1);
    }

    this._secret = secret;
    this._webhookSecret = webHookSecret;
    this._webhookPort = parseInt(webhookPort);

    this._stripe = new StripeLib(this._secret);

    this._licenseAPI = licenseAPI;

    this.startWebhook();
  }

  public async generatePaymentLink(productId: number) {
    try {
      const product = ByteCoreOrdersClient.instance.config?.products[productId];

      const session = await this._stripe.checkout.sessions.create({
        payment_method_types: product?.paymentMethods as StripeLib.Checkout.SessionCreateParams.PaymentMethodType[],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: product?.currency as string,
              product_data: {
                name: product?.productName as string,
              },
              unit_amount: product?.price,
            },
            quantity: product?.quantity,
          },
        ],
        success_url: product?.success_url,
        cancel_url: product?.cancel_url,
      });

      return {
        id: session.id,
        url: session.url,
        success: true,
        productName: product?.productName,
        price: product?.price,
        currency: product?.currency,
      };
    } catch (error) {
      console.error("Błąd podczas tworzenia sesji płatności:", error);

      return {
        id: "",
        url: "",
        success: false,
        productName: "",
        price: 0,
        currency: "",
      };
    }
  }

  private async startWebhook() {
    info("Starting webhook server...");

    const app = express();

    app.use(bodyParser.raw({ type: "application/json" }));

    app.post("/webhook", async (req, res) => {
      const sig = req.headers["stripe-signature"];

      if (!sig) {
        res.status(400).send("No signature provided!");
        return;
      }

      let event;

      try {
        event = this._stripe.webhooks.constructEvent(req.body, sig, this._webhookSecret);
      } catch (err) {
        error("Webhook verification error.");
        console.log(err);
        res.status(400).send(`Webhook Error: ${err}`);
        return;
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const data: OpenedOrders | null = await openedOrdersSchema.findOne({ transactionId: session.id });

        if (!data) {
          res.status(200).json({ received: true });
          return;
        }

        try {
          const guild = await ByteCoreOrdersClient.instance.guilds.fetch(
            ByteCoreOrdersClient.instance.config?.coreGuildId[0] as string
          );

          const member = await guild.members.fetch(data.userId);

          await member.roles.add(ByteCoreOrdersClient.instance.config?.products[data.productId].roleId as string);
        } catch (err) {
          warn(`Failed to add role to user ${data.userId}.`);

          res.status(200).json({ received: true });
          return;
        }

        await successfulPaymentsSchema.findOneAndUpdate(
          {
            userId: data.userId,
            sessionId: session.id,
          },
          {
            userId: data.userId,
            username: data.username,
            sessionId: session.id,
            customerEmail: session.customer_email,
            price: session.amount_total,
            currency: session.currency,
            status: session.status,
          },
          {
            new: true,
            upsert: true,
          }
        );

        await this._licenseAPI.addLicense(data, session.id, session.customer_email || " ");
      }

      res.status(200).json({ received: true });
    });

    // Uruchomienie serwera
    app.listen(this._webhookPort, () => {
      info(`Webhook listening on port ${this._webhookPort}`);
    });

    success("Webhook server started.");
  }
}
