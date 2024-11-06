import axios from "axios";
import { APIEmbed, ChannelType } from "discord.js";

import { ByteCoreOrdersClient } from "./ByteCoreOrdersClient";
import givenLicensesSchema from "../models/given-licenses";
import { OpenedOrders } from "../models/openedOrders";
import { error, info, warn, debug } from "../util/logger";

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

    try {
      const coreGuildsId = ByteCoreOrdersClient.instance.config?.coreGuildId;
      const logChannelsId = ByteCoreOrdersClient.instance.config?.givenLicensesLogChannelId;

      if (!coreGuildsId || coreGuildsId.length < 1 || !logChannelsId || logChannelsId.length < 1) return;

      coreGuildsId.forEach(async (guildId) => {
        const guild = await ByteCoreOrdersClient.instance.guilds.fetch(guildId);

        if (!guild) return;

        logChannelsId.forEach(async (channelId) => {
          const channel = await guild.channels.fetch(channelId);

          if (!channel || channel.type != ChannelType.GuildText) return;

          const content = ByteCoreOrdersClient.instance.lang?.logs.givenLicenses.content
            ?.slice()
            ?.replaceAll("%username%", username)
            ?.replaceAll("%userId%", userId)
            ?.replaceAll("%sessionId%", sessionId)
            ?.replaceAll("%price%", (data.price / 100).toString())
            ?.replaceAll("%currency%", data.currency)
            ?.replaceAll("%productId%", config?.productId.toString() || "")
            ?.replaceAll("%productDescription%", config?.description || "")
            ?.replaceAll("%addressLimit%", config?.addressLimit.toString() || "")
            ?.replaceAll("%addressDuration%", config?.addressDuration.toString() || "")
            ?.replaceAll("%addons%", config?.addons.join(", ") || "");

          const embeds = ByteCoreOrdersClient.instance.lang?.logs.givenLicenses.embeds?.slice();

          embeds?.forEach(
            (embed) =>
              (embed.description = embed.description
                ?.replaceAll("%username%", username)
                ?.replaceAll("%userId%", userId)
                ?.replaceAll("%sessionId%", sessionId)
                ?.replaceAll("%price%", (data.price / 100).toString())
                ?.replaceAll("%currency%", data.currency)
                ?.replaceAll("%productId%", config?.productId.toString() || "")
                ?.replaceAll("%productDescription%", config?.description || "")
                ?.replaceAll("%addressLimit%", config?.addressLimit.toString() || "")
                ?.replaceAll("%addressDuration%", config?.addressDuration.toString() || "")
                ?.replaceAll("%addons%", config?.addons.join(", ") || ""))
          );

          await channel.send({ content, embeds: embeds as APIEmbed[] });
        });
      });
    } catch (err) {
      debug("Failed to send logs for given licenses.");
      debug(`${err}`);
    }

    try {
      const user = await ByteCoreOrdersClient.instance.users.fetch(userId);

      if (!user) return;

      await user.send({
        content: ByteCoreOrdersClient.instance.lang?.dashboard.dmPaymentMessage.content,
        embeds: ByteCoreOrdersClient.instance.lang?.dashboard.dmPaymentMessage.embeds as APIEmbed[],
      });
    } catch (err) {
      debug("Failed to send user dm for given licenses.");
      debug(`${err}`);
    }
  }
}
