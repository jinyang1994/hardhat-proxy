const { expect } = require('chai')
const { ethers } = require('hardhat')
const { BigNumber } = require('@ethersproject/bignumber')

describe('Proxy', () => {
  it('Register function implementation', async () => {
    const Proxy = await ethers.getContractFactory('Proxy')
    const Greeter = await ethers.getContractFactory('Greeter')
    const ImplementationA = await ethers.getContractFactory('ImplementationA')
    const ImplementationB = await ethers.getContractFactory('ImplementationB')
    const proxy = await Proxy.deploy()
    const greeter = await Greeter.deploy('Hello, world!')
    const implA = await ImplementationA.deploy(greeter.address)
    const implB = await ImplementationB.deploy(greeter.address)

    await proxy.deployed()
    await greeter.deployed()
    await implA.deployed()
    await implB.deployed()

    await proxy.bootstrap(implA.address)
    await proxy.bootstrap(implB.address)

    // 0x8d75376a is ImplementationA contract's setGreetingA function
    const setGreetingA = await proxy.getFunctionImplementation('0x8d75376a')
    // 0x22df2236 is ImplementationB contract's setGreetingB function
    const setGreetingB = await proxy.getFunctionImplementation('0x22df2236')

    // Check methods implementation address
    expect(setGreetingA).to.be.equal(implA.address)
    expect(setGreetingB).to.be.equal(implB.address)
  })

  it('Proxy call implementation contract', async () => {
    const signer = await ethers.getSigner()
    const Proxy = await ethers.getContractFactory('Proxy')
    const Greeter = await ethers.getContractFactory('Greeter')
    const ImplementationA = await ethers.getContractFactory('ImplementationA')
    const ImplementationB = await ethers.getContractFactory('ImplementationB')
    const proxy = await Proxy.deploy()
    const greeter = await Greeter.deploy('Hello, world!')
    const implA = await ImplementationA.deploy(greeter.address)
    const implB = await ImplementationB.deploy(greeter.address)

    await proxy.deployed()
    await greeter.deployed()
    await implA.deployed()
    await implB.deployed()

    await proxy.bootstrap(implA.address)
    await proxy.bootstrap(implB.address)

    const greet = await greeter.greet()
    // Check greeter original greet
    expect(greet).to.be.equal('Hello, world!')

    // Run setGreetingA in proxy
    {
      const { data } = await implA.populateTransaction.setGreetingA()
      const tx = await signer.sendTransaction({
        to: proxy.address,
        value: BigNumber.from('0').toHexString(),
        gasPrice: BigNumber.from('45000000000').toHexString(),
        gasLimit: BigNumber.from('1111000').toHexString(),
        data
      })

      await tx.wait()

      const greet = await greeter.greet()
      // Check greet after run setGreetingA
      expect(greet).to.be.equal('Changed by ImplementationA')
    }

    // Run setGreetingB in proxy
    {
      const { data } = await implB.populateTransaction.setGreetingB()
      const tx = await signer.sendTransaction({
        to: proxy.address,
        value: BigNumber.from('0').toHexString(),
        gasPrice: BigNumber.from('45000000000').toHexString(),
        gasLimit: BigNumber.from('1111000').toHexString(),
        data
      })

      await tx.wait()

      const greet = await greeter.greet()
      // Check greet after run setGreetingB
      expect(greet).to.be.equal('Changed by ImplementationB')
    }
  })
})
