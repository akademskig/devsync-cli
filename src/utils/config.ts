import fs from "fs-extra";
import path from "path";
import yaml from "yaml";
import log from "./logger";
import { CONFIG_FILE_PATH, DEFAULT_CONFIG_FILE_FORMAT } from "../common/constants";
import { FormatEnum } from "../types/format";

export interface DevSyncConfig {
  dotfiles: string[];
  backupDir: string;
  backend: "local" | "git" | "s3";
  encrypt: boolean;
}

export const defaultConfig: DevSyncConfig = {
  dotfiles: [],
  backupDir: path.join(process.cwd(), "devsync_backup"),
  backend: "local",
  encrypt: false,
};

export const getConfigFilePath = (format: FormatEnum) => `${CONFIG_FILE_PATH}.${format}`;
// Detect format based on existing files
const detectConfigFormat = (): FormatEnum => {
  if (fs.existsSync(getConfigFilePath(FormatEnum.YAML))) return FormatEnum.YAML;
  if (fs.existsSync(getConfigFilePath(FormatEnum.JSON))) return FormatEnum.JSON;
  return DEFAULT_CONFIG_FILE_FORMAT; // Default to YAML
};

// Load the config based on format
export const loadConfig = (): DevSyncConfig => {
  const format = detectConfigFormat();
  const configPath = getConfigFilePath(format);

  if (!fs.existsSync(configPath)) {
    log.warn(`⚠️ Config file not found. Initializing with ${format} format...`);
    saveConfig(defaultConfig, format);
    return defaultConfig;
  }

  const fileContents = fs.readFileSync(configPath, "utf8");
  return format === FormatEnum.YAML ? yaml.parse(fileContents) : JSON.parse(fileContents);
};

// Save config in the chosen format
export const saveConfig = (config: DevSyncConfig, format?: FormatEnum): void => {
  format = format || detectConfigFormat();
  const configPath = getConfigFilePath(format);

  const data =
    format === FormatEnum.YAML ? yaml.stringify(config) : JSON.stringify(config, null, 2);
  fs.writeFileSync(configPath, data, "utf8");

  log.success(`✅ Config updated in ${format.toUpperCase()} format: ${configPath}`);
};
