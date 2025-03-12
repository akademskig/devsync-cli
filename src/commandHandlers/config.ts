import { Command } from "commander";
import { loadConfig, saveConfig, DevSyncConfig } from "../utils/config";
import log from "../utils/logger";

export function setConfigHandler(options: Partial<DevSyncConfig>, cmd: Command) {
  if (Object.keys(options).length === 0 || !options) {
    log.error("❌ No configuration values provided.");
    cmd.outputHelp();
    return;
  }
  const config = loadConfig();
  if (options.backupDir) {
    config.backupDir = options.backupDir;
    log.info(`📁 Sync directory set to: ${options.backupDir}`);
  }
  if (options.backend) {
    config.backend = options.backend;
    log.info(`☁️ Storage backend set to: ${options.backend}`);
  }
  if (options.encrypt !== undefined) {
    config.encrypt = options.encrypt;
    log.info(`🔒 Encryption: ${options.encrypt ? "Enabled" : "Disabled"}`);
  }
  saveConfig(config);
}

export const getConfigHandler = (input: Partial<DevSyncConfig>): any => {
  const keys = Object.keys(input) as (keyof DevSyncConfig)[];
  const config = loadConfig();
  keys.forEach((key) => {
    log.info(`🔑 ${key}: ${config[key as keyof DevSyncConfig]}`);
  });
};

export const listConfigHandler = () => {
  console.table(loadConfig());
};
