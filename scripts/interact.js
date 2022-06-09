const hre = require("hardhat");
const USElection = require('./artifacts/contracts/USElection.sol/USElection.json')


const run = async function() {

	const provider = new hre.ethers.providers.JsonRpcProvider("http://localhost:8545")
	const latestBlock = await provider.getBlock("latest")
	console.log(latestBlock.hash)

    const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
	const balance = await wallet.getBalance();
	console.log(hre.ethers.utils.formatEther(balance, 18))
    console.log(balance.toString())

	const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
	const electionContract = new hre.ethers.Contract(contractAddress, USElection.abi, wallet)
	console.log(electionContract)
}

run()
