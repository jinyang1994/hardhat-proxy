// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '../../contracts/Register.sol';
import '../../contracts/utils/LibRegister.sol';
import './interface/IGreeter.sol';

contract Implementation is Register {
    address private immutable target;

    constructor(address _target) {
        target = _target;
    }

    function register() public override returns (bytes4 success) {
        _register(this.setGreeting.selector);
        _register(this.setGreetingA.selector);
        _register(this.setGreetingB.selector);
        return LibRegister.REGISTER_SUCCESS;
    }

    function setGreeting(string memory greet) public {
        IGreeter(target).setGreeting(greet);
    }

    function setGreetingA() public {
        setGreeting('Changed by setGreetingA');
    }

    function setGreetingB() public {
        setGreeting('Changed by setGreetingB');
    }
}
