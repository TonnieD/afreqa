export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  message: string;
  level: LogLevel;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
  };
}

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown): string {
  const payload: LogPayload = {
    message,
    level,
    timestamp: new Date().toISOString(),
    ...(context && { context }),
  };

  if (error instanceof Error) {
    payload.error = {
      message: error.message,
      stack: error.stack,
    };
  } else if (error) {
    payload.error = { message: String(error) };
  }

  return JSON.stringify(payload);
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatLog("debug", message, context));
    }
  },

  info(message: string, context?: Record<string, unknown>) {
    console.info(formatLog("info", message, context));
  },

  warn(message: string, context?: Record<string, unknown>, error?: unknown) {
    console.warn(formatLog("warn", message, context, error));
  },

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    console.error(formatLog("error", message, context, error));
  },
};

