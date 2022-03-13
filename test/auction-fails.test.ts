import { ethers, waffle, network } from "hardhat";
import { expect } from "chai";
import { Auction } from "../typechain";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { fixtureDeployedAuction } from "./common-fixtures";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { loadFixture } = waffle;

declare module "mocha" {
  export interface Context {
    auction: Auction;
  }
}

describe("Auction: failing paths", function () {   
  let auction: Auction; 
  let firstBidder: SignerWithAddress;
  let secondBidder: SignerWithAddress;
  const amount = ethers.utils.parseEther("1");
  const higherAmount = ethers.utils.parseEther("1.5");
  const lowerAmount = ethers.utils.parseEther("0.5");
  before(async () => {
    const firstAuctionData = {
      value: amount,
    };
    auction = await loadFixture(fixtureDeployedAuction);
    [firstBidder, secondBidder] = await ethers.getSigners();
    await auction.auction(firstAuctionData);
  });

  describe("WHEN a user auctions less than the current winning amount", function () {
    const losingAuctionData = {
      value: lowerAmount,
    };
    it("THEN the transaction fails", async () => {
      return expect(auction.connect(secondBidder).auction(losingAuctionData)).to.revertedWith("Auction not won");
    });
    it("THEN the first auctioner is still the winner", async () => {
      const winner = await auction.winner();
      return expect(winner).to.equal(firstBidder.address);
    });
  });

  describe("WHEN a user tries to withdraw and has no balance", function () {
    it("THEN the transaction fails", async () => {
      return expect(auction.withdraw()).to.revertedWith("Sender does not have a withdrawable amount");
    });
  });

  describe("WHEN a user tries to claim and the auction is not finished", function () {
    it("THEN the transaction fails", async () => {
      return expect(auction.claim()).to.revertedWith("The auction's not closed yet");
    });
  });

  describe("WHEN a user auctions after the auction has finished", async () => {
    const winningAuctionData = {
      value: higherAmount,
    };
    before(async () => {
      //pass enough blocks so that the auction is finished
      await network.provider.send("hardhat_mine", ["0x100"]);
    });
    it("THEN the transaction fails", async () => {
      return expect(auction.connect(secondBidder).auction(winningAuctionData)).to.revertedWith("Auction finished");
    });
  });
  describe("WHEN a user tries to claim and is not the winner", function () {
    it("THEN the transaction fails", async () => {
      return expect(auction.connect(secondBidder).claim()).to.revertedWith("You are not the winner");
    });
  });
}); 
