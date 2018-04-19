# README Generator

Auto-generate a beautiful README for a project based on its code comments.

This very README was generated from readme-generator!
Supports any language that uses star comments.

## Installation

```
npm i -g readme-generator
```

## API

###### [generate.js](generate.js)

### [`generate [command]`](generate.js#L14)
Generate a README using any child code files of the current directory.

#### Usage

```bash

generate -m "<mainFile.js>" [ -i <ignore dir> ]
```

#### Options

##### `--mainFile`

Alias: `-m` Type: `string` Required: `true`

The relative location of the main file to your code. This will be the file whose code comments supply application metadata.

##### `--ignore`
Alias: `-i` Type: `string` Required: `false`

Ignore a code file or a set of code files within a directory when creating the README. For example:
```bash
generate -m mainFile.js -i ./node_modules`
```
Would create documentation in the README for all files in the current directory and child directories EXCEPT anything in node_modules.


