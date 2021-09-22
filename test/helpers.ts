import { resetHardhatContext } from 'hardhat/plugins-testing'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import path from 'path'

// Import this plugin type extensions for the HardhatRuntimeEnvironment
import '../src/type-extensions'

declare module 'mocha' {
  interface Context {
    env: HardhatRuntimeEnvironment
  }
}

export const useFixture = (projectName: string, network = 'hardhat'): void => {
  before('Loading hardhat environment', function () {
    process.chdir(path.join(__dirname, 'fixture-projects', projectName))
    process.env.HARDHAT_NETWORK = network

    // eslint-disable-next-line global-require
    this.env = require('hardhat')
  })

  after('Resetting hardhat', () => {
    resetHardhatContext()
  })
}
