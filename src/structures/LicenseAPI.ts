import axios from "axios";

import { ByteCoreOrdersClient } from "./ByteCoreOrdersClient";
import givenLicensesSchema from "../models/given-licenses";
import { OpenedOrders } from "../models/openedOrders";
import { error, info, warn } from "../util/logger";

export class LicenseAPI {
  private _token: string;

  constructor() {
    const token = process.env.API_TOKEN;

    if (!token) {
      error("No API token provided! Exiting...");
      process.exit(1);
    }

    this._token = token;
  }

  public async addLicense(data: OpenedOrders, sessionId: string, customerEmail: string) {
    const { userId, username, productId } = data;

    const config = ByteCoreOrdersClient.instance.config?.products[productId].license;

    try {
      await axios.put(
        "https://api.mlicense.net/api/v1/licenses",
        {
          productId: config?.productId,
          description: config?.description,
          clientName: username,
          discordId: userId,
          addressLimit: config?.addressLimit,
          addressDuration: config?.addressDuration,
          deleteAfterExpire: false,
          addons: config?.addons,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": this._token,
          },
        }
      );
    } catch (err) {
      error(`Failed to add license for ${username} (${userId}).`);
      warn(`License for this user may already exist.`);
      console.log(err);
      return;
    }

    await givenLicensesSchema.create({
      userId,
      username,
      sessionId: sessionId,
      customerEmail: customerEmail,
      price: data.price,
      currency: data.currency,
      license: {
        productId: config?.productId,
        description: config?.description,
        addressLimit: config?.addressLimit,
        addressDuration: config?.addressDuration,
        addons: config?.addons,
      },
    });

    info(`Added license for ${username} (${userId}).`);
  }
}
