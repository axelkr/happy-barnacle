'use strict'

module.exports = {  
  exit: true,
  bail: true,
  slow: 1000,
  recursive: true,
  extension: 'ts',
  require: ['source-map-support/register','ts-node/register']
}
