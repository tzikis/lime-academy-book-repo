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

    it("Should try to add new books to list with no copies, and throw error", async function () {
        expect(library.addBook("Empty Book",0)).to.be.revertedWith('Number of copies should be more than 0');
    });

    it("Should add new books to list", async function () {

        const addLibraryTx = await library.addBook("Tzikbook",1);
        await addLibraryTx.wait();
        // how do i get the actual response here, eh?
        // console.log(addLibraryTx);

        response = await library.listBooks();
        // console.log(response);

        const booksArray = response[0];
        const booksIndexList = response[1];
        // console.log(booksArray);
        // console.log(booksIndexList);

        expect(booksArray).to.deep.equal([['Tzikbook',1,0]]); // Tzikbook
        // Why did this stop working?
        // expect(booksIndexList).to.deep.equal([{_hex: "0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d", _isBigNumber: true}]); // Tzikbook
    });

    it("Should try to add new existing book, and increase count of existing book", async function () {
        const addLibraryTx = await library.addBook("Tzikbook",1);
        await addLibraryTx.wait();

        response = await library.listBooks();
        const booksArray = response[0];
        // const booksIndexList = response[1];

        expect(booksArray).to.deep.equal([['Tzikbook',2,0]]); // Tzikbook
        // Why did this stop working?
        // expect(booksIndexList).to.deep.equal([{_hex: "0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d", _isBigNumber: true}]); // Tzikbook
    });

    it("Should throw when try to borrow non-existing book", async function () {
        expect(library.borrowBook(0)).to.be.revertedWith("Book ID doesn't exist");
    });

    it("Should be able to borrow book once", async function () {
        const addLibraryTx = await library.borrowBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d");
        await addLibraryTx.wait();

        response = await library.listBooks();
        const booksArray = response[0];
        // const booksIndexList = response[1];

        expect(booksArray).to.deep.equal([['Tzikbook',2,1]]); // Tzikbook
    });

    it("Should throw when try to borrow book twice", async function () {
        expect(library.borrowBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d")).to.be.revertedWith('User has already currently borrowed this book');
    });

    it("Should be able to return book once", async function () {
        const addLibraryTx = await library.returnBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d");
        await addLibraryTx.wait();

        response = await library.listBooks();
        const booksArray = response[0];
        // const booksIndexList = response[1];

        expect(booksArray).to.deep.equal([['Tzikbook',2,0]]); // Tzikbook
    });

    it("Should throw when try to return book twice", async function () {
        expect(library.returnBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d")).to.be.revertedWith('User has not currently borrowed this book');
    });

    it("Should show list of all previous borrowers for book", async function () {

        response = await library.listAllPastBorrowersOfBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d");
        console.log(response);
        expect(response[0]).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'); // first user id is us
    });

    it("Should not add previous borrower to list of all previous borrowers for book on second borrowing", async function () {
        response = await library.listAllPastBorrowersOfBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d");
        console.log(response);
        expect(response[0]).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'); // first user id is us

        const addLibraryTx = await library.borrowBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d");
        await addLibraryTx.wait();

        response = await library.listAllPastBorrowersOfBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d");
        console.log(response);
        expect(response[0]).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'); // first user id is us

    });


    it("Should not be able to borrow book more than count", async function () {

        const [owner, addr1, addr2] = await ethers.getSigners();

        const addLibraryTx = await library.connect(addr1).borrowBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d");
        await addLibraryTx.wait();

        //ok but why do we wait sometimes and not some others?
        expect(library.connect(addr2).borrowBook("0xb13422f9a5f102b8433c265dc4c1e3c9e3e1485d22bbf6452d8e586328cc1b6d")).to.be.revertedWith('No available copies of the book');
    });

});
