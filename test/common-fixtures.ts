import { ethers, deployments } from "hardhat";

import { Auction } from "../typechain";

export async function fixtureDeployedAuction(): Promise<Auction> {
  await deployments.fixture();
  const deployedContract = await deployments.getOrNull("Auction");
  if (deployedContract == undefined) throw new Error("No Auction deployed. Something weird happened");
  const auction = await ethers.getContractAt("Auction", deployedContract.address);
  return auction as Auction;
}
