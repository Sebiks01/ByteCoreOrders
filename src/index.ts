import { GatewayIntentBits } from "discord.js";
import "dotenv/config";

import { ByteCoreOrdersClient } from "./structures/ByteCoreOrdersClient";

const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;

const client = new ByteCoreOrdersClient({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
});

client.start();
