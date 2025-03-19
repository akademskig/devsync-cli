import { addDotfileHandler } from "./addDotfile";
import { loadConfig, saveConfig } from "../utils/config";
import log from "../utils/logger";
import { BackendTypeEnum } from "../types/devSyncConfig";

jest.mock("../utils/config");
jest.mock("../utils/logger");

const mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
const mockSaveConfig = saveConfig as jest.MockedFunction<typeof saveConfig>;
const mockLog = log as jest.Mocked<typeof log>;

describe("addDotfileHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a new filepath to the dotfiles list and save the config", () => {
    const filepath = "/path/to/dotfile";
    const mockConfig = {
      dotfiles: [],
      backupDir: "/backup",
      backend: BackendTypeEnum.LOCAL,
      encrypt: false,
    };
    mockLoadConfig.mockReturnValue(mockConfig);

    addDotfileHandler(filepath);

    expect(mockLoadConfig).toHaveBeenCalled();
    expect(mockConfig.dotfiles).toContain(filepath);
    expect(mockSaveConfig).toHaveBeenCalledWith(mockConfig);
    expect(mockLog.success).toHaveBeenCalledWith(`📂 Added ${filepath} to sync list.`);
  });

  it("should not add a filepath if it is already in the dotfiles list", () => {
    const filepath = "/path/to/dotfile";
    const mockConfig = {
      dotfiles: [filepath],
      backupDir: "/backup",
      backend: BackendTypeEnum.LOCAL,
      encrypt: false,
    };
    mockLoadConfig.mockReturnValue(mockConfig);

    addDotfileHandler(filepath);

    expect(mockLoadConfig).toHaveBeenCalled();
    expect(mockConfig.dotfiles).toHaveLength(1); // Ensure no duplicates
    expect(mockSaveConfig).not.toHaveBeenCalled();
    expect(mockLog.warn).toHaveBeenCalledWith(`⚠️ ${filepath} is already in the sync list.`);
  });
});
