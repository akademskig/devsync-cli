import log from "../utils/logger";
import { loadConfig, saveConfig } from "../utils/config";

export const addDotfileHandler = (filepath: string) => {
  const config = loadConfig();

  if (!config.dotfiles.includes(filepath)) {
    config.dotfiles.push(filepath);
    saveConfig(config);
    log.success(`📂 Added ${filepath} to sync list.`);
  } else {
    log.warn(`⚠️ ${filepath} is already in the sync list.`);
  }
};
