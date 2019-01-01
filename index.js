const { resolve, relative, join, dirname } = require('path')
const { existsSync, readFileSync } = require('fs-extra')
const walkTreeSync = require('klaw-sync')
const createIgnore = require('ignore')

// Find all the parent directories for a file so we can search them
// for .gitignore files
const getParentDirsForFilePath = (rootPath, filePath) => {
  const path = relative(rootPath, filePath)
  return dirname(path).startsWith('.')
    ? dirname(path).split('/')
    : ('./' + dirname(path)).split('/')
}

// Find any .gitignore files that would apply to a specific path
const ignoreFilePathsForFilePath = (rootPath, filePath) => {
  let parentDirs = getParentDirsForFilePath(rootPath, filePath)

  let ignoreFiles = []
  while (parentDirs.length) {
    const ignoreFilePath = join(rootPath, parentDirs.join('/'), '.gitignore')
    if (existsSync(ignoreFilePath)) {
      const ignoreFileContents = readFileSync(ignoreFilePath, 'utf8')
      const helper = createIgnore().add(ignoreFileContents)
      const path = parentDirs.join('/')
      ignoreFiles.push({ helper, path })
    }
    parentDirs.pop()
  }
  return ignoreFiles
}

// A filter that respects .gitignore files
const getIgnoreFilter = rootPath => {
  return file => {
    // Never include anything under `./.git`
    if (file.path.endsWith('/.git')) return false
    // Dredge up a helper that respects all .gitignore files
    // above it in the file hierarchy
    const absolutePath = resolve(rootPath, file.path)
    const ignoreFiles = ignoreFilePathsForFilePath(rootPath, absolutePath)
    // If any of the ignore files apply go ahead and ignore the file
    const path = relative(rootPath, absolutePath)
    return !ignoreFiles
      .some(ignoreFile => {
        const relativePath = relative(ignoreFile.path, path)
        return ignoreFile.helper.ignores(relativePath)
      })
  }
}

const findProjectFiles = rootPath => {
  // Build up a filter that knows about gitignore files
  const filter = getIgnoreFilter(rootPath)
  // Get all the files in tree using filter
  return walkTreeSync(rootPath, { filter })
}

const checkIsProjectFilePath = (rootPath, filePath) => {
  const filter = getIgnoreFilter(rootPath)
  return filter({ path: filePath })
}

module.exports = findProjectFiles
module.exports.checkIsProjectFilePath = checkIsProjectFilePath
