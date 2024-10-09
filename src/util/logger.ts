import { blue, green, yellow, red, magenta } from "chalk";
import { vice } from "gradient-string";

import { ByteCoreOrdersClient } from "../structures/ByteCoreOrdersClient";

import { CommandsTable } from "../typings/Command";
import { EventsTable } from "../typings/Event";
import { TasksTable } from "../typings/Task";

// Starter log
export const clientLogo = () => {
  console.log(
    vice(
      "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\n" +
        "*     ___       __      _____               ____         __             *\n" +
        "*    / _ )__ __/ /____ / ___/__  _______   / __ \\_______/ /__ _______   *\n" +
        "*   / _  / // / __/ -_) /__/ _ \\/ __/ -_) / /_/ / __/ _  / -_) __(_-<   *\n" +
        "*  /____/\\_, /\\__/\\__/\\___/\\___/_/  \\__/  \\____/_/  \\_,_/\\__/_/ /___/   *\n" +
        "*       /___/                                                           *\n" +
        "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *"
    )
  );

  info("Starting the client...");
};

// Default logger
export const log = (msg: string) => console.log(msg);

// Custom loggers
export const info = (msg: string) => log(blue(`[INFO] ${msg}`));

export const success = (msg: string) => log(green(`[INFO] ${msg}`));

export const warn = (msg: string) => log(yellow(`[WARN] ${msg}`));

export const error = (msg: string) => log(red(`[ERROR] ${msg}`));

export const debug = (msg: string) => {
  const debugEnabled = ByteCoreOrdersClient.instance.config?.debug || false;

  if (debugEnabled) log(magenta(`[DEBUG] ${msg}`));
};

// Timers
const { time, timeEnd } = console;

export const timerStart = (msg: string) => time(green(`[INFO] ${msg}`));

export const timerEnd = (msg: string) => timeEnd(green(`[INFO] ${msg}`));

// Tables
export const table = (data: CommandsTable | EventsTable | TasksTable) => console.table(data);
