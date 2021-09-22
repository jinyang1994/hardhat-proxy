# hardhat-proxy

Hardhat plugin for integration with [proxy contract](./contracts/Proxy.sol).

### Required plugins

- [**@nomiclabs/hardhat-ethers**](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-ethers)

## What

This plugin brings the [proxy contract](./contracts/Proxy.sol) to Hardhat, which allows you to manage the proxy contract in a simple way.

## Installation

```base
npm install --save-dev hardhat-proxy
```

Add the following statement to your `hardhat.config.js`:

```javascript
require('hardhat-proxy')
```

Or, if you are using TypeScript, add this to your `hardhat.config.ts`:

```typescript
import 'hardhat-proxy'
```

### Configuration

You need to add the proxy contract address in `hardhat.config.js`.

Config example:

```typescript
export default {
  proxies: {
    hardhat: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  }
}
```

Note: you need to manually add the output proxy address in the `hardhat.config.js` after running `hardhat proxy:deploy`

### Usage

First, use `Register` in your implementation contract.

```solidity
import 'hardhat-proxy/contracts/Register.sol';

contract Implementation is Register {
  function foo() public {
    // Doing something
  }
}

```

Second, override function `register`, and return constant `LibRegister.REGISTER_SUCCESS`.

```solidity
import 'hardhat-proxy/contracts/Register.sol';
import 'hardhat-proxy/contracts/utils/LibRegister.sol';

contract Implementation is Register {
  function register() public override returns (bytes4 success) {
    _register(this.foo.selector);
    return LibRegister.REGISTER_SUCCESS;
  }
}

```

Last, use `scripts` or `CLI` to register it to proxy contract.

Scripts example:

```typescript
import hre from 'hardhat'

await hre.proxy.bootstrap('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9')
```

CLI example:

```bash
$ hardhat proxy:deploy --network localhost --impl 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

## Tasks

This plugin implements a `proxy` and `proxy:deploy` task.

The `proxy:deploy` task can deploy a proxy contract to ethereum network.

```bash
$ hardhat proxy:deploy --network localhost

Proxy contract deployed in hardhat: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

The `proxy` task can register an implementation contract to proxy contract

```bash
$ hardhat proxy:deploy --network localhost --impl 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9

┌────────────┬────────────────────────────────────────────┬────────────────────────────────────────────┐
│ Selector   │ Old implementation                         │ New implementation                         │
├────────────┼────────────────────────────────────────────┼────────────────────────────────────────────┤
│ 0xa4136862 │ 0x0000000000000000000000000000000000000000 │ 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 │
├────────────┼────────────────────────────────────────────┼────────────────────────────────────────────┤
│ 0x8d75376a │ 0x0000000000000000000000000000000000000000 │ 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 │
├────────────┼────────────────────────────────────────────┼────────────────────────────────────────────┤
│ 0x22df2236 │ 0x0000000000000000000000000000000000000000 │ 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 │
└────────────┴────────────────────────────────────────────┴────────────────────────────────────────────┘
```

| Option | Type    | Default   | Description                            |
| ------ | ------- | --------- | -------------------------------------- |
| impl   | Address | undefined | The implementation contract's address. |

## Environment extensions

This plugins adds a proxy object to the Hardhat Runtime Environment. You can use it in hardhat scripts.

```typescript
declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    proxy: {
      address: string
      bootstrap: (impl: string) => Promise<TransactionResponse>
      deploy: () => Promise<Contract>
    }
  }
}
```

- `address`: The proxy address of current network
- `bootstrap`: Register implementation contract to proxy contract
- `deploy`: Deploy proxy contract

## Contract Introduction

[TODO]()
