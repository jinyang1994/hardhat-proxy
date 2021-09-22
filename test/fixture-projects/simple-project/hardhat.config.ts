import { subtask, HardhatUserConfig } from 'hardhat/config'
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from 'hardhat/builtin-tasks/task-names'
import { glob } from '@nomiclabs/buidler/internal/util/glob'
import path from 'path'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

// Override get compile paths task, compile the contracts in the test dir
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS, async (_, hre, runSuper) => {
  const sources = await runSuper()
  const testSources = await glob(
    path.join(hre.config.paths.tests, '**', '*.sol')
  )

  return [...sources, ...testSources]
})

const hardhatConfig: HardhatUserConfig = {
  solidity: '0.8.4',
  paths: {
    root: '../../../'
  }
}

export default hardhatConfig
