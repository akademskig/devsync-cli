import { Command } from "commander";
import { setupHandler } from "../commandHandlers/setupHandler";

const setupCommand = new Command("setup").description("Setup DevSync configuration");
setupCommand.action(setupHandler);

export default setupCommand;
