## COMMAND

console-new|n - Creates a new CLI app workspace

## SYNOPSIS

```sh
console new <name>  -p, --path <directory>
                    -y, --yes
                    -h, --help

console n <name>  -p, --path <path>
                  -y, --yes
                  -h, --help
```

## DESCRIPTION

Command creates new CLI app workspace on current working directory or specific path (mentioned using `--path` option).

## OPTIONS

_-y, --yes_ \
&emsp;Generate workspace with default options

_-p, --path \<path>_ \
&emsp;Path to create workspace

_-h, --help_ \
&emsp;display help for command

## EXAMPLES

- Create `my-cli-app` cli app workspace on working directory.

```
  $ console new my-cli-app

  $ console n my-cli-app
```

- Create `my-cli-app` cli app workspace on working directory with default options.

```
  $ console new my-cli-app --yes

  $ console n my-cli-app -y
```

- Create `my-cli-app` cli app workspace on custom directory `D:\console`.

```
  $ console new my-cli-app --path "D:\console"

  $ console n my-cli-app -p "D:\console"
```

- Create `my-cli-app` cli app workspace on custom directory `D:\console` with default options.

```
  $ console new my-cli-app --yes --path "D:\console"

  $ console n my-cli-app -y -p "D:\console"
```
