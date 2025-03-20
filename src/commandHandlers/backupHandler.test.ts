import fs from "fs-extra";
import log from "../utils/logger";
import path from "path";
import { loadConfig } from "../utils/config";
import { backupHander } from "./backupHandler";
import { BackendTypeEnum } from "../types/devSyncConfig";

// filepath: src/commandHandlers/backup.test.ts

jest.mock("fs-extra");
jest.mock("path");
jest.mock("../utils/logger");
jest.mock("../utils/config");

const mockFs = fs as jest.Mocked<typeof fs>;
const mockLog = log as jest.Mocked<typeof log>;
const mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
const mockPath = path as jest.Mocked<typeof path>;

describe("backupHander", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log a warning if no dotfiles are present in the config", () => {
    mockLoadConfig.mockReturnValue({
      dotfiles: [],
      backupDir: "/backup",
      backend: BackendTypeEnum.LOCAL,
      encrypt: false,
    });

    backupHander();

    expect(mockLoadConfig).toHaveBeenCalled();
    expect(mockLog.warn).toHaveBeenCalledWith(
      "⚠️ No dotfiles to backup. Use 'devsync add-dotfile <filepath>' first.",
    );
    expect(mockFs.existsSync).not.toHaveBeenCalled();
    expect(mockFs.mkdirSync).not.toHaveBeenCalled();
  });

  it("should create the backup directory if it does not exist", () => {
    mockLoadConfig.mockReturnValue({
      dotfiles: ["/path/to/dotfile"],
      backupDir: "/backup",
      backend: BackendTypeEnum.LOCAL,
      encrypt: false,
    });
    mockFs.existsSync.mockImplementation((path) => path !== "/backup");

    backupHander();

    expect(mockFs.existsSync).toHaveBeenCalledWith("/backup");
    expect(mockFs.mkdirSync).toHaveBeenCalledWith("/backup");
    expect(mockLog.success).toHaveBeenCalledWith("📁 Created backup directory: /backup");
  });

  it("should back up dotfiles if they exist", () => {
    const dotfile = "/path/to/dotfile";
    const backupDir = "/backup";
    const backupPath = "/backup/dotfile";

    mockLoadConfig.mockReturnValue({
      dotfiles: [dotfile],
      backupDir,
      backend: BackendTypeEnum.LOCAL,
      encrypt: false,
    });
    mockFs.existsSync.mockImplementation((path) => {
      if (path === dotfile) return true;
      if (path === backupDir) return true;
      return false;
    });
    mockFs.copySync.mockImplementation(() => {});
    mockPath.join.mockReturnValue(backupPath);
    mockPath.resolve.mockReturnValue(dotfile);
    backupHander();

    expect(mockFs.existsSync).toHaveBeenCalledWith(backupDir);
    expect(mockFs.existsSync).toHaveBeenCalledWith(dotfile);
    expect(mockFs.copySync).toHaveBeenCalledWith(dotfile, backupPath);
    expect(mockLog.success).toHaveBeenCalledWith(`✅ Backed up: ${dotfile} -> ${backupPath}`);
  });

  it("should log an error if a dotfile does not exist", () => {
    const dotfile = "/path/to/missing-dotfile";
    const backupDir = "/backup";

    mockLoadConfig.mockReturnValue({
      dotfiles: [dotfile],
      backupDir,
      backend: BackendTypeEnum.LOCAL,
      encrypt: false,
    });
    mockFs.existsSync.mockImplementation((path) => path === backupDir);
    mockPath.resolve.mockReturnValue(dotfile);

    backupHander();

    expect(mockFs.existsSync).toHaveBeenCalledWith(dotfile);
    expect(mockFs.copySync).not.toHaveBeenCalled();
    expect(mockLog.error).toHaveBeenCalledWith(`❌ File not found: ${dotfile}`);
  });

  it("should log a success message after completing the backup", () => {
    const dotfile = "/path/to/dotfile";
    const backupDir = "/backup";

    mockLoadConfig.mockReturnValue({
      dotfiles: [dotfile],
      backupDir,
      backend: BackendTypeEnum.LOCAL,
      encrypt: false,
    });
    mockFs.existsSync.mockImplementation((path) => path === dotfile || path === backupDir);
    mockFs.copySync.mockImplementation(() => {});

    backupHander();

    expect(mockLog.success).toHaveBeenCalledWith("🎉 Backup completed successfully!");
  });
});
