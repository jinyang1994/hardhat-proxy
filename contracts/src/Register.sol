//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interface/IProxy.sol";

abstract contract Register {
  /// @dev The implementation address of this feature.
  address internal immutable _implementation;

  constructor() {
    _implementation = address(this);
  }

  /// @dev Initialize and register the implementation.
  function register() external virtual returns (bytes4 success);

  /**
   * @dev Register or replace a function.
   * @param selector The function selector.
   */
  function _register(bytes4 selector) internal {
    IProxy(address(this)).setFunctionImplementation(selector, _implementation);
  }
}
