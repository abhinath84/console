import rdl from "readline";
import { config } from "./spinnerconfig.js";

export * from "./spinnerconfig.js";

type Frame = {
  interval: number;
  frames: string[];
};

export enum Colors {
  while = "white",
  black = "black",
  red = "red",
  green = "green",
  yellow = "yellow",
  blue = "blue",
  magenta = "magenta",
  cyan = "cyan"
}

export enum Frames {
  dots = "dots",
  dots2 = "dots2",
  dots3 = "dots3",
  dots4 = "dots4",
  dots5 = "dots5",
  dots6 = "dots6",
  dots7 = "dots7",
  dots8 = "dots8",
  dots9 = "dots9",
  dots10 = "dots10",
  dots11 = "dots11",
  dots12 = "dots12",
  line = "line",
  line2 = "line2",
  pipe = "pipe",
  arc = "arc"
}

function getColorCode(name: Colors): [string, string] {
  return ([`\x1b[${config.colors[name][0]}m`, `\x1b[${config.colors[name][1]}m\x1b[0m`]);
}

export class Spinner {
  #frame: Frame;

  #colorCode: [string, string];

  #msg: string;

  #timer: NodeJS.Timeout | null;

  constructor(name: Frames, color: Colors = Colors.while, msg = "") {
    this.#frame = config.spinners[name];
    this.#colorCode = getColorCode(color);
    this.#msg = msg;
    this.#timer = null;
  }

  message(text: string) {
    this.#msg = text;
  }

  start() {
    // remove the cursor so we can see the effect
    process.stdout.write("\x1B[?25l");

    // array of line types that will make up the spin effect
    const spinnerFrames = this.#frame.frames;
    const spinnerInterval = this.#frame.interval;

    // current index of the spinners array
    let index = 0;
    this.#timer = setInterval(() => {
      // select a line type
      let now = spinnerFrames[index];

      // if the line is undefined, set the index to 0
      if (now === undefined) {
        index = 0;
        now = spinnerFrames[index];
      }

      // write the line type to terminal
      // const colorTxtStart = `\x1b[31m`;
      // const colorTxtStop = `\x1b[31m\x1b[0m`;
      // const ttt = `${colorTxtStart}${now}${colorTxtStop} ${this.#msg}`;
      process.stdout.write(`${this.#colorCode[0]}${now}${this.#colorCode[1]} ${this.#msg}`);

      // set the cursor to (x,y) (0, 0) because that is the cell position we are operating
      rdl.cursorTo(process.stdout, 0);

      // adjust the index
      index = index >= spinnerFrames.length ? 0 : index + 1;
    }, spinnerInterval);
  }

  stop() {
    if (this.#timer) {
      clearInterval(this.#timer);
      process.stdout.write("\x1B[?25h");

      this.#timer = null;
    }
  }
}
