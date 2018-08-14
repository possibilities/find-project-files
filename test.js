const findProjectFiles = require('./index')
const { dirSync: tempDirSync } = require('tmp')
const { join: joinPath, dirname } = require('path')
const { writeFileSync, mkdirsSync } = require('fs-extra')
const forEach = require('lodash/forEach')
const dedent = require('dedent')
const test = require('ava')

const createFixture = files => {
  const tempPath = tempDirSync().name
  forEach(files, (content, name) => {
    const fullPath = joinPath(tempPath, name)
    mkdirsSync(dirname(fullPath))
    writeFileSync(fullPath, content)
  })
  return tempPath
}

test('no ignore file', t => {
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
    findProjectFiles(fixturePath).map(file => file.path),
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

test('excludes .git dir', t => {
  const fixturePath = createFixture({
    '.git/HEAD': 'master',
    'dir-1/file-1': ''
  })

  t.deepEqual(
    findProjectFiles(fixturePath).map(file => file.path),
    [
      'dir-1',
      'dir-1/file-1'
    ]
  )
})

test('root ignore file', t => {
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
    findProjectFiles(fixturePath).map(file => file.path),
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

test('subdir ignore file', t => {
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
    findProjectFiles(fixturePath).map(file => file.path),
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
