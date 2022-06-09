const hre = require("hardhat");
const USElection = require('../artifacts/contracts/USElection.sol/USElection')

const dotenv = require("dotenv");

dotenv.config({path: __dirname + '/../.env'});
const { INFURA_API_KEY, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

const run = async function() {

	const provider = new hre.ethers.providers.InfuraProvider("rinkeby", INFURA_API_KEY)
	const latestBlock = await provider.getBlock("latest")
	console.log(latestBlock.hash)

    const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);
	const balance = await wallet.getBalance();

    console.log(hre.ethers.utils.formatEther(balance, 18))
    console.log(balance.toString())

	
	const contractAddress = "0x5155bE53a3144BAf6D2D8a3123Ac1914d5FDF76F"
	const electionContract = new hre.ethers.Contract(contractAddress, USElection.abi, wallet)

    const USElectionFactory = await hre.ethers.getContractFactory("USElection");
    // const electionContract = await USElectionFactory.attach(contractAddress);

    // console.log(electionContract)

    const hasEnded = await electionContract.electionEnded()
	console.log("The election has ended:", hasEnded)

    const haveResultsForOhio = await electionContract.resultsSubmitted("Ohio")
	console.log("Have results for Ohio:", haveResultsForOhio)

    const transactionOhio = await electionContract.submitStateResult(["Ohio", 250, 150, 24]);

    const transactionReceipt = await transactionOhio.wait();
	if (transactionReceipt.status != 1) { // 1 means success
		console.log("Transaction was not successful")
		return 
	}

    const resultsSubmittedOhioNew = await electionContract.resultsSubmitted("Ohio")
	console.log("Results submitted for Ohio", resultsSubmittedOhioNew)

	const currentLeader = await electionContract.currentLeader()
	console.log("Current leader", currentLeader)
	
}

run()
