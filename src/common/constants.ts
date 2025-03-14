import path from "path";
import { FormatEnum } from "../types/format";

export const CONFIG_FILE_PATH = path.join(process.cwd(), `devsync-config`);
export const DEFAULT_CONFIG_FILE_FORMAT = FormatEnum.YAML;
