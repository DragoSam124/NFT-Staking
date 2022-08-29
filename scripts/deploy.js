// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.deployed();
  console.log("Reward Token Address: ", rewardToken.address);
  
  const NftToken = await hre.ethers.getContractFactory("NftToken");
  const nftToken = await NftToken.deploy();
  await nftToken.deployed();
  console.log("NFT Token Address: ", nftToken.address);
  
  const StakingSystem = await hre.ethers.getContractFactory("StakingSystem");
  const stakingSystem = await StakingSystem.deploy(nftToken.address, rewardToken.address);
  await stakingSystem.deployed();
  console.log("Staking Contract Address: ", stakingSystem.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
