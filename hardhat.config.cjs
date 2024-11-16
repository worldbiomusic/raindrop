require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepoliaBase: {
      url: process.env.BASE_SEPOLIA_RPC_URL,
      accounts: [`${process.env.ADMIN_PRIVATE_KEY}`], // 0x를 포함해서 프라이빗 키를 설정
    },
  }
};
