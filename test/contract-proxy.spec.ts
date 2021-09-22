import { expect } from 'chai'
import { BigNumber } from '@ethersproject/bignumber'
import { useFixture } from './helpers'

describe('Contract Proxy', () => {
  useFixture('simple-project')

  before(async function () {
    await this.env.run('compile')
  })

  it('Register function implementation', async function () {
    const { ethers } = this.env
    const Proxy = await ethers.getContractFactory('Proxy')
    const Greeter = await ethers.getContractFactory('Greeter')
    const Implementation = await ethers.getContractFactory('Implementation')
    const proxy = await Proxy.deploy()
    const greeter = await Greeter.deploy('Hello, world!')
    const impl = await Implementation.deploy(greeter.address)

    await proxy.deployed()
    await greeter.deployed()
    await impl.deployed()

    // register functiom implementation
    await proxy.bootstrap(impl.address)

    // 0x8d75376a is Implementation contract's setGreetingA function
    const setGreetingA = await proxy.getFunctionImplementation('0x8d75376a')
    // 0x22df2236 is Implementation contract's setGreetingB function
    const setGreetingB = await proxy.getFunctionImplementation('0x22df2236')

    // Check methods implementation address
    expect(setGreetingA).to.be.equal(impl.address)
    expect(setGreetingB).to.be.equal(impl.address)
  })

  it('Proxy call implementation contract', async function () {
    const { ethers } = this.env
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

    {
      const greet = await greeter.greet()
      // Check greeter original greet
      expect(greet).to.be.equal('Hello, world!')
    }

    // Run setGreetingA in proxy
    {
      const { data } = await impl.populateTransaction.setGreetingA()
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
      expect(greet).to.be.equal('Changed by setGreetingA')
    }

    // Run setGreetingB in proxy
    {
      const { data } = await impl.populateTransaction.setGreetingB()
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
      expect(greet).to.be.equal('Changed by setGreetingB')
    }
  })
})
