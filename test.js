const findProjectFiles = require('./index')
const { checkIsProjectFilePath } = require('./index')
const { dirSync: tempDirSync } = require('tmp')
const { join: joinPath, dirname, relative: relativePath } = require('path')
const { writeFileSync, mkdirsSync } = require('fs-extra')
const dedent = require('dedent')
const test = require('ava')

const createFixture = files => {
  const tempPath = tempDirSync().name
  Object.keys(files).forEach(name => {
    const content = files[name]
    const fullPath = joinPath(tempPath, name)
    mkdirsSync(dirname(fullPath))
    writeFileSync(fullPath, content)
  })
  return tempPath
}

test('(checkIsProjectFilePath) checks file against project', t => {
  const fixturePath = createFixture({
    '.gitignore': `file-1`,
    'file-1': '',
    'file-2': ''
  })

  t.falsy(checkIsProjectFilePath(fixturePath, 'file-1'))
  t.truthy(checkIsProjectFilePath(fixturePath, 'file-2'))
  t.truthy(true)
})

test('(findProjectFiles) no ignore file', t => {
  const fixturePath = createFixture({
    'dir-1/file-1': '',
    'dir-1/file-2': '',
    'dir-1/file-3': '',
    'dir-2/file-1': '',
    'dir-2/file-2': '',
    'dir-2/file-3': '',
    'dir-3/file-1': '',
    'dir-3/file-2': '',
    'dir-3/file-3': ''
  })

  t.deepEqual(
    findProjectFiles(fixturePath)
      .map(file => relativePath(fixturePath, file.path)),
    [
      'dir-1',
      'dir-1/file-1',
      'dir-1/file-2',
      'dir-1/file-3',
      'dir-2',
      'dir-2/file-1',
      'dir-2/file-2',
      'dir-2/file-3',
      'dir-3',
      'dir-3/file-1',
      'dir-3/file-2',
      'dir-3/file-3'
    ]
  )
})

test('(findProjectFiles) excludes .git dir', t => {
  const fixturePath = createFixture({
    '.git/HEAD': 'master',
    'dir-1/file-1': ''
  })

  t.deepEqual(
    findProjectFiles(fixturePath)
      .map(file => relativePath(fixturePath, file.path)),
    [
      'dir-1',
      'dir-1/file-1'
    ]
  )
})

test('(findProjectFiles) root ignore file', t => {
  const fixturePath = createFixture({
    '.gitignore': dedent`
      dir-1
      file-1
    `,
    'dir-1/file-1': '',
    'dir-1/file-2': '',
    'dir-1/file-3': '',
    'dir-2/file-1': '',
    'dir-2/file-2': '',
    'dir-2/file-3': '',
    'dir-3/file-1': '',
    'dir-3/file-2': '',
    'dir-3/file-3': ''
  })

  t.deepEqual(
    findProjectFiles(fixturePath)
      .map(file => relativePath(fixturePath, file.path)),
    [
      '.gitignore',
      'dir-2',
      'dir-2/file-2',
      'dir-2/file-3',
      'dir-3',
      'dir-3/file-2',
      'dir-3/file-3'
    ]
  )
})

test('(findProjectFiles) subdir ignore file', t => {
  const fixturePath = createFixture({
    '.gitignore': dedent`
      dir-1
      file-1
    `,
    'dir-1/file-1': '',
    'dir-1/file-2': '',
    'dir-1/file-3': '',
    'dir-2/.gitignore': 'file-3',
    'dir-2/file-1': '',
    'dir-2/file-2': '',
    'dir-2/file-3': '',
    'dir-3/file-1': '',
    'dir-3/file-2': '',
    'dir-3/file-3': '',
    'dir-4/.gitignore': 'foo.txt',
    'dir-4/foo/foo.txt': '',
    'dir-4/foo/bar.txt': '',
    'dir-4/foo/baz.txt': ''
  })

  t.deepEqual(
    findProjectFiles(fixturePath)
      .map(file => relativePath(fixturePath, file.path)),
    [
      '.gitignore',
      'dir-2',
      'dir-2/.gitignore',
      'dir-2/file-2',
      'dir-3',
      'dir-3/file-2',
      'dir-3/file-3',
      'dir-4',
      'dir-4/.gitignore',
      'dir-4/foo',
      'dir-4/foo/bar.txt',
      'dir-4/foo/baz.txt'
    ]
  )
})
