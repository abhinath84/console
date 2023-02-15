// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Commands {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Generate {
    type PackageInput = {
      name: string;
      version: string;
      description: string;
      command: string;
      repository: {
        type: string;
        url: string;
      };
      bugs: {
        url: string;
      }
      author: string;
      license: string;
    };

    export type Input = {
      path: string;
      package: PackageInput;
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Command {
    export type Input = {
      json: string;
    }
  }
}
