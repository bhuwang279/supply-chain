// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
const SupplyChain = artifacts.require("SupplyChain");
const truffleAssert = require("truffle-assertions");
contract("SupplyChain", function (accounts) {
  // Declare few constants and assign a few sample accounts generated by ganache-cli
  let sku = 1;
  let upc = 1;
  const ownerID = accounts[0];
  const originFarmerID = accounts[1];
  const originFarmName = "John Doe";
  const originFarmInformation = "Yarray Valley";
  const originFarmLatitude = "-38.239770";
  const originFarmLongitude = "144.341490";
  let productID = sku + upc;
  const productNotes = "Best beans for Espresso";
  const productPrice = web3.utils.toWei("1", "ether");
  let itemState = 0;
  const distributorID = accounts[2];
  const retailerID = accounts[3];
  const consumerID = accounts[4];
  const emptyAddress = "0x00000000000000000000000000000000000000";

  ///Available Accounts
  ///==================
  ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
  ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
  ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
  ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
  ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
  ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
  ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
  ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
  ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
  ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

  console.log("ganache-cli accounts used here...");
  console.log("Contract Owner: accounts[0] ", accounts[0]);
  console.log("Farmer: accounts[1] ", accounts[1]);
  console.log("Distributor: accounts[2] ", accounts[2]);
  console.log("Retailer: accounts[3] ", accounts[3]);
  console.log("Consumer: accounts[4] ", accounts[4]);

  const itemStates = {
    Harvested: 0,
    Processed: 1,
    Packed: 2,
    ForSale: 3,
    Sold: 4,
    Shipped: 5,
    Received: 6,
    Purchased: 7,
  };

  before(async () => {
    supplyChain = await SupplyChain.deployed();
    await supplyChain.addFarmer(originFarmerID);
    await supplyChain.addDistributor(distributorID);
    await supplyChain.addRetailer(retailerID);
    await supplyChain.addConsumer(consumerID);
  });

  // 1st Test
  it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event

    // Watch the emitted event Harvested()

    let event = supplyChain.Harvested();

    // Mark an item as Harvested by calling function harvestItem()
    const transaction = await supplyChain.harvestItem(
      upc,
      originFarmerID,
      originFarmName,
      originFarmInformation,
      originFarmLatitude,
      originFarmLongitude,
      productNotes,
      { from: originFarmerID }
    );

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      resultBufferTwo[5],
      itemStates.Harvested,
      "Error: Invalid item State"
    );
    truffleAssert.eventEmitted(transaction, "Harvested", {
      upc: web3.utils.toBN(upc),
    });
  });

  // 2nd Test
  it("Testing smart contract function processItem() that allows a farmer to process coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event

    // Watch the emitted event Processed()

    // Mark an item as Processed by calling function processtItem()
    const transaction = await supplyChain.processItem(upc, {
      from: originFarmerID,
    });
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const newProcessedItem = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      newProcessedItem[5],
      itemStates.Processed,
      "Error: Invalid item state"
    );

    truffleAssert.eventEmitted(transaction, "Processed", {
      upc: web3.utils.toBN(upc),
    });
  });

  // 3rd Test
  it("Testing smart contract function packItem() that allows a farmer to pack coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event

    // Watch the emitted event Packed()

    // Mark an item as Packed by calling function packItem()
    const transaction = await supplyChain.packItem(upc, {
      from: originFarmerID,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const newPackedItem = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set

    assert.equal(
      newPackedItem[5],
      itemStates.Packed,
      "Error: Invalid item state"
    );

    truffleAssert.eventEmitted(transaction, "Packed", {
      upc: web3.utils.toBN(upc),
    });
  });

  // 4th Test
  it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event

    // Watch the emitted event ForSale()

    // Mark an item as ForSale by calling function sellItem()
    const transaction = await supplyChain.sellItem(upc, productPrice, {
      from: originFarmerID,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const newItemForSale = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      newItemForSale[5],
      itemStates.ForSale,
      "Error: Invalid item state"
    );
    assert.equal(
      newItemForSale[4],
      productPrice,
      "Error: Invalid product price"
    );

    truffleAssert.eventEmitted(transaction, "ForSale", {
      upc: web3.utils.toBN(upc),
    });
  });

  // 5th Test
  it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event

    // Watch the emitted event Sold()

    // Mark an item as Sold by calling function buyItem()
    const transaction = await supplyChain.buyItem(upc, {
      from: distributorID,
      value: productPrice,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const boughtItemBuffer1 = await supplyChain.fetchItemBufferOne.call(upc);
    const boughtItemBuffer2 = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    const itemBoughtState = 4;
    assert.equal(
      boughtItemBuffer2[5],
      itemStates.Sold,
      "Error: Invalid item state"
    );
    assert.equal(
      boughtItemBuffer2[6],
      distributorID,
      "Error: Invalid distributor id"
    );
    assert.equal(
      boughtItemBuffer1[2],
      distributorID,
      "Error: Invalid owner id"
    );

    truffleAssert.eventEmitted(transaction, "Sold", {
      upc: web3.utils.toBN(upc),
    });
  });

  // 6th Test
  it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event

    // Watch the emitted event Shipped()

    // Mark an item as Shipped by calling function shipItem()
    const transaction = await supplyChain.shipItem(upc, {
      from: distributorID,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const shippedItem = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      shippedItem[5],
      itemStates.Shipped,
      "Error: Invalid item state"
    );
    truffleAssert.eventEmitted(transaction, "Shipped", {
      upc: web3.utils.toBN(upc),
    });
  });

  // 7th Test
  it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event

    // Watch the emitted event Received()

    // Mark an item as Sold by calling function buyItem()
    const transaction = await supplyChain.receiveItem(upc, {
      from: retailerID,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const receivedItemBuffer1 = await supplyChain.fetchItemBufferOne.call(upc);
    const receivedItemBuffer2 = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      receivedItemBuffer2[5],
      itemStates.Received,
      "Error: Invalid item state"
    );
    assert.equal(
      receivedItemBuffer2[7],
      retailerID,
      "Error: Invalid retailer id"
    );
    assert.equal(
      receivedItemBuffer1[2],
      retailerID,
      "Error: Missing or Invalid owner id"
    );
    truffleAssert.eventEmitted(transaction, "Received", {
      upc: web3.utils.toBN(upc),
    });
  });

  // 8th Test
  it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event

    // Watch the emitted event Purchased()

    // Mark an item as Sold by calling function buyItem()
    const transaction = await supplyChain.purchaseItem(upc, {
      from: consumerID,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const purchasedItemBuffer1 = await supplyChain.fetchItemBufferOne.call(upc);
    const purchasedItemBuffer2 = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      purchasedItemBuffer2[5],
      itemStates.Purchased,
      "Invalid item state"
    );
    assert.equal(
      purchasedItemBuffer2[8],
      consumerID,
      "Error: Invalid consumer id"
    );
    assert.equal(
      purchasedItemBuffer1[2],
      consumerID,
      "Error: Invalid owner id"
    );
    truffleAssert.eventEmitted(transaction, "Purchased", {
      upc: web3.utils.toBN(upc),
    });
  });

  // 9th Test
  it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const item = await supplyChain.fetchItemBufferOne.call(upc);

    // Verify the result set:
    assert.equal(item[0], sku, "Error: Invalid sku");
    assert.equal(item[1], upc, "Error: Invalid upc");
    assert.equal(item[2], consumerID, "Error: Missing or Invalid ownerID");
    assert.equal(
      item[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(item[4], originFarmName, "Error: Invalid originFarmName");
    assert.equal(
      item[5],
      originFarmInformation,
      "Invalid originFarmInformation"
    );
    assert.equal(
      item[6],
      originFarmLatitude,
      "Error: Invalid originFarmLatitude"
    );
    assert.equal(
      item[7],
      originFarmLongitude,
      "Error: Invalid originFarmLongitude"
    );
  });

  // 10th Test
  it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const item = await supplyChain.fetchItemBufferTwo.call(upc);
    // Verify the result set:
    assert.equal(item[0], sku, "Error: Invalid  sku");
    assert.equal(item[1], upc, "Error: Invalid  upc");
    assert.equal(item[2], productID, "Error: Missing or Invalid productID");
    assert.equal(item[3], productNotes, "Error: Invalid productNotes");
    assert.equal(item[4], productPrice, "Error: Invalid productPrice");
    assert.equal(item[5], 7, "Error:Invalid  state");
    assert.equal(
      item[6],
      distributorID,
      "Error: Missing or Invalid distributorID"
    );
    assert.equal(item[7], retailerID, "Error: Missing or Invalid retailerID");
    assert.equal(item[8], consumerID, " Error: Missing orInvalid consumerID");
  });
});
