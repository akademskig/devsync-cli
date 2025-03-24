import log from "../utils/logger";
import { Command } from "commander";
import { backupLocalHander } from "./backupLocalHandler";
import { backupRemoteHandler } from "./backupRemoteHandler";

export const backupHander = (options: { local: string; remote: string }, cmd: Command) => {
  if (Object.keys(options).length === 0 || !options) {
    log.error("❌ No configuration values provided.");
    cmd.outputHelp();
    return;
  }
  if (options.local) {
    backupLocalHander();
  }
  if (options.remote) {
    backupRemoteHandler();
  }
};
