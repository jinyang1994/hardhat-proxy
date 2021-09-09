import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Ownable', () => {
  it('Check owner is signer', async () => {
    const [signer] = await ethers.getSigners()
    const Proxy = await ethers.getContractFactory('Proxy')
    const proxy = await Proxy.deploy()

    await proxy.deployed()

    const owner = await proxy.owner()
    // Check owner is singer
    expect(owner).to.be.equal(signer.address)
  })

  it('Check if the owner is the signer after register function implementation', async () => {
    const [signer] = await ethers.getSigners()
    const Proxy = await ethers.getContractFactory('Proxy')
    const Greeter = await ethers.getContractFactory('Greeter')
    const Implementation = await ethers.getContractFactory('Implementation')
    const proxy = await Proxy.deploy()
    const greeter = await Greeter.deploy('Hello, world!')
    const impl = await Implementation.deploy(greeter.address)

    await proxy.deployed()
    await greeter.deployed()
    await impl.deployed()

    await proxy.bootstrap(impl.address)

    const owner = await proxy.owner()
    // Check owner after bootstrap
    expect(owner).to.be.equal(signer.address)
  })

  it('Owner call transferOwnership', async () => {
    const [, receiver] = await ethers.getSigners()
    const Proxy = await ethers.getContractFactory('Proxy')
    const proxy = await Proxy.deploy()

    await proxy.deployed()

    await proxy.transferOwnership(receiver.address)

    const owner = await proxy.owner()
    // Check owner after bootstrap
    expect(owner).to.be.equal(receiver.address)
  })

  it('Not owner call transferOwnership', async () => {
    const [, receiver, other] = await ethers.getSigners()
    const Proxy = await ethers.getContractFactory('Proxy')
    const proxy = await Proxy.deploy()

    await proxy.deployed()
    await expect(proxy.connect(other).transferOwnership(receiver.address))
      .to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('Not owner call setFunctionImplementation', async () => {
    const [, other] = await ethers.getSigners()
    const Proxy = await ethers.getContractFactory('Proxy')
    const Greeter = await ethers.getContractFactory('Greeter')
    const Implementation = await ethers.getContractFactory('Implementation')
    const proxy = await Proxy.deploy()
    const greeter = await Greeter.deploy('Hello, world!')
    const impl = await Implementation.deploy(greeter.address)

    await proxy.deployed()
    await impl.deployed()
    // 0xa4136862 is Implementation contract's setGreeting method
    await expect(proxy.connect(other).setFunctionImplementation('0xa4136862', impl.address))
      .to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('Not owner call bootstrap', async () => {
    const [, other] = await ethers.getSigners()
    const Proxy = await ethers.getContractFactory('Proxy')
    const Greeter = await ethers.getContractFactory('Greeter')
    const Implementation = await ethers.getContractFactory('Implementation')
    const proxy = await Proxy.deploy()
    const greeter = await Greeter.deploy('Hello, world!')
    const impl = await Implementation.deploy(greeter.address)

    await proxy.deployed()
    await greeter.deployed()
    await impl.deployed()
    await expect(proxy.connect(other).bootstrap(impl.address))
      .to.be.revertedWith('Ownable: caller is not the owner')
  })
})
