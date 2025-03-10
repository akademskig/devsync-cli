#!/usr/bin/env node

import { Command } from "commander";
import log from "./utils/logger";
import { initCommand } from "./commands/init";
import { addDotfileCommand } from "./commands/addDotfile";
import { syncCommand } from "./commands/sync";
import { getConfig, listConfig, setConfig } from "./commands/config";

const program = new Command();
const configCommand = new Command("config");

log.info("\n🚀 DevSync - Automated Dev Environment Setup & Sync Tool\n");


program
.version("1.0.0")
.description("CLI to set up and sync development environments effortlessly");

program.command("init").description("Initialize DevSync configuration").action(initCommand);

program
.command("add-dotfile <filepath>")
.description("Add a dotfile to sync")
.action(addDotfileCommand);

program.command("sync").description("Sync all dotfiles").action(syncCommand);

configCommand
  .command("set <key> <value>")
  .description("Set a configuration value")
  .action(setConfig);

configCommand.command("get <key>").description("Get a configuration value").action(getConfig);

configCommand.command("list").description("List all configuration settings").action(listConfig);

program.addCommand(configCommand);

program.parse(process.argv);
