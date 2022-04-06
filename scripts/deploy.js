const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const MyTeamArt = await hre.ethers.getContractFactory("MyTeamArt");
  const currency = "0xCBb18CE5Ae73FAd402171c1Ca72A2f42d319D634"
  const nftMarket = await MyTeamArt.deploy(currency, 2);
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  let config = `
  export const nftmarketaddress = "${nftMarket.address}"
  export const nftaddress = "${nft.address}"
  export const currency = "${currency}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
