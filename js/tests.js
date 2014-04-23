test("new Product can be instantiated", function() {
	var someGame = new Game();
    var newProductName = "new Product name";
    var newProduct = new Product(null, newProductName, 'Product Category', 'Product Sub-Category', 'Player Color');

    ok(newProduct, "New Product was successfully created");
    equal(newProduct.Name, newProductName, "New Product object was created with expected name" );
});
test("new Player can be instantiated", function() {
    var newPlayerName = "new Player name";
    var newPlayer = new Player(null, newPlayerName, 'Test', 'Colorless');

    ok(newPlayer, "New Player was successfully created");
    equal(newPlayer.Name, newPlayerName, "New Player object was created with expected name" );
});

test("background can actually change", function(){
	
	for (i = 5; i < 9; i++){
		equal("Morning", getTimeOfDay(i), "Hour is " + i.toString() + " and should return Morning.");}
	for (i = 9; i < 15; i++){
		equal("Noon", getTimeOfDay(i), "Hour is " + i.toString() + " and should return Noon.");}
	for (i = 15; i < 19; i++){
		equal("Afternoon", getTimeOfDay(i), "Hour is " + i.toString() + " and should return Afternoon.");}
	for (i = 19; i < 22; i++){
		equal("Evening", getTimeOfDay(i), "Hour is " + i.toString() + " and should return Evening.");}
	for (i = 22; (i < 5 || i >= 22); i=(i%24)+1){
		equal("Night", getTimeOfDay(i), "Hour is " + i.toString() + " and should return Night.");}
});
 
test("patenting functions work properly", function(){
	
	var testGame = new Game("2947");
	ok(testGame, "The Test Game object exists.");
	
	var PlayerOne = new Player(testGame, "AwwYiss", "Player", "Red");
	var PlayerTwo = new Player(testGame, "MFin", "Player", "Blue");
	var PlayerThree = new Player(testGame, "UnitTest", "Player", "Green");
	testGame.PatentTracker = new PatentTracker();
	
	ok(testGame.PatentTracker, "This Patent Tracker exists and is not deformed.");
	
	var Product_1_1 = new Product(PlayerOne, "Dummy1", "Energy", "Hydroelectric", PlayerOne.Color);
	var Product_1_2 = new Product(PlayerOne, "Dummy2", "Other", "Key Holder", PlayerOne.Color); 
	var Product_2_1 = new Product(PlayerTwo, "Dummy3", "Energy", "Hydroelectric", PlayerTwo.Color);
	var Product_2_2 = new Product(PlayerTwo, "Dummy4", "Software", "Video Game", PlayerTwo.Color);
	var Product_3_1 = new Product(PlayerThree, "Dummy5", "Energy", "Hydroelectric", PlayerThree.Color);
	var Product_3_2 = new Product(PlayerThree, "Dummy6", "Energy", "Hydroelectric", PlayerThree.Color);
	var Product_3_3 = new Product(PlayerThree, "Dummy7", "Other", "Key Holder", PlayerThree.Color);
	var categoryIndex = 0;
	testGame.CurrentPlayer = PlayerThree;

	ok(OldTryToBuyPatent(Product_3_1, testGame), "The function for buying patents doesn't break.");
	ok((OldTryToBuyPatent(Product_3_1, testGame).indexOf("impressive enough") > -1), "This product isn't impressive enough just yet.");
	Product_3_1.IdeaStrength=100;
	Product_3_1.DesignStrength=100;
	Product_3_1.BuildStrength=100;
	PlayerThree.Money=0;
	ok((OldTryToBuyPatent(Product_3_1, testGame).indexOf("short") > -1), "More money should be required.");
	PlayerThree.Money=9015;
	
	//To simulate the patenting success. (The function to patent manipulates html elements, which cannot be done during unit tests.)
	categoryIndex = testGame.PatentTracker.Categories.indexOf(Product_3_1.SubCategory);
	testGame.PatentTracker.Records[categoryIndex][1] = PlayerThree.GlobalID;
	testGame.PatentTracker.Records[categoryIndex][2] = Product_3_1.GlobalID;
	
	ok((OldTryToBuyPatent(Product_3_2, testGame).indexOf("You've already") > -1), "They should already have this patent.");
	
	//Player One's turn
	testGame.CurrentPlayer = PlayerOne;
	
	ok(OldTryToBuyPatent(Product_1_2, testGame), "Still no breaking.");
	ok((OldTryToBuyPatent(Product_1_2, testGame).indexOf("impressive enough") > -1), "This product isn't impressive enough just yet.");
	ok((OldTryToBuyPatent(Product_1_1, testGame).indexOf("already has the patent") > -1), "Player Three beat Player One to the punch.");
	
	//Simulating Player One patenting their dinky little key holder
	categoryIndex = testGame.PatentTracker.Categories.indexOf(Product_1_2.SubCategory);
	testGame.PatentTracker.Records[categoryIndex][1] = PlayerOne.GlobalID;
	testGame.PatentTracker.Records[categoryIndex][2] = Product_1_2.GlobalID;
	
	
	//Player Two's turn.
	testGame.CurrentPlayer = PlayerTwo;
	
	ok(OldTryToBuyPatent(Product_2_2, testGame), "Still no breaking.");
	Product_2_2.isANewProduct = false; //Not a new product.
	ok((OldTryToBuyPatent(Product_2_2, testGame).indexOf("on the market") > -1), "This product was on the market and shouldn't be patented.");
	
	
	//ROYAL TESTS
	equal(doIPayRoyalties(Product_1_1, testGame.PatentTracker), PlayerThree.GlobalID, "Player Three gets royalties.");
	equal(doIPayRoyalties(Product_1_2, testGame.PatentTracker), -1, "No one gets royalties.");
	equal(doIPayRoyalties(Product_2_1, testGame.PatentTracker), PlayerThree.GlobalID, "Player Three gets royalties.");
	equal(doIPayRoyalties(Product_2_2, testGame.PatentTracker), -1, "No one gets royalties.");
	equal(doIPayRoyalties(Product_3_1, testGame.PatentTracker), -1, "No one gets royalties.");
	equal(doIPayRoyalties(Product_3_2, testGame.PatentTracker), -1, "No one gets royalties.");
	equal(doIPayRoyalties(Product_3_3, testGame.PatentTracker), PlayerOne.GlobalID, "Player One gets royalties.");
	
});

test("the VI initializes properly and knows its own name",function(){
	var Gaem=new Game("0099");
	var Ply=new Player(Gaem,"Test_Player","Computer","Red");
	ok(Ply.VIMemory,"VI never initialized");
	ok(Ply.VIMemory.Name=="Test_Player","VI doesn't know its name");
});

test("user can actually register properly",function(){
	
});

test("user can login properly",function(){
	
});/*
test("music plays",function(){
	var music=music
	ok(music, "Music plays.");
});
*/