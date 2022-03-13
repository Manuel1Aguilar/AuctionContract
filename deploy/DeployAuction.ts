import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  //Fake nft deploy for testing purposes
  const fakeNft = await deploy("FakeNft", {
    from: deployer,
  });

  await deploy("Auction", {
    from: deployer,
    args: [fakeNft.address, 999, 50],
  });
};
export default deployFunc;

deployFunc.id = "deployed_Auction"; // id required to prevent reexecution
