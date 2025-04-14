const hre = require("hardhat");

async function main() {
  const Diary = await hre.ethers.getContractFactory("Diary");

  // Deploy the contract
  const diary = await Diary.deploy();

  // Wait for the deployment to be mined
  await diary.waitForDeployment();

  // Get deployed address
  console.log("Diary contract deployed to:", diary.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
