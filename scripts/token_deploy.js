import 'dotenv/config';

async function main(contractName) {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  try {
    const TestToken = await ethers.getContractFactory(contractName);
    const testToken = await TestToken.deploy(process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS); // ethers.parseUnits("1000", 18)
    console.log("contract deployed to: ", testToken.target);
  }
  catch (error) {
    console.log(error && error.message)
  }
}


main(process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });