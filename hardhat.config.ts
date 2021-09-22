import { task, subtask, HardhatUserConfig } from 'hardhat/config'
import { glob } from '@nomiclabs/buidler/internal/util/glob'
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from 'hardhat/builtin-tasks/task-names'
import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

dotenvConfig()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (_, hre) => {
  const accounts = await hre.ethers.getSigners()

  accounts.forEach(account => console.log(account.address))
})

// Override get compile paths task, compile the contracts in the test dir
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS, async (_, hre, runSuper) => {
  const sources = await runSuper()
  const testSources = await glob(
    path.join(hre.config.paths.tests, '**', '*.sol')
  )

  return [...sources, ...testSources]
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const hardhatConfig: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    hardhat: {
      // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
      initialBaseFeePerGas: 0
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD'
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}

export default hardhatConfig
