import fs from 'fs'

const FileSystem = {
  readdir: (path, callback) => fs.readdir(path, callback),
  require: path => require(path),
  writeFileSync: (path, value) => fs.writeFileSync(path, value),
}

export default FileSystem
