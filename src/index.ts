#!/usr/bin/env node

import { Command } from "commander";
import log from "./utils/logger";
import { addDotfileHandler } from "./commandHandlers/addDotfile";
import { backupHander } from "./commandHandlers/backup";
import configCommand from "./commands/config";
import setupCommand from "./commands/setup";
import initCommand from "./commands/init";

const program = new Command();

log.info("\n🚀 DevSync - Automated Dev Environment Setup & Sync Tool\n");

program
  .name("devsync-cli")
  .version("1.0.0")
  .description("CLI to set up and sync development environments effortlessly")
  .showHelpAfterError();

program
  .command("add-dotfile <filepath>")
  .description("Add a dotfile to sync")
  .action(addDotfileHandler);

program.command("backup").description("Backup all dotfiles").action(backupHander);

program.addCommand(initCommand);
program.addCommand(configCommand);
program.addCommand(setupCommand);

program.parse(process.argv);
