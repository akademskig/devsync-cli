import { Command, Option } from "commander";
import { backupHander } from "../commandHandlers/backupHandler";

const backupCommand = new Command("backup").description("Backup all dotfiles");

backupCommand
  .addOption(new Option("-r, --remote", "Backup to a remote server via SSH"))
  .addOption(new Option("-l, --local", "Backup locally"))
  .action(backupHander);

export default backupCommand;
