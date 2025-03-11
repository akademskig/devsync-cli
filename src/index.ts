#!/usr/bin/env node

import { Command, Option } from "commander";
import log from "./utils/logger";
import { initHandler } from "./commands/init";
import { addDotfileHandler } from "./commands/addDotfile";
import { syncHandler } from "./commands/sync";
import { getConfigHandler, listConfigHandler, setConfigHandler } from "./commands/config";

const program = new Command();
const configCommand = new Command("config");

log.info("\n🚀 DevSync - Automated Dev Environment Setup & Sync Tool\n");

program
  .name("devsync-cli")
  .version("1.0.0")
  .description("CLI to set up and sync development environments effortlessly")
  .showHelpAfterError();

program.command("init").description("Initialize DevSync configuration").action(initHandler);

program
  .command("add-dotfile <filepath>")
  .description("Add a dotfile to sync")
  .action(addDotfileHandler);

program.command("backup").description("Backup all dotfiles").action(syncHandler);

configCommand
  .command("set")
  .addOption(new Option("-e, --encrypt <boolean>", "Set encrypt value").choices(["true", "false"]))
  .addOption(new Option("-d, --backup-dir <path>", "Set backup directory"))
  .addOption(
    new Option("-b, --backend <path>", "Set backend server").choices(["local", "s3", "git"]),
  )
  .description("Set a configuration value")
  .action(setConfigHandler);

configCommand
  .command("get")
  .addOption(new Option("-e, --encrypt", "Get encrypt value"))
  .addOption(new Option("-d, --backup-dir", "Get backup directory"))
  .addOption(new Option("-b, --backend", "Get backend server"))
  .description("Get a configuration value")
  .action(getConfigHandler);

configCommand
  .command("list")
  .description("List all configuration settings")
  .action(listConfigHandler);

program.addCommand(configCommand);

program.parse(process.argv);
