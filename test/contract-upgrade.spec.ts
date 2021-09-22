import { expect } from 'chai'
import { BigNumber } from '@ethersproject/bignumber'
import { useFixture } from './helpers'

describe('Contract Upgrade', () => {
  useFixture('simple-project')

  before(async function () {
    await this.env.run('compile')
  })

  it('Owner update implementation contract', async function () {
    const { ethers } = this.env
    const [signer] = await ethers.getSigners()
    const Proxy = await ethers.getContractFactory('Proxy')
    const FirstGreeter = await ethers.getContractFactory('Greeter')
    const LastGreeter = await ethers.getContractFactory('Greeter')
    const FirstImplementation = await ethers.getContractFactory(
      'Implementation'
    )
    const LastImplementation = await ethers.getContractFactory('Implementation')
    const proxy = await Proxy.deploy()
    const firstGreeter = await FirstGreeter.deploy('Hello, world! - First')
    const lastGreeter = await LastGreeter.deploy('Hello, world! - Last')
    // firstImpl stores greet in firstGreeter
    const firstImpl = await FirstImplementation.deploy(firstGreeter.address)
    // lastImpl stores greet in lastGreeter
    const lastImpl = await LastImplementation.deploy(lastGreeter.address)

    await proxy.deployed()
    await firstGreeter.deployed()
    await lastGreeter.deployed()
    await firstImpl.deployed()
    await lastImpl.deployed()

    const firstGreet = await firstGreeter.greet()
    const lastGreet = await lastGreeter.greet()
    // Check original greet
    expect(firstGreet).to.be.equal('Hello, world! - First')
    expect(lastGreet).to.be.equal('Hello, world! - Last')

    // Register first implementation
    {
      await proxy.bootstrap(firstImpl.address)

      const { data } = await firstImpl.populateTransaction.setGreeting(
        'Changed by FirstImpl'
      )
      const tx = await signer.sendTransaction({
        to: proxy.address,
        value: BigNumber.from('0').toHexString(),
        gasPrice: BigNumber.from('45000000000').toHexString(),
        gasLimit: BigNumber.from('1111000').toHexString(),
        data
      })

      await tx.wait()

      const greet = await firstGreeter.greet()
      // Check greet after run firstImpl.setGreeting
      expect(greet).to.be.equal('Changed by FirstImpl')
      // Check proxy implementation address
      expect(await proxy.getFunctionImplementation('0xa4136862')).to.be.equal(
        firstImpl.address
      )
    }

    // Register last implementation
    {
      await proxy.bootstrap(lastImpl.address)

      const { data } = await lastImpl.populateTransaction.setGreeting(
        'Changed by LastImpl'
      )
      const tx = await signer.sendTransaction({
        to: proxy.address,
        value: BigNumber.from('0').toHexString(),
        gasPrice: BigNumber.from('45000000000').toHexString(),
        gasLimit: BigNumber.from('1111000').toHexString(),
        data
      })

      await tx.wait()

      const greet = await lastGreeter.greet()
      // Check greet after run lastImpl.setGreeting
      expect(greet).to.be.equal('Changed by LastImpl')
      // Check proxy implementation address
      expect(await proxy.getFunctionImplementation('0xa4136862')).to.be.equal(
        lastImpl.address
      )
    }

    // And, consistency between use firstImpl and use lastImpl
    {
      const { data } = await firstImpl.populateTransaction.setGreeting(
        'Changed by FirstImpl'
      )
      const tx = await signer.sendTransaction({
        to: proxy.address,
        value: BigNumber.from('0').toHexString(),
        gasPrice: BigNumber.from('45000000000').toHexString(),
        gasLimit: BigNumber.from('1111000').toHexString(),
        data
      })

      await tx.wait()

      const greet = await lastGreeter.greet()
      // Check lastGreeter's greet after run firstImpl.setGreeting
      expect(greet).to.be.equal('Changed by FirstImpl')
    }
  })
})
