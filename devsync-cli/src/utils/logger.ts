import chalk from "chalk";
import winston from "winston";

// Create a Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${chalk.gray(`[${timestamp}]`)} ${chalk.cyan(level.toUpperCase())}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

// Helper functions for colored logs
export const log = {
  info: (msg: string) => logger.info(chalk.blue(msg)),
  success: (msg: string) => logger.info(chalk.green(msg)),
  warn: (msg: string) => logger.warn(chalk.yellow(msg)),
  error: (msg: string) => logger.error(chalk.red(msg)),
};

export default log;
