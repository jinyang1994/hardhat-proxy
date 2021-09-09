// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract Ownable {
    /**
     * @dev Storage slot with the owner of the contract.
     * This is the keccak-256 hash of "eip1967.proxy.owner" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _OWNER_SLOT =
        0xa7b53796fd2d99cb1f5ae019b54f9e024446c3d12b483f733ccc62ed04eb126a;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    struct OwnableStorage {
        address owner;
    }

    function getOwnableStorage()
        internal
        pure
        returns (OwnableStorage storage stor)
    {
        assembly {
            stor.slot := _OWNER_SLOT
        }
    }

    constructor() {
        _setOwner(msg.sender);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == msg.sender, 'Ownable: caller is not the owner');
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return getOwnableStorage().owner;
    }

    /**
     * @dev Change the owner of the contract.
     * @param newOwner Set new owner of the contract.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _setOwner(newOwner);
    }

    /**
     * @dev Set a owner
     * @param newOwner Set new owner of the contract.
     */
    function _setOwner(address newOwner) private {
        address oldOwner = getOwnableStorage().owner;
        getOwnableStorage().owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
