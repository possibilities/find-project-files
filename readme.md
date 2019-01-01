# Find project files [![CircleCI](https://circleci.com/gh/possibilities/find-project-files.svg?style=svg)](https://circleci.com/gh/possibilities/find-project-files)

Finds files in a directory that are not ignored by `.gitignore` files in the filesystem

## Usage

#### `findProjectFiles(rootPath: string, globalIgnorePatterns = [])`

```javascript
const findProjectFiles = require('find-project-files')

const files = findProjectFiles('/path/to/git/based/project')
console.info(files) //-> ['index.js', 'foo.js', 'bar.js'...]

const filesWithoutFoo =
  findProjectFiles('/path/to/git/based/project', ['foo.js'])
console.info(filesWithoutFoo) //-> ['index.js', 'bar.js'...]

const filesWithoutFooBar =
  findProjectFiles('/path/to/git/based/project', ['foo.js', 'bar.js'])
console.info(filesWithoutFooBar) //-> ['index.js'...]
```

#### `checkIsProjectFilePath(rootPath: string, filePath: string, globalIgnorePatterns = [])`

```javascript
const { checkIsProjectFilePath } = require('find-project-files')

const isProjectFile = checkIsProjectFilePath(
  '/path/to/git/based/project',
  '/path/to/git/based/project/index.js'
)
console.info(isProjectFile) //-> true

const isIgnoredProjectFile = checkIsProjectFilePath(
  '/path/to/git/based/project',
  '/path/to/git/based/project/ignored.js'
)
console.info(isIgnoredProjectFile) //-> false

const isProjectFileExceptFoo = checkIsProjectFilePath(
  '/path/to/git/based/project',
  '/path/to/git/based/project/foo.js',
  ['foo.js']
)
console.info(isProjectFileExceptFoo) //-> false
```
