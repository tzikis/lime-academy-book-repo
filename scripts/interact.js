const hre = require("hardhat");
const USElection = require('../artifacts/contracts/USElection.sol/USElection')


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
