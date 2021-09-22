import 'hardhat/types/config'
import 'hardhat/types/runtime'
import { Contract, Event } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/abstract-provider'

declare module 'hardhat/types/config' {
  export interface HardhatUserConfig {
    proxies?: {
      [networkName: string]: string
    }
  }

  export interface HardhatConfig {
    proxies: {
      [networkName: string]: string
    }
  }
}

declare module '@ethersproject/abstract-provider' {
  export interface TransactionReceipt {
    events: Event[]
  }
}

declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    proxy: {
      bootstrap: (impl: string) => Promise<TransactionResponse>
      address: string
      deploy: () => Promise<Contract>
    }
  }
}
