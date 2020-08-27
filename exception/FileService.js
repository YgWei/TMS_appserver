export const FILE_ARRAY_EMPTY = {
  code: 'FILE_ARRAY_EMPTY',
  message: 'file array is empty',
  toString: () => {
    return 'Cause by : file array is empty'
  }
}

export const MD5_CHECK_ERROR = {
  code: 'MD5_CHECK_ERROR',
  message: 'md5 check error',
  toString: () => {
    return 'Cause by : MD5 check error'
  }
}

export const DELETE_ERROR = (file, err) => {
  return {
    code: 'DELETE_ERROR',
    error: err,
    message: `delete file error, file : ${file}, ${err}`,
    toString: () => {
      return `Cause by : delete file error, file : ${file}, ${err}`
    }
  }
}
