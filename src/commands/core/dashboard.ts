import {
  APIActionRowComponent,
  APIButtonComponent,
  APIEmbed,
  ChannelType,
  GuildTextBasedChannel,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import { Command } from "../../structures/Command";
import { warn } from "../../util/logger";

export default new Command({
  core: true,

  data: new SlashCommandBuilder()
    .setName("dashboard")
    .setDescription("Sends orders dashboard.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the dashboard to.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addNumberOption((option) => option.setName("product").setDescription("Product id").setRequired(true))
    .addNumberOption((option) => option.setName("product2").setDescription("Product id"))
    .addNumberOption((option) => option.setName("product3").setDescription("Product id"))
    .addNumberOption((option) => option.setName("product4").setDescription("Product id"))
    .addNumberOption((option) => option.setName("product5").setDescription("Product id")),

  execute: async ({ client, interaction }) => {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel("channel") as GuildTextBasedChannel | null;
    const productId = interaction.options.getNumber("product") as number;
    const productId2 = interaction.options.getNumber("product2");
    const productId3 = interaction.options.getNumber("product3");
    const productId4 = interaction.options.getNumber("product4");
    const productId5 = interaction.options.getNumber("product5");

    const dashboardLang = client.lang?.dashboard;

    if (!channel)
      return interaction.editReply({
        content: dashboardLang?.messages.invalidChannel.content,
        embeds: dashboardLang?.messages.invalidChannel.embeds as APIEmbed[],
      });

    const components = [
      {
        type: 2,
        custom_id: `bco_dashboard_order_${productId}`,
        ...dashboardLang?.productsDashboard[productId].button,
      },
    ];

    if (productId2) {
      components.push({
        type: 2,
        custom_id: `bco_dashboard_order_${productId2}`,
        ...dashboardLang?.productsDashboard[productId2].button,
      });
    }

    if (productId3) {
      components.push({
        type: 2,
        custom_id: `bco_dashboard_order_${productId3}`,
        ...dashboardLang?.productsDashboard[productId3].button,
      });
    }

    if (productId4) {
      components.push({
        type: 2,
        custom_id: `bco_dashboard_order_${productId4}`,
        ...dashboardLang?.productsDashboard[productId4].button,
      });
    }

    if (productId5) {
      components.push({
        type: 2,
        custom_id: `bco_dashboard_order_${productId5}`,
        ...dashboardLang?.productsDashboard[productId5].button,
      });
    }

    // Sending dashboard
    try {
      await channel.send({
        content: dashboardLang?.productsDashboard[productId].content,
        embeds: dashboardLang?.productsDashboard[productId].embeds as APIEmbed[],
        components: [
          {
            type: 1,
            components: components,
          },
        ] as APIActionRowComponent<APIButtonComponent>[],
      });

      return interaction.editReply({
        content: dashboardLang?.messages.dashboardSent.content,
        embeds: dashboardLang?.messages.dashboardSent.embeds as APIEmbed[],
      });
    } catch (error) {
      warn("Incorrectly setup language config. Error sending dashboard.");
      console.log(error);

      return interaction.editReply({
        content: dashboardLang?.messages.error.content,
        embeds: dashboardLang?.messages.error.embeds as APIEmbed[],
      });
    }
  },
});
