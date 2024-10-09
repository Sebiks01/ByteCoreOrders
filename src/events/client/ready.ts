import { Events } from "discord.js";

import { success, debug } from "../../util/logger";

import { Event } from "../../structures/Event";

export default new Event({
  name: Events.ClientReady,
  once: true,

  execute: async (client) => {
    // Logging that the client is ready
    success("The client is now ready.");

    debug(`Logged in as ${client.user?.tag}.`);
    debug(`Client ID: ${client.user?.id}.`);
    debug(`Guilds: ${(await client.guilds.fetch()).size}.`);

    await client.ready();
  },
});
