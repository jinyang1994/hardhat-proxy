//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProxy {
    /**
     * @dev Set the implementation contract of a function.
     * @param selector The function selector.
     * @param impl The implementation contract address.
     */
    function setFunctionImplementation(bytes4 selector, address impl) external;
}
