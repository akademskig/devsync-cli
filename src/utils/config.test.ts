import fs from "fs-extra";
import yaml from "yaml";
import log from "./logger";
import { loadConfig, defaultConfig } from "./config";
import { FormatEnum } from "../types/format";
import { CONFIG_FILE_PATH } from "../common/constants";

jest.mock("fs-extra");
jest.mock("yaml");
jest.mock("./logger");

const mockFs = fs as jest.Mocked<typeof fs>;
const mockYaml = yaml as jest.Mocked<typeof yaml>;

const CONFIG_YAML = CONFIG_FILE_PATH + ".yaml";
const CONFIG_JSON = CONFIG_FILE_PATH + ".json";

describe("loadConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default config if no config file exists", () => {
    mockFs.existsSync.mockReturnValue(false);
    const saveConfigMock = jest.spyOn(require("./config"), "saveConfig");

    const config = loadConfig();

    expect(mockFs.existsSync).toHaveBeenCalledWith(CONFIG_YAML);
    expect(mockFs.existsSync).toHaveBeenCalledWith(CONFIG_JSON);
    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining("Config file not found"));
    expect(saveConfigMock).toHaveBeenCalledWith(defaultConfig, FormatEnum.YAML);
    expect(config).toEqual(defaultConfig);
  });

  it("should load YAML config if YAML config file exists", () => {
    const yamlContent = "dotfiles: []\nbackupDir: /path/to/backup\nbackend: local\nencrypt: false";
    mockFs.existsSync.mockImplementation((path) => path === CONFIG_YAML);
    mockFs.readFileSync.mockReturnValue(yamlContent);
    mockYaml.parse.mockReturnValue(defaultConfig);

    const config = loadConfig();

    expect(mockFs.existsSync).toHaveBeenCalledWith(CONFIG_YAML);
    expect(mockFs.readFileSync).toHaveBeenCalledWith(CONFIG_YAML, "utf8");
    expect(mockYaml.parse).toHaveBeenCalledWith(yamlContent);
    expect(config).toEqual(defaultConfig);
  });

  it("should load JSON config if JSON config file exists", () => {
    const jsonContent = JSON.stringify(defaultConfig, null, 2);
    mockFs.existsSync.mockImplementation((path) => path === CONFIG_JSON);
    mockFs.readFileSync.mockReturnValue(jsonContent);

    const config = loadConfig();

    expect(mockFs.existsSync).toHaveBeenCalledWith(CONFIG_JSON);
    expect(mockFs.readFileSync).toHaveBeenCalledWith(CONFIG_JSON, "utf8");
    expect(config).toEqual(defaultConfig);
  });
});
