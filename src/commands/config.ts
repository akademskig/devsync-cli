import { Command, Option } from "commander";
import { getConfigHandler, listConfigHandler, setConfigHandler } from "../commandHandlers/setConfigHandler";

const configCommand = new Command("config").description("Manage DevSync configuration");

configCommand
  .command("set")
  .addOption(new Option("-e, --encrypt", "Enable encryption"))
  .addOption(new Option("-n, --no-encrypt", "Disable encryption"))
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

export default configCommand;
