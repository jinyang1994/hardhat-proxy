// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './interface/IGreeter.sol';
import '../src/Register.sol';
import '../src/utils/LibRegister.sol';

contract ImplementationB is Register {
    address private immutable target;

    constructor(address _target) {
        target = _target;
    }

    function register() public override returns (bytes4 success) {
        _register(this.setGreetingB.selector);
        return LibRegister.REGISTER_SUCCESS;
    }

    function setGreetingB() public {
        IGreeter(target).setGreeting('Changed by ImplementationB');
    }
}
