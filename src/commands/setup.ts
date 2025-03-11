import { Command } from "commander";
import { setupHandler } from "../commandHandlers/setup";

const setupCommand = new Command("setup").description("Setup DevSync");
setupCommand.action(setupHandler);

export default setupCommand;
