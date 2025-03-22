import fs from "fs";
import path from "path";
import { Command } from "commander";
import initCommand from "./init";

const TEST_DIR = path.join(__dirname, "test-output");
const JSON_CONFIG_PATH = path.join(TEST_DIR, "devsync.json");
const YAML_CONFIG_PATH = path.join(TEST_DIR, "devsync.yaml");

describe("DevSync Init Command", () => {
  let program: Command;

  beforeAll(() => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR);
    }
  });

  beforeEach(() => {
    program = new Command();
    program.addCommand(initCommand);
  });

  afterEach(() => {
    if (fs.existsSync(JSON_CONFIG_PATH)) fs.unlinkSync(JSON_CONFIG_PATH);
    if (fs.existsSync(YAML_CONFIG_PATH)) fs.unlinkSync(YAML_CONFIG_PATH);
  });

  afterAll(() => {
    fs.rmdirSync(TEST_DIR, { recursive: true });
  });

  it("should create a JSON config file", () => {
    jest.spyOn(require("../utils/config"), "getConfigFilePath").mockReturnValue(JSON_CONFIG_PATH);
    program.parse(["init", "--format", "json"], { from: "user" });

    expect(fs.existsSync(JSON_CONFIG_PATH)).toBe(true);
    const content = JSON.parse(fs.readFileSync(JSON_CONFIG_PATH, "utf8"));
    expect(content).toHaveProperty("backend", "local");
  });

  it("should create a YAML config file", () => {
    jest.spyOn(require("../utils/config"), "getConfigFilePath").mockReturnValue(YAML_CONFIG_PATH);
    program.parse(["init", "--format", "yaml"], { from: "user" });

    expect(fs.existsSync(YAML_CONFIG_PATH)).toBe(true);
    const content = fs.readFileSync(YAML_CONFIG_PATH, "utf8");
    expect(content).toContain("backend: local");
  });

  it("should fail with an invalid format", () => {
    const processExitMock = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    process.stderr.write = jest.fn().mockImplementation(() => {});
    expect(() => {
      program.parse(["init", "--format", "xml"], { from: "user" });
    }).toThrow("process.exit called");

    expect(process.stderr.write).toHaveBeenCalledWith(
      expect.stringContaining("error: option '--format <format>' argument 'xml' is invalid"),
    );
    processExitMock.mockRestore();
  });
});
