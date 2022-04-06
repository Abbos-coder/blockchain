require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");
const privateKey = "e2d2e754def3882d5cfd4253991d334150d6428495f12c57875febebf1bb1027";

module.exports = {
    defaultNetwork: "bsctest",
    networks: {
        hardhat: {
            chainId: 1337,
        },

        bsctest: {
            // Bsc Testnet
            url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            accounts: [privateKey],
        },
    },
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    etherscan: {
        apiKey: "K5AI5N7ZPC9EF6G9MVQF33CBVMY1UKQ7HI",
    },
};
