// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
    @author Manuel Aguilar
    @title Auction
    @notice A contract that allows user to auction for an nft and then lets the winner claim
    it after the auction is closed. It also let's losing bidders withdraw their bid.
 */

contract Auction {
    /**
        @notice Auctioned NFT contract's address
     */
    IERC721 public nftContract;
    /**
        @notice Auctioned NFT Id
     */
    uint256 public nftId;
    /**
        @notice Current winning bid value
     */
    uint256 public winningValue;
    /**
        @notice Current winner's address
     */
    address public winner;
    /**
        @notice Tracks the withdrawable amounts of the addresses that have been outbid
     */
    mapping(address => uint256) public withdrawableAmounts;
    /**
        @notice Limit of blocks that can pass between bids for the auction to still
        be considered open
     */
    uint256 public blockLimit;
    /**
        @notice Block number of the latest winning bid
     */
    uint256 public winningBlock;

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

    /**
        @notice Set the NFT's contract address and Id as well as the blockLimit
     */
    constructor(
        address _nftAddress,
        uint256 _nftId,
        uint256 _blockLimit
    ) {
        nftContract = IERC721(_nftAddress);
        nftId = _nftId;
        blockLimit = _blockLimit;
    }

    /**
        @notice Function that lets users bid for the nft
     */
    function auction() public payable {
        require(msg.value > winningValue, "Auction not won");
        require(block.number < winningBlock + blockLimit || winningBlock == 0, "Auction finished");
        withdrawableAmounts[winner] = winningValue;
        winner = msg.sender;
        winningValue = msg.value;
        winningBlock = block.number;
        emit Won(msg.sender, winningValue, winningBlock);
    }

    /**
        @notice Function that lets users withdraw ther bids if they lose
     */
    function withdraw() public {
        require(withdrawableAmounts[msg.sender] > 0, "Sender does not have a withdrawable amount");
        uint256 value = withdrawableAmounts[msg.sender];
        withdrawableAmounts[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{ value: value }("");
        require(success, "Transfer failed");
        emit Withdrawn(msg.sender, value);
    }

    /**
        @notice Function that lets withdraw users claim their NFT once the auction is closed
        and they are the winners. I'm not checking if the token has been claimed already because 
        there's only one NFT on the contract, there doesn't seem to be a risk that merits doing
        the checks.
     */
    function claim() public {
        require(block.number >= winningBlock + blockLimit, "The auction's not closed yet");
        require(winner == msg.sender, "You are not the winner");
        nftContract.safeTransferFrom(address(this), winner, nftId);

        emit Claimed(msg.sender);
    }
}
