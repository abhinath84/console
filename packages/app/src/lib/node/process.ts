import { spawn, execFile, SpawnOptionsWithoutStdio } from "child_process";
import util from "util";

interface SpawnError extends Error {
  code?: number | null,
  killed?: boolean,
  signal?: NodeJS.Signals | null,
  cmd?: string,
  stdout?: string[],
  stderr?: string[]
}

export function spawnAsync(
  command: string,
  args?: readonly string[],
  options?: SpawnOptionsWithoutStdio,
): Promise <{
  stdout: string | Buffer;
  stderr: string | Buffer;
}> {
  return (new Promise((resolve, reject) => {
    const child = spawn(command, args, options);

    const stderr: string[] = [];
    const stdout: string[] = [];
    let error: SpawnError;

    child.stdout.on("data", (data) => {
      stdout.push(data.toString());
    });

    child.stderr.on("data", (e) => {
      stderr.push(e.toString());
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout: stdout.join(""), stderr: stderr.join("") });
      }

      // error from 'error' event
      if (error) {
        error.cmd = child.spawnargs.join(" ");
        error.stdout = stdout;
        error.stderr = stderr;

        reject(error);
      }

      // error from 'stderr'
      const err = {
        code,
        killed: child.killed,
        signal: child.signalCode,
        cmd: child.spawnargs.join(" "),
        stdout,
        stderr,
      };

      reject(err);
    });

    child.on("error", (err) => {
      error = err;
    });

  // child.unref();
  }));
}

export function execFileAsync(
  command: string,
  args?: readonly string[],
  options?: SpawnOptionsWithoutStdio,
) {
  const efa = util.promisify(execFile);

  return (efa(command, args, options));
}
