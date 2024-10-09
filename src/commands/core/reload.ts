import { APIEmbed, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import { Command } from "../../structures/Command";

export default new Command({
  core: true,

  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload bot systems.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  execute: async ({ client, interaction }) => {
    const miscLang = client.lang?.misc;

    await interaction.reply({
      content: miscLang?.reloading.content,
      embeds: miscLang?.reloading.embeds as APIEmbed[],
      ephemeral: true,
    });

    // Reloading client
    const reloaded = await client.reload();

    await interaction.deleteReply();

    if (reloaded)
      await interaction.followUp({
        content: miscLang?.reloaded.content,
        embeds: miscLang?.reloaded.embeds as APIEmbed[],
        ephemeral: true,
      });
    else
      await interaction.followUp({
        content: miscLang?.error.content,
        embeds: miscLang?.error.embeds as APIEmbed[],
        ephemeral: true,
      });
  },
});
