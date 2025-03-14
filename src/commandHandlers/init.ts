import { existsSync } from "fs-extra";
import { saveConfig, defaultConfig, getConfigFilePath } from "../utils/config";
import log from "../utils/logger";
import { DEFAULT_CONFIG_FILE_FORMAT } from "../common/constants";
import { FormatEnum } from "../types/format";

export const initHandler = (options: { format?: FormatEnum }) => {
  const format = (options?.format?.toLowerCase() || DEFAULT_CONFIG_FILE_FORMAT) as FormatEnum;
  const configPathYaml = getConfigFilePath(FormatEnum.YAML);
  const configPathJson = getConfigFilePath(FormatEnum.JSON);
  if (existsSync(configPathYaml) || existsSync(configPathJson)) {
    log.warn("⚠️ DevSync is already initialized.");
    return;
  }
  log.info(`🛠️ Initializing DevSync with ${format.toUpperCase()} format...`);

  saveConfig({ ...defaultConfig }, format);
  log.success(`✅ DevSync initialized with ${format.toUpperCase()} configuration.`);
};
