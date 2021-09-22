import { expect } from 'chai'
import { Contract } from 'ethers'
import { useFixture } from './helpers'

describe('Plugin Helper', () => {
  useFixture('plugin-project')

  before(async function () {
    await this.env.run('compile')
    // deploy proxy contract
    const { ethers } = this.env
    const Proxy = await ethers.getContractFactory('Proxy')
    const proxy = await Proxy.deploy()

    await proxy.deployed()
  })

  it('User get proxy address in config', async function () {
    const { address } = this.env.proxy

    expect(address).to.be.equal('0x5FbDB2315678afecb367f032d93F642f64180aa3')
  })

  it('User deploy proxy contract', async function () {
    const { deploy } = this.env.proxy
    const proxy = await deploy()

    expect(proxy).to.be.instanceOf(Contract)
    expect(proxy.bootstrap).to.be.instanceOf(Function)
    expect(proxy.getFunctionImplementation).to.be.instanceOf(Function)
  })

  it('User use bootstrap to register contract', async function () {
    const { ethers, proxy } = this.env
    const Greeter = await ethers.getContractFactory('Greeter')
    const Implementation = await ethers.getContractFactory('Implementation')
    const greeter = await Greeter.deploy('Hello, world!')
    const impl = await Implementation.deploy(greeter.address)

    await greeter.deployed()
    await impl.deployed()

    // register functiom implementation
    const tx = await proxy.bootstrap(impl.address)
    const receipt = await tx.wait()

    expect(receipt.status).to.be.equal(1)
    expect(
      receipt.events.filter(item => item.event === 'ProxyFunctionUpdated')
        .length
    ).to.be.equal(3)
  })
})
