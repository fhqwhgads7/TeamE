// Sample Dummy Tests

test("failed test", function() {
    var value = "szia";
    equal( value, "hello", "We expect value to be 'hello'" );
});

test("passed test", function() {
    var value = "hello";
    equal( value, "hello", "We expect value to be 'hello'" );
});

// Real tests

test("new Product can be instantiated", function() {
    var newProductName = "new Product name";
    var newProduct = Product(null, newProductName, 'Product Category', 'Product Sub-Category', 'Player Color');

    ok(newProduct, "New Product was successfully created");
    equal(newProduct.Name, newProductName, "New Product object was created with expected name" );
});

test("background can actually change", function(){
	
	var timesOfDay0 = "Morning";
	var timesOfDay1 = "Noon";
	var timesOfDay2 = "Afternoon";
	var timesOfDay3 = "Night";
	
	for (i = 5; i < 9; i++){
		equal(timesOfDay0, Background(i), "Hour is " + i.toString() + " and should return Morning.");}
	for (i = 9; i < 15; i++){
		equal(timesOfDay1, Background(i), "Hour is " + i.toString() + " and should return Noon.");}
	for (i = 15; i < 19; i++){
		equal(timesOfDay2, Background(i), "Hour is " + i.toString() + " and should return Afternoon.");}
	for (i = 19; (i < 5 || i >= 19); i=(i%24)+1){
		equal(timesOfDay3, Background(i), "Hour is " + i.toString() + " and should return Night.");}
});