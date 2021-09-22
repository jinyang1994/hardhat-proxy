import { CLIArgumentType } from 'hardhat/types'
import { HardhatError } from 'hardhat/internal/core/errors'
import { ERRORS } from 'hardhat/internal/core/errors-list'
import { isAddress } from '@ethersproject/address'

export const address: CLIArgumentType<string> = {
  name: 'address',
  parse: (_, strValue) => strValue,
  validate: (argName: string, value: any): void => {
    const is = typeof value === 'string' && isAddress(value)

    if (!is) {
      throw new HardhatError(ERRORS.ARGUMENTS.INVALID_VALUE_FOR_TYPE, {
        value,
        name: argName,
        type: address.name
      })
    }
  }
}
