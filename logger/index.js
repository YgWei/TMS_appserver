'use strict'
import develop from './develop'
import simple from './simple'
import test from './test'
import prodection from './production'
import config from '../config'

const { env, log } = config
let logger

// Add streams as depending on the environment
if (env === 'production') {
  logger = prodection
}
if (env === 'test') {
  logger = test
}
if (env === 'development') {
  logger = develop
}
if (env === 'development' && log === 'simple') {
  logger = simple
}

export default logger
