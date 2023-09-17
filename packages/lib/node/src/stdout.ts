export function write(buffer: string) {
  process.stdout.write(buffer);
}

export function overwrite(buffer: string) {
  process.stdout.write("\r"); // move cursor at the start of the line
  process.stdout.clearLine(0);
  process.stdout.write(buffer);
}

export function writeLine(buffer: string) {
  process.stdout.write(buffer);
  process.stdout.write("\n");
}

export function overwriteLine(buffer: string) {
  process.stdout.write("\r"); // move cursor at the start of the line
  process.stdout.clearLine(0);
  process.stdout.write(buffer);
  process.stdout.write("\n");
}

export function clearLine() {
  process.stdout.write("\r"); // move cursor at the start of the line
  process.stdout.clearLine(0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function display(message?: any, ...optionalParams: any[]): void {
  console.log(message, ...optionalParams); // eslint-disable-line no-console
}
