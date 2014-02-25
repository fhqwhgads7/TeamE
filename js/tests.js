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
