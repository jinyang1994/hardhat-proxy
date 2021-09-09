//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Implementations.sol";
import "./utils/LibRegister.sol";

contract Proxy is Implementations {
  /**
   * @dev Get function selector of calldata
   * @param selector The function selector.
   */
  function getSelector() private pure returns (bytes4 selector) {
    require(msg.data.length >= 4, "InvalidByteOperation");
    assembly {
      selector := calldataload(0x0)
      selector := and(selector, 0xFFFFFFFF00000000000000000000000000000000000000000000000000000000)
    }
    return selector;
  }

  /**
   * @dev Call target contract register functions
   * @param target The target contract address
   */
  function bootstrap(address target) public onlyOwner {
    address owner = getOwnableStorage().owner;

    // Set the owner to ourselves to allow bootstrap to call `setFunctionImplementation()`.
    getOwnableStorage().owner = address(this);
    LibRegister.delegatecallRegisterFunction(target);
    getOwnableStorage().owner = owner;
  }

  /// @dev Forwards calls to the appropriate implementation contract.
  fallback() external payable {
    bytes4 selector = getSelector();
    address impl = getFunctionImplementation(selector);
    require(impl != address(0), "NotImplementedError");
    (bool success, bytes memory resultData) = impl.delegatecall(msg.data);
    require(success, string(resultData));
  }

  // solhint-disable no-empty-blocks

  /// @dev Fallback for just receiving ether.
  receive() external payable {}

  // solhint-enable no-empty-blocks
}
