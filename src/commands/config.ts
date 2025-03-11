import { Command } from "commander";
import { loadConfig, saveConfig, DevSyncConfig } from "../utils/config";
import log from "../utils/logger";

const getValue = (key: keyof DevSyncConfig, value: any): any => {
  if (key === "encrypt") {
    return value === "true" || value === true;
  }
  return value;
};

export function setConfigHandler(inputConfig: Partial<DevSyncConfig>, cmd: Command) {
  if (Object.keys(inputConfig).length === 0 || !inputConfig) {
    log.error("❌ No configuration values provided.");
    cmd.outputHelp();
    return;
  }
  const config = loadConfig();
  Object.keys(inputConfig).forEach((key) => {
    const typedKey = key as keyof DevSyncConfig;
    const value = getValue(typedKey, inputConfig[typedKey]);
    Object.assign(config, { [typedKey]: value });
    log.info(`✅ Config key "${key}" set to: ${value}`);
  });
  saveConfig(config);
}

export const getConfigHandler = (input: keyof DevSyncConfig): any => {
  const keys = Object.keys(input) as (keyof DevSyncConfig)[];
  const config = loadConfig();
  keys.forEach((key) => {
    log.info(`🔑 ${key}: ${config[key as keyof DevSyncConfig]}`);
  });
};

export const listConfigHandler = () => {
  console.table(loadConfig());
};
