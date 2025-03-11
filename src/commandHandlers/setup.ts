import { execSync } from "child_process";
import os from "os";
import log from "../utils/logger";

export const setupHandler = () => {
  const platform = os.platform();
  log.info(`🔍 Detecting OS: ${platform}`);

  if (platform === "linux" || platform === "darwin") {
    log.info("📦 Installing essential development tools...");
    try {
      execSync("sudo apt update && sudo apt install -y git curl zsh vim", { stdio: "inherit" });
      log.success("✅ Essential tools installed!");
    } catch (error) {
      log.error("❌ Failed to install tools. Please check your package manager.");
    }
  } else if (platform === "win32") {
    log.info("🖥️ Windows detected! Installing tools via Chocolatey...");
    try {
      execSync("choco install git curl vscode -y", { stdio: "inherit" });
      log.success("✅ Development tools installed!");
    } catch (error) {
      log.error("❌ Failed to install tools. Ensure Chocolatey is installed.");
    }
  } else {
    log.error("❌ Unsupported OS. DevSync currently supports Linux, macOS, and Windows.");
  }
};
