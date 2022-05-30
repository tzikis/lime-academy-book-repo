const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Library", function () {   
    let libraryFactory;
    let library;
    before(async () => {
        libraryFactory = await ethers.getContractFactory("Library");
        library = await libraryFactory.deploy();
        await library.deployed();
    });
    
    it("Should return an empty list of books", async function () {
        response = await library.listBooks();
        expect(response).to.deep.equal([[],[]]); // NOBODY
    });

    it("Should add new books to list", async function () {

        const addLibraryTx = await library.addBook("Tzikbook",5);
        await addLibraryTx.wait();
        // how do i get the actual response here, eh?
        // console.log(addLibraryTx);

        response = await library.listBooks();
        // console.log(response);

        const booksArray = response[0];
        const booksIndexList = response[1];
        // console.log(booksArray);
        // console.log(booksIndexList);

        expect(booksArray).to.deep.equal([['Tzikbook',5,0]]); // Tzikbook
        expect(booksIndexList).to.deep.equal([{_hex: "0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d", _isBigNumber: true}]); // Tzikbook
    });

});
