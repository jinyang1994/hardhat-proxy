// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IGreeter.sol";
import "../src/Register.sol";
import "../src/utils/LibRegister.sol";

contract ImplementationA is Register {
  address private immutable target;

  constructor(address _target) {
    target = _target;
  }

  function register() public override returns (bytes4 success) {
    _register(this.setGreetingA.selector);
    return LibRegister.REGISTER_SUCCESS;
  }

  function setGreetingA() public {
    IGreeter(target).setGreeting("Changed by ImplementationA");
  }
}
