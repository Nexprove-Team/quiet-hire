type LogLevel = "info" | "warn" | "error" | "debug";

function timestamp(): string {
  return new Date().toISOString();
}

function format(level: LogLevel, source: string, message: string): string {
  return `[${timestamp()}] [${level.toUpperCase()}] [${source}] ${message}`;
}

export function createLogger(source: string) {
  return {
    info: (message: string) => console.log(format("info", source, message)),
    warn: (message: string) => console.warn(format("warn", source, message)),
    error: (message: string) => console.error(format("error", source, message)),
    debug: (message: string) => {
      if (process.env["DEBUG"]) {
        console.debug(format("debug", source, message));
      }
    },
  };
}
