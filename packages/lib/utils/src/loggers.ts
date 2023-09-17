import path from "path";
import log4js from "log4js";

const { configure, getLogger } = log4js;

export { getLogger };

export function bootstrapLogger(dirname: string) {
  const date = new Date();
  const strDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  configure({
    appenders: {
      out: { type: "stdout" },
      app: { type: "file", filename: path.join(dirname, `${strDate}.log`) },
    },
    categories: {
      default: { appenders: ["out", "app"], level: "debug" },
    },
  });
  const logger = log4js.getLogger();
  logger.level = "debug";
}
