import { backupRemote } from "./backupHandler";
import { defaultConfig, loadConfig } from "../utils/config";
import log from "../utils/logger";
import { execSync } from "child_process";

jest.mock("../utils/config");
jest.mock("../utils/logger");
jest.mock("child_process");

const mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
const mockLog = log as jest.Mocked<typeof log>;
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe("backupRemote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log a warning if no remote URL is configured", () => {
    mockLoadConfig.mockReturnValue({
      ...defaultConfig,
      dotfiles: ["/path/to/dotfile"],
      remoteUrl: "",
    });

    backupRemote();

    expect(mockLog.warn).toHaveBeenCalledWith(
      "⚠️ No remote Url defined. Use 'devsync config set --remote <remoteUrl>' first.",
    );
  });

  it("should log an info message when starting the remote backup", () => {
    mockLoadConfig.mockReturnValue({
      ...defaultConfig,
      dotfiles: ["/path/to/dotfile"],
      remoteUrl: "user@remote:/backup",
    });

    backupRemote();

    expect(mockLog.info).toHaveBeenCalledWith(
      "🔄 Backing up dotfiles to user@remote:/backup via SSH...",
    );
  });

  it("should execute SCP command for each dotfile and log success", () => {
    const dotfiles = ["/path/to/dotfile1", "/path/to/dotfile2"];
    const remoteUrl = "user@remote:/backup";

    mockLoadConfig.mockReturnValue({
      ...defaultConfig,
      dotfiles,
      remoteUrl,
    });

    backupRemote();

    dotfiles.forEach((file) => {
      expect(mockExecSync).toHaveBeenCalledWith(`scp ${file} ${remoteUrl}`, {
        stdio: "inherit",
      });
      expect(mockLog.success).toHaveBeenCalledWith(`✅ Synced: ${file} -> ${remoteUrl}`);
    });

    expect(mockLog.success).toHaveBeenCalledWith("🎉 Remote backup completed!");
  });

  it("should log an error if SCP command fails for a dotfile", () => {
    const dotfiles = ["/path/to/dotfile1"];
    const remoteUrl = "user@remote:/backup";

    mockLoadConfig.mockReturnValue({
      ...defaultConfig,
      dotfiles,
      remoteUrl,
    });

    mockExecSync.mockImplementation(() => {
      throw new Error("SCP failed");
    });

    backupRemote();

    expect(mockExecSync).toHaveBeenCalledWith(`scp ${dotfiles[0]} ${remoteUrl}`, {
      stdio: "inherit",
    });
    expect(mockLog.error).toHaveBeenCalledWith(`❌ Failed to sync ${dotfiles[0]} to ${remoteUrl}`);
  });
});
