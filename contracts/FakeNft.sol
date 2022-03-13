// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


/**
    @author Manuel Aguilar
    @title FakeNft
    @notice A contract with just the safeTransferFrom method for testing purposes.
 */

contract FakeNft {
    
    /** 
        @notice Function that's called and does nothing.
    */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual {
        //do nothing
    }
}