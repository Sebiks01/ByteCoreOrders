import { ByteCoreOrdersClient } from "../structures/ByteCoreOrdersClient";

export enum TaskStatus {
  Enabled = "✅",
  Disabled = "🛑",
}

interface TasksTableElement {
  Task: string;
  Time: seconds | "✖";
  Status: TaskStatus;
}

export type TasksTable = TasksTableElement[];

interface ExecuteOptions {
  client: ByteCoreOrdersClient;
  time: seconds;
}

type ExecuteFunction = (options: ExecuteOptions) => unknown;

type seconds = number;

export type TaskType = {
  noDelay?: boolean;
  time: seconds;
  execute: ExecuteFunction;
};
