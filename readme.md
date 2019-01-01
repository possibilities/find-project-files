# Find project files [![CircleCI](https://circleci.com/gh/possibilities/find-project-files.svg?style=svg)](https://circleci.com/gh/possibilities/find-project-files)

Finds files in a directory that are not ignored by `.gitignore` files in the filesystem

## Usage

#### `findProjectFiles`

```javascript
const findProjectFiles = require('find-project-files')

const files = findProjectFiles('/path/to/git/based/project')
console.info(files) // ['index.js', ...]
```

#### `checkIsProjectFilePath`

```javascript
const { checkIsProjectFilePath } = require('find-project-files')

const isProjectFile =
  checkIsProjectFilePath('/path/to/git/based/project/file')
console.info(isProjectFile) // true

const isIgnoredProjectFile =
  checkIsProjectFilePath('/path/to/git/based/project/ignored-file')
console.info(isIgnoredProjectFile) // false
```
