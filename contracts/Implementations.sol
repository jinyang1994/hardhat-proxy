//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Ownable.sol';

abstract contract Implementations is Ownable {
    /**
     * @dev Storage slot with the address of the current implementation.
     * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    event ProxyFunctionUpdated(
        bytes4 indexed selector,
        address oldImpl,
        address newImpl
    );

    struct ImplsStorage {
        // Mapping of function selector -> function implementation
        mapping(bytes4 => address) impls;
    }

    function getImplsStorage()
        internal
        pure
        returns (ImplsStorage storage stor)
    {
        assembly {
            stor.slot := _IMPLEMENTATION_SLOT
        }
    }

    /**
     * @dev Set the implementation contract of a function.
     * @param selector The function selector.
     * @param impl The implementation contract address.
     */
    function setFunctionImplementation(bytes4 selector, address impl)
        external
        onlyOwner
    {
        address oldImpl = getImplsStorage().impls[selector];
        getImplsStorage().impls[selector] = impl;
        emit ProxyFunctionUpdated(selector, oldImpl, impl);
    }

    /**
     * @dev Get the implementation contract of a registered function.
     * @param selector The function selector.
     * @return impl The implementation contract address.
     */
    function getFunctionImplementation(bytes4 selector)
        public
        view
        returns (address impl)
    {
        return getImplsStorage().impls[selector];
    }
}
