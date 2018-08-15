# Find project files [![CircleCI](https://circleci.com/gh/possibilities/find-project-files.svg?style=svg)](https://circleci.com/gh/possibilities/find-project-files)

Finds files in a directory that are not ignored by `.gitignore` files in the filesystem

## Usage

```javascript
const findProjectFiles = require('find-project-files')

console files = findProjectFiles('/path/to/git/based/project')
console.info(files) // ['index.js', ...]
```
