import { Command } from "commander";
import { setupHandler } from "../commandHandlers/setupHandler";

const setupCommand = new Command("setup").description("Set up the development environment");
setupCommand.action(setupHandler);

export default setupCommand;
