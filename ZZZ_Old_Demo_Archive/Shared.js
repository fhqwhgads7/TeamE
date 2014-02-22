// Player is synonymous with Business
var BOARD_WIDTH=800;
var EVENT_CHANCE=0.5;
var BaseCosts={
	HireDev:20,
	HireQA:15,
	HireCreative:14,
	PayDev:5,
	PayQA:5,
	PayCreative:7,
	Prototype:230,
	PostDepBugCost:100,
	Deployment:370
}
var BasePayouts={
	DayJobEachTurn:30,
	TaxBreak:1000
}
var ControlTypes={
	Player:"Player",
	Computer:"Computer"
}
var GameStates={
	Uninitialized:"Unitialized",
	PlayerTurnIdle:"PlayerTurnIdle",
	PlayerCreatingProduct:"PlayerCreatingProduct",
	PlayerManagingEmployees:"PlayerManagingEmployees",
	PlayerWatchingScoreboard:"PlayerWatchingScoreboard"
}
var ProductPhases={
	Idea:"Idea",
	Design:"Design",
	Prototype:"Prototype",
	PrototypeTesting:"PrototypeTesting",
	Development:"Development",
	PreDepTesting:"PreDeploymentTesting",
	Deployment:"Deployment",
	PostDepTesting:"PostDeploymentTesting",
	Maintenance:"Maintenance"
}
var PhasePositions={
	Idea:[350,50],
	Design:[480,180],
	Prototype:[480,340],
	PrototypeTesting:[350,480],
	Development:[190,480],
	PreDeploymentTesting:[60,340],
	Deployment:[60,180],
	PostDeploymentTesting:[190,50],
	Maintenance:[260,260]
}
var RandomEvents=[
	["Tax break!","AllPlayers","CashChange",750]
]
var PlayerColors={
	Red:"rgb(255,30,30)",
	Green:"rgb(0,170,0)",
	Blue:"rgb(30,30,255)",
	Yellow:"rgb(255,255,100)",
	Cyan:"rgb(30,255,255)",
	Magenta:"rgb(255,30,255)",
	Pink:"rgb(255,200,210)",
	Orange:"rgb(230,165,60)",
	Purple:"rgb(130,20,140)",
	Brown:"rgb(175,50,30)",
	White:"rgb(255,255,255)",
	Black:"rgb(50,50,50)"
}
var RetirementMinimums={
	"$401,000":401000,
	"$500,000":500000,
	"$600,000":600000,
	"$700,000":700000,
	"$800,000":800000,
	"$900,000":900000,
	"$1,000,000":1000000,
	"$999,999,999":999999999
}
var ProductCategories={
	Energy:["Hydroelectric","Solar","FossilFuel","Wind"],
	Transportation:["Space","Air","Land","Sea"],
	Hardware:["Desktop","Laptop","Peripheral","Printer"],
	Software:["Communication","OfficeProgram","VideoGame","WebApplication"],
	Houseware:["Cleaning","Furniture","Kitchen","Barbecue"],
	Other:["School","Shoes","Musical","KeyHolder"]
}
var GameSounds={
	GainMoney: 'sounds/gainmoney.wav',
	LoseMoney: 'sounds/losemoney.wav',
	ProductPlacement: 'sounds/product.wav',
	AdvanceProduct: 'sounds/advance.wav',
	NextTurn: 'sounds/nextplayersturn.wav',
	NextRound: 'sounds/nextround.wav',
	Message: 'sounds/message.wav',
	Event: 'sounds/event.wav',
	Wrong:"sounds/wrong.wav"
}
var Tips=[
	"Don't drink and drive.",
	"Don't fail too hard or else flying monkeys will appear out of nowhere and eat your face.",
	"Try the salad; it's delicious.",
	"If you lose your entire investment on a product with no designers, testers, or developers, it's probably your own fault.",
	"Lisa needs braces.",
	"YOU MUST RECOVER",
	"Innovation requires taking risks.",
	"The more risks you take, the higher your chances of success will be.",
	"Make a product!",
	"Don't die!",
	"Nineteen!",
	"2+2 = Fish!",
	"Employees will cost money over time. Produce a profitable product to gain it back!"
]
function Game(){
	this.State=GameStates.Uninitialized;
	this.ActivePlayerNum=0;
	this.ActivePlayer="nil";
	this.NumPlayers=0;
	this.Players=[];
	this.CurrentRound=0;
	this.MaxRounds=10;
}
function playSound(sound){
	new Audio(sound).play();
}
function Player(game,name,controlType,color){
	this.Name=name;
	this.ControlType=controlType;
	this.Color=color;
	this.NumProducts=0;
	this.NumDevs=0;
	this.NumQA=0;
	this.NumCreative=0;
	this.Money=2000;
	this.LastDisplayedMoney=2000;
	this.Products=[];
	game.Players.push(this);
	this.Number=game.Players.length-1;
	game.NumPlayers=game.Players.length;
}
function Product(player,name,category,sub,color){
	this.Name=name;
	this.Category=category;
	this.SubCategory=sub;
	this.Color=color;
	this.IdeaStrength=0;
	this.DesignStrength=0;
	this.BuildStrength=0;
	this.Phase="nil";
	player.Products.push(this);
	this.Number=player.Products.length-1;
	this.OwnerNumber=player.Number;
	player.NumProducts=player.Products.length;
	this.DisplayItemID="nil";
}
function SetGame(game){
	localStorage.CurrentGame=JSON.stringify(game);
}
function GetGame(){
	return JSON.parse(localStorage.CurrentGame);
}