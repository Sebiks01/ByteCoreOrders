import { ClientEvents, Awaitable } from "discord.js";

import { ByteCoreOrdersClient } from "../structures/ByteCoreOrdersClient";

export enum EventStatus {
  Enabled = "✅",
  Disabled = "🛑",
}

interface EventsTableElement {
  Event: string;
  Type: keyof ClientEvents | "✖";
  Status: EventStatus;
}

export type EventsTable = EventsTableElement[];

type ExecuteFunction<ClientEvent extends keyof ClientEvents> = (
  client: ByteCoreOrdersClient,
  ...args: ClientEvents[ClientEvent]
) => Awaitable<void>;

export type EventType<ClientEvent extends keyof ClientEvents> = {
  name: ClientEvent;
  once?: boolean;
  execute: ExecuteFunction<ClientEvent>;
};
