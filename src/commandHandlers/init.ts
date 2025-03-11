import { existsSync } from "fs-extra";
import { saveConfig, defaultConfig } from "../utils/config";
import log from "../utils/logger";
import { CONFIG_FILE_NAME, DEFAULT_CONFIG_FILE_FORMAT } from "../common/constants";
import { FormatEnum } from "../types/format";

export const initHandler = (options: { format?: FormatEnum }) => {
  const format = (options?.format?.toLowerCase() || DEFAULT_CONFIG_FILE_FORMAT) as FormatEnum;
  const configPathYaml = `${CONFIG_FILE_NAME}.yaml`;
  const configPathJson = `${CONFIG_FILE_NAME}.json`;
  if (existsSync(configPathYaml) || existsSync(configPathJson)) {
    log.warn("⚠️ DevSync is already initialized.");
    return;
  }

  log.info(`🛠️ Initializing DevSync with ${format.toUpperCase()} format...`);

  saveConfig({ ...defaultConfig }, format);
  log.success(`✅ DevSync initialized with ${format.toUpperCase()} configuration.`);
};
