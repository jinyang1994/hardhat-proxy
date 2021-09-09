//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibRegister {
    /// @dev Magic bytes returned by a register to indicate success.
    ///      This is `keccack('REGISTER_SUCCESS')`.
    bytes4 internal constant REGISTER_SUCCESS = 0x8c2a7993;

    function delegatecallRegisterFunction(address target) internal {
        (bool success, bytes memory resultData) = target.delegatecall(
            abi.encodeWithSignature('register()')
        );
        require(
            success &&
                resultData.length == 32 &&
                abi.decode(resultData, (bytes4)) == REGISTER_SUCCESS,
            'RegisterFailedError'
        );
    }
}
