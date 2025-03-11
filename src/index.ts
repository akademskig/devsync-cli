#!/usr/bin/env node

import { Command } from "commander";
import log from "./utils/logger";
import { initHandler } from "./commands/init";
import { addDotfileHandler } from "./commands/addDotfile";
import { syncHandler } from "./commands/sync";
import { getConfigHandler, listConfigHandler, setConfigHandler } from "./commands/config";

const program = new Command();
const configCommand = new Command("config");

log.info("\n🚀 DevSync - Automated Dev Environment Setup & Sync Tool\n");

program
  .version("1.0.0")
  .description("CLI to set up and sync development environments effortlessly");

program.command("init").description("Initialize DevSync configuration").action(initHandler);

program
  .command("add-dotfile <filepath>")
  .description("Add a dotfile to sync")
  .action(addDotfileHandler);

program.command("sync").description("Sync all dotfiles").action(syncHandler);

configCommand
  .command("set <key> <value>")
  .description("Set a configuration value")
  .action(setConfigHandler);

configCommand
  .command("get <key>")
  .description("Get a configuration value")
  .action(getConfigHandler);

configCommand
  .command("list")
  .description("List all configuration settings")
  .action(listConfigHandler);

program.addCommand(configCommand);

program.parse(process.argv);
