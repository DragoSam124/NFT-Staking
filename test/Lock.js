const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const {BigNumber} = require('ethers')

describe("Staking", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    const RewardToken = await ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy();
    await rewardToken.deployed();
    
    const NftToken = await ethers.getContractFactory("NftToken");
    const nftToken = await NftToken.deploy();
    await nftToken.deployed();
    
    const StakingSystem = await ethers.getContractFactory("StakingSystem");
    const stakingSystem = await StakingSystem.deploy(nftToken.address, rewardToken.address);
    await stakingSystem.deployed();

    return { owner, addr1, addr2, rewardToken, nftToken, stakingSystem };
  }

  describe("Staking", function () {
    it("Reward Token Test", async function () {
      const {owner, addr1, addr2, rewardToken} = await deploy();

      await rewardToken.mint(addr1.address, BigNumber.from("1000"));
      expect(await rewardToken.balanceOf(addr1.address)).to.equal(BigNumber.from("1000"))
    });
    it("NFT Token Test", async function() {
      const {owner, nftToken} = await deploy()

      expect(await nftToken.name()).to.equal("NFT Tokens");
      expect(await nftToken.symbol()).to.equal("KKK")

      await nftToken.mint("123");
      expect(await nftToken.ownerOf(BigNumber.from("1"))).to.equal(owner.address)
      expect(await nftToken.tokenURI(BigNumber.from("1"))).to.equal("https://ipfs.io/ipfs/123");
    })
    it("Staking Contract", async function() {
      const {owner, nftToken, rewardToken, stakingSystem} = await deploy()

      await nftToken.mint(1);
      await nftToken.mint(2);
      await nftToken.mint(3);

      await stakingSystem.initStaking();
      await nftToken.setApprovalForAll(stakingSystem.address, true);

      await stakingSystem.stake(1);
      await stakingSystem.stake(2);
      await stakingSystem.stake(3);
    })
  })
})
