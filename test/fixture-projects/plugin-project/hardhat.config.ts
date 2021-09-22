import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import '../../../src'

const hardhatConfig: HardhatUserConfig = {
  solidity: '0.8.4',
  paths: {
    root: '../../../'
  },
  proxies: {
    hardhat: '0x5FbDB2315678afecb367f032d93F642f64180aa3' // first contract address
  }
}

export default hardhatConfig
