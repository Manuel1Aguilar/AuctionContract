// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Auction {
    IERC721 public nftContract;
    uint256 public nftId;
    uint256 public winningValue;
    address public winner;
    mapping (address => uint256) public withdrawableAmounts;
    uint256 public blockLimit;
    uint256 public winningBlock;
    // bool public tokenSent;

    /**
        @notice Event emitted when someone auctions and is declared the new winner
        @param winner The address that is winnning the auction
        @param amount Amount sent in WEIs
     */
    event Won(address indexed winner, uint256 amount, uint256 winningBlock);

    /**
        @notice Event emitted when someone withdraws their available eth
        @param withdrawer The address that withdrew its WEIs
        @param amount Amount withdrawn
     */
    event Withdrawn(address indexed withdrawer, uint256 amount);
    /**
        @notice Event emitted when someone claims the nft they won
        @param withdrawer The address that claimed the nft
     */
    event Claimed(address indexed withdrawer);

    constructor (address _nftAddress, uint256 _nftId, uint256 _blockLimit) {
        nftContract = IERC721(_nftAddress);
        nftId = _nftId;
        blockLimit = _blockLimit;
    }

    function auction() public payable {
        require(msg.value > winningValue, "Auction not won");
        require(block.number < winningBlock + blockLimit || winningBlock == 0, "Auction finished");
        withdrawableAmounts[winner] = winningValue;
        winner = msg.sender;
        winningValue = msg.value;
        winningBlock = block.number;
        emit Won(msg.sender, winningValue, winningBlock);
    }

    function withdraw() public {
        require(withdrawableAmounts[msg.sender] > 0, "Sender does not have a withdrawable amount");
        uint256 value = withdrawableAmounts[msg.sender];
        withdrawableAmounts[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{ value: value }("");
        require(success, "Transfer failed");
        emit Withdrawn(msg.sender, value);
    }

    function claim() public {
        // Check sender is the winner and the auction is closed
        require(block.number >= winningBlock + blockLimit, "The auction's not closed yet");
        require(winner == msg.sender, "You are not the winner");
        // I'm not checking if the token has been claimed already because there's only one NFT on the contract
        // Transfer token
        nftContract.safeTransferFrom(address(this), winner, nftId);

        emit Claimed(msg.sender);
    }


    
}
