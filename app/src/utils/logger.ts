const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private currentLevel: number = LOG_LEVELS.DEBUG;

  constructor() {
    const level = process.env.LOG_LEVEL || 'debug';
    this.currentLevel = LOG_LEVELS[level.toUpperCase() as LogLevel] || LOG_LEVELS.DEBUG;
  }

  private formatMessage(level: string, tag: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    let output = `[${timestamp}] [${level}] [${tag}] ${message}`;

    if (data) {
      output += '\n' + JSON.stringify(data, null, 2);
    }

    return output;
  }

  debug(tag: string, message: string, data?: any): void {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      const formatted = this.formatMessage('DEBUG', tag, message, data);
      console.log(formatted);
    }
  }

  info(tag: string, message: string, data?: any): void {
    if (this.currentLevel <= LOG_LEVELS.INFO) {
      const formatted = this.formatMessage('INFO', tag, message, data);
      console.log(formatted);
    }
  }

  warn(tag: string, message: string, data?: any): void {
    if (this.currentLevel <= LOG_LEVELS.WARN) {
      const formatted = this.formatMessage('WARN', tag, message, data);
      console.warn(formatted);
    }
  }

  error(tag: string, message: string, error?: any): void {
    if (this.currentLevel <= LOG_LEVELS.ERROR) {
      const formatted = this.formatMessage('ERROR', tag, message, error);
      console.error(formatted);
    }
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = LOG_LEVELS[level];
  }
}

export const logger = new Logger();
