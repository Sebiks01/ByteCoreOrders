import {
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  AutocompleteInteraction,
  SlashCommandBuilder,
  CacheType,
  GuildMember,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import { ByteCoreOrdersClient } from "../structures/ByteCoreOrdersClient";

export enum CommandScope {
  Test = "Test",
  Core = "Core",
  Global = "Global",
  Unregistered = "✖",
}

export enum CommandStatus {
  Enabled = "✅",
  Disabled = "🛑",
}

interface CommandsTableElement {
  Command: string;
  Scope: CommandScope;
  Status: CommandStatus;
}

export type CommandsTable = CommandsTableElement[];

export interface ExtendedChatInputCommandInteraction extends ChatInputCommandInteraction {
  member: GuildMember;
}

interface ExecuteOptions {
  client: ByteCoreOrdersClient;
  interaction: ExtendedChatInputCommandInteraction;
  args: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">;
}

interface AutocompleteOptions {
  client: ByteCoreOrdersClient;
  interaction: AutocompleteInteraction;
}

type ExecuteFunction = (options: ExecuteOptions) => unknown;

type AutocompleteFunction = (options: AutocompleteOptions) => unknown;

export type CommandType = {
  core?: boolean;
  test?: boolean;
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | Omit<
        SlashCommandBuilder,
        | "addBooleanOption"
        | "addUserOption"
        | "addChannelOption"
        | "addRoleOption"
        | "addAttachmentOption"
        | "addMentionableOption"
        | "addStringOption"
        | "addIntegerOption"
        | "addNumberOption"
      >
    | SlashCommandOptionsOnlyBuilder;
  execute: ExecuteFunction;
  autocomplete?: AutocompleteFunction;
};
