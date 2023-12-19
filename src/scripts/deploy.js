// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('node:fs');

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;

    const lockedAmount = hre.ethers.parseEther("0.001");

    const lock = await hre.ethers.deployContract("ClearOriginNetwork", ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266']);

    await lock.waitForDeployment();

    console.log(`Lock with ${ethers.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`);


    const content = `export const environment = {
        production: false,
        contractAddress: "${lock.target}"
};`;
    fs.writeFile('frontend/src/environment/environment.ts', content, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
