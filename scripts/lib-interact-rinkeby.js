const hre = require("hardhat");
const Library = require('../artifacts/contracts/BookLibraryTest.sol/Library.json')

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

	
	const contractAddress = "0x08259aA59Ae96c1F610eD35c447560b907723349"
	const libraryContract = new hre.ethers.Contract(contractAddress, Library.abi, wallet)

    console.log(libraryContract)

    var listBooks = await libraryContract.listBooks()
	console.log("This is the current list of books:", listBooks)

    const transactionAddBook = await libraryContract.addBook("Tzikis", 2);

    const transactionReceipt = await transactionAddBook.wait();
	if (transactionReceipt.status != 1) { // 1 means success
		console.log("Transaction was not successful")
		return 
	}

    listBooks = await libraryContract.listBooks()
	console.log("This is the current list of books:", listBooks)

    const transactionBorrowBook = await libraryContract.borrowBook("0xafb8448bb29dd298f9b02bfd602cb40441dfa5c396ba29f73f36a12c97892347");

    const transactionReceipt2 = await transactionBorrowBook.wait();
	if (transactionReceipt2.status != 1) { // 1 means success
		console.log("Transaction was not successful")
		return 
	}
    listBooks = await libraryContract.listBooks()
	console.log("This is the current list of books:", listBooks)

    console.log("There are " + listBooks[0][0]["numOfBorrowedCopies"] + " borrowed copies of the book " + listBooks[0][0]["name"]);

    const transactionReturnBook = await libraryContract.returnBook("0xafb8448bb29dd298f9b02bfd602cb40441dfa5c396ba29f73f36a12c97892347");

    const transactionReceipt3 = await transactionReturnBook.wait();
	if (transactionReceipt3.status != 1) { // 1 means success
		console.log("Transaction was not successful")
		return 
	}

    listBooks = await libraryContract.listBooks()
	console.log("This is the current list of books:", listBooks)

    console.log("There are " +
    listBooks[0][0]["numOfCopies"] +
    " copies of the book '" + listBooks[0][0]["name"] + "', " +
    listBooks[0][0]["numOfBorrowedCopies"] + " of which are borrowed, so there are " + 
    (listBooks[0][0]["numOfCopies"]- listBooks[0][0]["numOfBorrowedCopies"])+" copies available.");
	
}

run()
