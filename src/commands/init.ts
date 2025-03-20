import { Command, Option } from "commander";
import { initHandler } from "../commandHandlers/initHandler";

const initCommand = new Command("init")
  .command("init")
  .description("Initialize DevSync configuration")
  .addOption(
    new Option("--format <format>", "Choose config format: json or yaml")
      .choices(["json", "yaml"])
      .default("yaml"),
  )
  .action(initHandler);

export default initCommand;
