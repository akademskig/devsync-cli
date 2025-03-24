import log from "../utils/logger";
import { Command } from "commander";
import { loadConfig } from "../utils/config";
import { copySync, existsSync, mkdirSync } from "fs-extra";
import { resolve, join, basename } from "path";
import { execSync } from "child_process";

export const backupLocal = () => {
  const config = loadConfig();

  if (config.dotfiles.length === 0) {
    log.warn("⚠️ No dotfiles to backup. Use 'devsync add-dotfile <filepath>' first.");
    return;
  }

  log.info("🔄 Syncing dotfiles...");

  if (!existsSync(config.backupDir)) {
    mkdirSync(config.backupDir);
    log.success(`📁 Created backup directory: ${config.backupDir}`);
  }

  config.dotfiles.forEach((file) => {
    const sourcePath = resolve(file);
    const backupPath = join(config.backupDir, basename(file));

    if (existsSync(sourcePath)) {
      copySync(sourcePath, backupPath);
      log.success(`✅ Backed up: ${file} -> ${backupPath}`);
    } else {
      log.error(`❌ File not found: ${file}`);
    }
  });

  log.success("🎉 Backup completed successfully!");
};

export const backupRemote = () => {
  const config = loadConfig();
  const { remoteUrl } = config;

  if (!remoteUrl) {
    log.warn("⚠️ No remote Url defined. Use 'devsync config set --remote <remoteUrl>' first.");
    return;
  }

  log.info(`🔄 Backing up dotfiles to ${remoteUrl} via SSH...`);

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

export const backupHander = (options: { local: string; remote: string }, cmd: Command) => {
  if (Object.keys(options).length === 0 || !options) {
    log.error("❌ No configuration values provided.");
    cmd.outputHelp();
    return;
  }
  if (options.local) {
    backupLocal();
  }
  if (options.remote) {
    backupRemote();
  }
};
