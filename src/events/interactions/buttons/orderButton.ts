import { APIEmbed, Events } from "discord.js";

import { Event } from "../../../structures/Event";
import { warn } from "../../../util/logger";
import openedOrdersSchema from "../../../models/openedOrders";

export default new Event({
  name: Events.InteractionCreate,

  execute: async (client, interaction) => {
    if (!interaction.isButton() || !interaction.customId.startsWith("bco_dashboard_order_")) return;

    const customId = interaction.customId.split("_");
    const productId = parseInt(customId.pop() as string);

    const lang = client.lang?.dashboard.messages;

    await interaction.reply({
      content: lang?.fetchingPayment.content,
      embeds: lang?.fetchingPayment.embeds as APIEmbed[],
      ephemeral: true,
    });

    try {
      const member = await interaction.guild?.members.fetch(interaction.user.id);

      if (member?.roles.cache.has(client.config?.products[productId].roleId as string)) {
        await interaction.deleteReply();

        await interaction.followUp({
          content: lang?.alreadyPurchased.content,
          embeds: lang?.alreadyPurchased.embeds as APIEmbed[],
          ephemeral: true,
        });

        return;
      }
    } catch (err) {
      warn(`Failed to fetch member roles for ${interaction.user.id}.`);
      console.log(err);

      await interaction.deleteReply();

      await interaction.followUp({
        content: lang?.paymentError.content,
        embeds: lang?.paymentError.embeds as APIEmbed[],
        ephemeral: true,
      });

      return;
    }

    const stripeData = await client.stripe.generatePaymentLink(productId);

    if (!stripeData.success || !stripeData.url) {
      warn("Błąd podczas generowania linku płatności!");

      await interaction.deleteReply();

      await interaction.followUp({
        content: lang?.paymentError.content,
        embeds: lang?.paymentError.embeds as APIEmbed[],
        ephemeral: true,
      });

      return;
    }

    const { id, url } = stripeData;

    await openedOrdersSchema.create({
      userId: interaction.user.id,
      username: interaction.user.username,
      productId,
      productName: stripeData.productName,
      transactionId: id,
      price: stripeData.price,
      currency: stripeData.currency,
    });

    const content = lang?.paymentLink.content?.slice()?.replaceAll("%paymentLink%", url);
    const embeds = lang?.paymentLink.embeds?.slice();

    embeds?.forEach((embed) => (embed.description = embed.description?.replaceAll("%paymentLink%", url)));

    await interaction.deleteReply();

    await interaction.followUp({
      content,
      embeds: embeds as APIEmbed[],
      ephemeral: true,
    });
  },
});
