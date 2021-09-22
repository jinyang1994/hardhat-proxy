// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract Greeter {
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        // solhint-disable quotes
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        // solhint-enable quotes
        greeting = _greeting;
    }
}
