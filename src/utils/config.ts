import fs from "fs-extra";
import path from "path";
import log from "./logger";

const CONFIG_FILE = path.join(process.cwd(), "devsync-config.json");

export interface DevSyncConfig {
  dotfiles: string[];
  syncDir: string;
  backend: "local" | "git" | "s3";
  encrypt: boolean;
}

export const defaultConfig: DevSyncConfig = {
  dotfiles: [],
  syncDir: path.join(process.cwd(), "devsync_backup"),
  backend: "local",
  encrypt: false,
};

export const loadConfig = (): DevSyncConfig => {
  if (!fs.existsSync(CONFIG_FILE)) {
    log.warn("⚠️ Config file not found. Initializing with defaults...");
    return defaultConfig;
  }
  return fs.readJSONSync(CONFIG_FILE);
};

export const saveConfig = (config: DevSyncConfig): void => {
  fs.writeJSONSync(CONFIG_FILE, config, { spaces: 2 });
  log.success(`✅ Config updated: ${CONFIG_FILE}`);
};
