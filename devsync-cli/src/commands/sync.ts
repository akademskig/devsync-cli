import fs from "fs-extra";
import path from "path";
import log from "../utils/logger";
import { loadConfig } from "../utils/config";

export const syncCommand = () => {
  const config = loadConfig();

  if (config.dotfiles.length === 0) {
    log.warn("⚠️ No dotfiles to sync. Use 'devsync add-dotfile <filepath>' first.");
    return;
  }

  log.info("🔄 Syncing dotfiles...");

  if (!fs.existsSync(config.syncDir)) {
    fs.mkdirSync(config.syncDir);
    log.success(`📁 Created sync directory: ${config.syncDir}`);
  }

  config.dotfiles.forEach((file) => {
    const sourcePath = path.resolve(file);
    const backupPath = path.join(config.syncDir, path.basename(file));

    if (fs.existsSync(sourcePath)) {
      fs.copySync(sourcePath, backupPath);
      log.success(`✅ Synced: ${file} -> ${backupPath}`);
    } else {
      log.error(`❌ File not found: ${file}`);
    }
  });

  log.success("🎉 Sync completed successfully!");
};
