import { expect } from 'chai'
import { Contract } from 'ethers'
import inquirer from 'inquirer'
import { useFixture } from './helpers'

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Plugin CLI', () => {
  useFixture('plugin-project')

  let backup: any

  before(async function () {
    backup = inquirer.prompt
    // deploy proxy contract
    const { ethers } = this.env
    const Proxy = await ethers.getContractFactory('Proxy')
    const proxy = await Proxy.deploy()

    await proxy.deployed()
  })

  it('User agrees to deploy proxy contract', async function () {
    // Set user agrees to deploy proxy contract
    inquirer.prompt = (() => Promise.resolve({ create: true })) as any

    const proxy = await this.env.run('proxy:deploy')

    expect(proxy).to.be.instanceOf(Contract)
    expect(proxy.bootstrap).to.be.instanceOf(Function)
    expect(proxy.getFunctionImplementation).to.be.instanceOf(Function)
  })

  it('User reject to deploy proxy contract', async function () {
    // Set user reject to deploy proxy contract
    inquirer.prompt = (() => Promise.resolve({ create: false })) as any

    const proxy = await this.env.run('proxy:deploy')

    expect(proxy).to.be.null
  })

  it('User use cli to register implementation contract', async function () {
    const { ethers } = this.env
    const Greeter = await ethers.getContractFactory('Greeter')
    const Implementation = await ethers.getContractFactory('Implementation')
    const greeter = await Greeter.deploy('Hello, world!')
    const impl = await Implementation.deploy(greeter.address)

    await greeter.deployed()
    await impl.deployed()

    // register implementation contract
    const { receipt, changed } = await this.env.run('proxy', {
      impl: impl.address
    })

    expect(receipt.status).to.be.equal(1)
    expect(changed.length).to.be.equal(3)
    expect(changed.every((item: any) => item.newImpl === impl.address)).to.be
      .true
  })

  after(() => {
    inquirer.prompt = backup
  })
})
