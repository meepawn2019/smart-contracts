// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenERC20 is ERC20, Ownable {
    constructor() ERC20("TechExamToken", "TEK") Ownable(msg.sender) {}

    /// @notice Mint new tokens to the caller's address
    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }

    /// @notice Mint new tokens to a specific address (only owner)
    function mintTo(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
