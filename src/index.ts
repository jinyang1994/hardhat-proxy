import { task, extendConfig, extendEnvironment } from 'hardhat/config'
import { lazyObject } from 'hardhat/plugins'
import inquirer from 'inquirer'
import Table from 'cli-table'
import { green, gray, red } from 'colors'
import {
  deployContract,
  getContract,
  getProxyAddress,
  getChanged
} from './helpers'
import * as validate from './validate'
import './type-extensions'

extendConfig((hardhatConfig, userConfig) => {
  const { proxies = {} } = userConfig

  hardhatConfig.proxies = proxies
})

extendEnvironment(hre => {
  hre.proxy = lazyObject(() => {
    const address = getProxyAddress(hre)

    return {
      address,
      deploy: async () => await deployContract(hre.ethers),
      bootstrap: async impl => {
        if (!address || !impl) throw new Error()
        const proxy = await getContract(hre.ethers, address)

        return await proxy.bootstrap(impl)
      }
    }
  })
})

task('proxy')
  .addParam(
    'impl',
    "The implementation contract's address",
    undefined,
    validate.address
  )
  .setAction(async (args, hre) => {
    const { ethers, network } = hre
    const proxyAddress = getProxyAddress(hre)
    if (!proxyAddress) {
      console.log(
        red(
          `Error:\nCannot find ${network.name} proxy property(contract address) in hardhat.config.js.\nYou can run "hardhat proxy:deploy" to deploy a proxy contract.`
        )
      )
      return null
    }
    const implAddress = args.impl
    const proxy = await getContract(ethers, proxyAddress)
    const tx = await proxy.bootstrap(implAddress)
    const receipt = await tx.wait()
    const changed = getChanged(receipt)

    if (changed.length) {
      const events = new Table({
        head: [
          gray('Selector'),
          red('Old implementation'),
          green('New implementation')
        ]
      })

      changed.forEach(item => {
        const { selector, oldImpl, newImpl } = item

        events.push([selector, oldImpl, newImpl])
      })
      console.log(events.toString())
    } else {
      console.log(red('Without any changes!!'))
    }

    return { receipt, changed }
  })

task('proxy:deploy').setAction(async (_, hre) => {
  const { network, ethers } = hre
  const { create } = await inquirer.prompt([
    {
      name: 'create',
      message: `Are you sure to create an proxy contract in ${network.name}?`,
      type: 'confirm',
      default: true
    }
  ])
  if (!create) {
    console.log(`User cancel to create proxy contract`)
    return null
  }
  const proxy = await deployContract(ethers)

  console.log(
    `Proxy contract deployed in ${network.name}:`,
    green(proxy.address)
  )
  return proxy
})
