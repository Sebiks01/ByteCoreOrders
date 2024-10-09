import { APIEmbed, Events } from "discord.js";

import { ExtendedChatInputCommandInteraction } from "../../typings/Command";

import { warn, debug } from "../../util/logger";

import { Event } from "../../structures/Event";

export default new Event({
  name: Events.InteractionCreate,

  execute: async (client, interaction) => {
    // Checking if interaction is a command interaction
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

    const { commandName, user } = interaction;

    // Fetching the command from the client commands collection
    const command = client.commands.get(commandName);

    // Checking if the command exists
    if (!command) {
      warn(`Command ${commandName} doesn't exist.`);

      if (interaction.isChatInputCommand()) {
        await interaction.reply({
          content: client.lang?.misc.uknownCommand.content,
          embeds: client.lang?.misc.uknownCommand.embeds as APIEmbed[],
          ephemeral: true,
        });

        return;
      } else {
        await interaction.respond([]);
        return;
      }
    }

    if (interaction.isAutocomplete()) {
      debug(`Autocomplete interaction for "${commandName}" command.`);
      debug(`Autocomplete executor: ${user.username} (${user.id}).`);

      // Executing autocomplete for the command
      try {
        if (!command.autocomplete) {
          await interaction.respond([]);
          return;
        }

        command.autocomplete({ client, interaction });
      } catch (err) {
        warn(`Autocomplete failure in "${commandName}" command.`);

        console.log(err);
      }

      return;
    }

    debug(`Executing command "${commandName}".`);
    debug(`Command executor: ${user.username} (${user.id}).`);

    // Executing the command
    try {
      command.execute({
        client,
        interaction: interaction as ExtendedChatInputCommandInteraction,
        args: interaction.options,
      });
    } catch (err) {
      warn(`Command execute failure in "${commandName}" command.`);

      console.log(err);
    }
  },
});
