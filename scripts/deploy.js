const hre = require('hardhat')
const ethers = hre.ethers;

function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

async function deployLibraryContract() {
    await hre.run('compile'); // We are compiling the contracts using subtask
    const [deployer] = await ethers.getSigners(); // We are getting the deployer
  
    console.log('Deploying contracts with the account:', deployer.address); // We are printing the address of the deployer
    console.log('Account balance:', (await deployer.getBalance()).toString()); // We are printing the account balance

    const Library = await ethers.getContractFactory("Library"); // 
    const libraryContract = await Library.deploy();
    console.log('Waiting for Library deployment...');
    await libraryContract.deployed();

    console.log('Library Contract address: ', libraryContract.address);
    console.log('Done!');

    await delay(30);

    await hre.run("verify:verify", {
        address: libraryContract.address,
        constructorArguments: [
         // if any
        ],
      });
}
  
module.exports = deployLibraryContract;