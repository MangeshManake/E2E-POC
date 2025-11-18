export class Logger {
  static log(step: string, details: object = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      step,
      ...details
    };

    console.log(JSON.stringify(logEntry));
  }
}
