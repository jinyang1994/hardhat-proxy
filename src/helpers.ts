import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/types'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { abi, bytecode } from '../artifacts/contracts/Proxy.sol/Proxy.json'

export const deployContract = async (ethers: HardhatEthersHelpers) => {
  const Proxy = await ethers.getContractFactory(abi, bytecode)
  const proxy = await Proxy.deploy()

  await proxy.deployed()

  return proxy
}

export const getContract = async (
  ethers: HardhatEthersHelpers,
  address: string
) => {
  return await ethers.getContractAt(abi, address)
}

export const getProxyAddress = (hre: HardhatRuntimeEnvironment) => {
  const { config, network } = hre

  return config.proxies[network.name] || ''
}

export const getChanged = (receipt: TransactionReceipt) =>
  receipt.events.reduce<
    Array<{ selector: string; oldImpl: string; newImpl: string }>
  >((res, item) => {
    if (item.event !== 'ProxyFunctionUpdated' || !item.args) return res
    const { selector, oldImpl, newImpl } = item.args

    res.push({ selector, oldImpl, newImpl })

    return res
  }, [])
