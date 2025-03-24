import { execSync } from "child_process";
import log from "../utils/logger";
import { loadConfig } from "../utils/config";

export const backupRemoteHandler = () => {
  const config = loadConfig();
  const { remoteUrl } = config;

  if (!remoteUrl) {
    log.warn("⚠️ No remote Url defined. Use 'devsync config set --remote <remoteUrl>' first.");
    return;
  }

  log.info(`🔄 Syncing dotfiles to ${remoteUrl} via SSH...`);

  config.dotfiles.forEach((file) => {
    try {
      execSync(`scp ${file} ${remoteUrl}`, { stdio: "inherit" });
      log.success(`✅ Synced: ${file} -> ${remoteUrl}`);
    } catch (error) {
      log.error(`❌ Failed to sync ${file} to ${remoteUrl}`);
    }
  });

  log.success("🎉 Remote backup completed!");
};
