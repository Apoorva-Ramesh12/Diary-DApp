require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19", // Or the version you used
  networks: {
    hardhat: {},
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ["0x583c6410f229e8ebec23e53479c0a37edb463e1a49383b3a3e83df5411e6e2cd"],
      chainId: 1337,
    },
  },
};