import { ethers, waffle, network } from "hardhat";
import { expect } from "chai";
import { Auction } from "../typechain";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { fixtureDeployedAuction } from "./common-fixtures";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { loadFixture } = waffle;

declare module "mocha" {
  export interface Context {
    auction: Auction;
  }
}

describe("Auction: Succesful auctioning - default", function () {
  let auction: Auction;
  let firstAuctioner: SignerWithAddress;
  let secondAuctioner: SignerWithAddress;
  let tx: TransactionResponse;
  const amount = ethers.utils.parseEther("1");
  const higherAmount = ethers.utils.parseEther("1.5");
  before(async () => {
    auction = await loadFixture(fixtureDeployedAuction);
    [firstAuctioner, secondAuctioner] = await ethers.getSigners();
  });

  describe("WHEN a user auctions for the first time", function () {
    before(async function () {
      const firstAuctionData = {
        value: amount,
      };
      tx = await auction.auction(firstAuctionData);
    });
    it("THEN an event is emitted", async () => {
      return expect(tx).to.emit(auction, "Won").withArgs(firstAuctioner.address, amount, tx.blockNumber);
    });
    it("THEN the auctioner is the winner", async () => {
      const winner = await auction.winner();
      return expect(winner).to.equal(firstAuctioner.address);
    });
  });
  describe("WHEN another user auctions a higher amount", function () {
    before(async function () {
      const secondAuctionData = {
        value: higherAmount,
      };

      tx = await auction.connect(secondAuctioner).auction(secondAuctionData);
    });
    it("THEN an event is emitted", async () => {
      return expect(tx).to.emit(auction, "Won").withArgs(secondAuctioner.address, higherAmount, tx.blockNumber);
    });
    it("THEN the highest bidder is the winner", async () => {
      const winner = await auction.winner();
      return expect(winner).to.equal(secondAuctioner.address);
    });
    it("THEN the old winner has withdrawable balance", async () => {
      const withdrawableBalance = await auction.withdrawableAmounts(firstAuctioner.address);
      return expect(withdrawableBalance).to.equal(amount);
    });
  });
  describe("WHEN a user withdraws their balance", function () {
    before(async function () {
      tx = await auction.withdraw();
    });
    it("THEN a WITHDRAW event is emitted", async () => {
      return expect(tx).to.emit(auction, "Withdrawn").withArgs(firstAuctioner.address, amount);
    });
    it("THEN the withdrawer's withdrawable balance is back to 0", async () => {
      const withdrawableBalance = await auction.withdrawableAmounts(firstAuctioner.address);
      return expect(withdrawableBalance).to.equal(0);
    });
  });

  describe("WHEN the auction's finished and a user claims", function () {
    before(async function () {
      //pass enough blocks so that the auction is finished
      await network.provider.send("hardhat_mine", ["0x100"]);
      tx = await auction.connect(secondAuctioner).claim();
    });
    it("THEN a CLAIM event is emitted", async () => {
      return expect(tx).to.emit(auction, "Claimed").withArgs(secondAuctioner.address);
    });
  });
});
