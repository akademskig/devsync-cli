import fs from "fs-extra";
import path from "path";
import log from "../utils/logger";

/**
 * Initializes the DevSync configuration by creating a `devsync-config.json` file
 * in the current working directory if it does not already exist.
 *
 * - If the configuration file already exists, a warning message is logged.
 * - If the configuration file does not exist, it is created with an initial
 *   structure containing an empty `dotfiles` array, and a success message is logged.
 *
 * @returns {void}
 */
export const initHandler = () => {
  const configPath = path.join(process.cwd(), "devsync-config.json");

  if (fs.existsSync(configPath)) {
    log.warn("⚠️ DevSync is already initialized.");
    return;
  }

  fs.writeJSONSync(configPath, { dotfiles: [] }, { spaces: 2 });
  log.success("✅ DevSync has been initialized successfully!");
};
