var TheGame;
var RotateDir = 0;
var Rotation = 0;
var CurrentlySelectedProduct;
var ShowCashAlert = false;
var BOARD_WIDTH = 800;
var TotalPayoutRate = 1;
var ProductsBeingRemoved;
var RandomEventsToIterate;
var OnlineInterval;

var BaseCosts = {
	HireDev : 20,
	HireQA : 15,
	HireCreative : 14,
	PayDev : 5,
	PayQA : 5,
	PayCreative : 7,
	Prototype : 230,
	PostDepBugCost : 100,
	Deployment : 370
};
var BasePayouts = {
	DayJobEachTurn : 100
};
var ProductPhases = {
	Idea : "Idea",
	Design : "Design",
	Prototype : "Prototype",
	PrototypeTesting : "PrototypeTesting",
	Development : "Development",
	PreDepTesting : "PreDepTesting",
	Deployment : "Deployment",
	PostDepTesting : "PostDepTesting",
	Maintenance : "Maintenance"
};
var ProductPhaseNames = {
	Idea : "Idea",
	Design : "Design",
	Prototype : "Prototype",
	PrototypeTesting : "Prototype Testing",
	Development : "Development",
	PreDepTesting : "Pre-deployment Testing",
	Deployment : "Deployment",
	PostDepTesting : "Post-deployment Testing",
	Maintenance : "Maintenance"
};
var PhasePositions = {
	Idea : [270 + 225 * Math.cos(13 * Math.PI / 8), 270 + 225 * Math.sin(13 * Math.PI / 8)],
	Design : [270 + 225 * Math.cos(15 * Math.PI / 8), 270 + 225 * Math.sin(15 * Math.PI / 8)],
	Prototype : [270 + 225 * Math.cos(1 * Math.PI / 8), 270 + 225 * Math.sin(1 * Math.PI / 8)],
	PrototypeTesting : [270 + 225 * Math.cos(3 * Math.PI / 8), 270 + 225 * Math.sin(3 * Math.PI / 8)], 
	Development : [270 + 225 * Math.cos(5 * Math.PI / 8), 270 + 225 * Math.sin(5 * Math.PI / 8)], 
	PreDepTesting : [270 + 225 * Math.cos(7 * Math.PI / 8), 270 + 225 * Math.sin(7 * Math.PI / 8)],
	Deployment : [270 + 225 * Math.cos(9 * Math.PI / 8), 270 + 225 * Math.sin(9 * Math.PI / 8)], 
	PostDepTesting : [270 + 225 * Math.cos(11 * Math.PI / 8), 270 + 225 * Math.sin(11 * Math.PI / 8)], 
	Maintenance : [270, 270]
};
function RandomEvent(newName, newMessage, newTarget, newScale, newType, newValue, newPicture, newLikeliness, newOccurrenceInterval){
	var newRandomEvent = {};
	newRandomEvent.ClassName="RANDOMEVENT_OBJECT";
	newRandomEvent.Name = newName;
	newRandomEvent.Message = newMessage;
	newRandomEvent.AreaOfEffect = newTarget;
	newRandomEvent.Scale = newScale;
	newRandomEvent.Type = newType;
	newRandomEvent.Value = newValue;
	newRandomEvent.Picture = newPicture;
	newRandomEvent.Likeliness = newLikeliness;
	newRandomEvent.OccurrenceInterval = newOccurrenceInterval;
	newRandomEvent.TurnsUntilActive = 3;
	newRandomEvent.Target = null;
	
	return newRandomEvent;
}
function CloneRandomEvent(RandomEventToBeCloned){
	var newRandomEvent = {};
	newRandomEvent.ClassName="RANDOMEVENT_OBJECT";
	newRandomEvent.Name = RandomEventToBeCloned.Name;
	newRandomEvent.Message = RandomEventToBeCloned.Message;
	newRandomEvent.AreaOfEffect = RandomEventToBeCloned.Target;
	newRandomEvent.Scale = RandomEventToBeCloned.Scale;
	newRandomEvent.Type = RandomEventToBeCloned.Type;
	newRandomEvent.Value = RandomEventToBeCloned.Value;
	newRandomEvent.Picture = RandomEventToBeCloned.Picture;
	newRandomEvent.Likeliness = RandomEventToBeCloned.Likeliness;
	newRandomEvent.OccurrenceInterval = RandomEventToBeCloned.OccurrenceInterval;
	newRandomEvent.TurnsUntilActive = 3;
	newRandomEvent.Target = null;
	
	return newRandomEvent;
}
var RandomEvents = [
	new RandomEvent("Tax break!", "The IRS is in a good mood!", "AllPlayers", 2, "CashChange", 750, "cash", 0.45, 12),
	new RandomEvent("Explosion!", "A major accident has destroyed a great chunk of your area!", "OnePlayer", -7, "AssetDestruction", 4, "disaster", 0.2, 6),
	new RandomEvent("Stock Market Plummets!", "People are scared to buy new things!", "AllPlayers", -3, "PayoutRateChange_All", 0.5, "stockcrash", 0.4, 10),
	new RandomEvent("Video Game craze!", "A new study was released showing positive effects of gaming!", "AllPlayers", 3, "PayoutRateChange_Video Game", 1.5, "controller", 0.35, 15),
	new RandomEvent("E.T. for the Atari 2600!", "Want to know what happens when a video game is too poorly designed? A crash!", "AllPlayers", -4, "PayoutRateChange_Video Game", 0.1, "et_atari", 0.1, 60),
	new RandomEvent("Cyber-security Attack!", "Could Anonymous be at it again?", "AllPlayers", -6, "CategoryShutdown_Software", 2, "cyberattack", 0.1, 5),
	new RandomEvent("Smart phones are in!", "May desktops finally be out? Unlikely, but...", "AllPlayers", 0, "PayoutRateChange_Desktop", 0.6, "smartphone", 0.4, 14),
	new RandomEvent("All airlines grounded!", "Authorities swear this is just protocol.", "AllPlayers", -4, "SubCategoryShutdown_Air", 1, "airport", 0.2, 20),
	new RandomEvent("School's out...", "...for summer!!", "AllPlayers", 0, "SubCategoryShutdown_School", 3, "schoolsout", 0.2, 12),
	new RandomEvent("SOLAR FLARE!", "It's caused a disruption in communication for a while!", "AllPlayers", -2, "SubCategoryShutdown_Communication", 2, "solarflare", 0.4, 30),
	new RandomEvent("Alternative Energy!", "Yet another push for alternative energy sources is picking up steam.", "AllPlayers", 1, "PayoutRateChange_Solar", 1.1, "solarpanel", 0.7, 12),
	new RandomEvent("Double decker couch?", "It's caused people to put more faith into the furniture market, at least.", "AllPlayers", 2, "PayoutRateChange_Furniture", 1.3, "legomoviecouch", 0.7, 24),
	new RandomEvent("Hurricane!", "Dubbed Scrambles the Death Dealer, it is the cause of much destruction!", "AllPlayers", -5, "AssetDestruction", 2, "hurricane", 0.35, 15),
	new RandomEvent("Recession!", "The economy looks to be in bad shape right now.", "AllPlayers", -9, "PayoutRateChange_All", 0.1, "recession", 0.1, 40),
	new RandomEvent("HI BILLY MAYS HERE", "TO TALK TO EVERY SINGLE ONE OF YOU ABOUT HOW", "AllPlayers", 3, "PayoutRateChange_Cleaning", 1.4, "billymays", 0.1, 60),
	new RandomEvent("Going green!", "Whether it's for the trees or against these devices...", "AllPlayers", -1, "PayoutRateChange_Printer", 0.7, "tree", 0.8, 9),
	new RandomEvent("Refinery explosion!", "A recent disaster is serious enough to require government action!", "AllPlayers", -7, "SubCategoryShutdown_Fossil Fuel", 4, "disaster", 0.2, 4),
	new RandomEvent("Now for meta humor!", "This web-based game is so cool it helps you win!", "AllPlayers", 8, "PayoutRateChange_Web Application", 2.0, "metajoke", 0.3, 60),
	new RandomEvent("Grant!", "Someone with high authority seems to like what you are doing.", "OnePlayer", 10, "CashChange", 100000, "cash", 0.2, 60),
	new RandomEvent("HOLY CRAP", "WE LANDED ON MARS!", "AllPlayers", 6, "PayoutRateChange_Space", 1.5, "mars", 0.1, 60)
];
var ProductCategories = {
	Energy : ["Hydroelectric", "Solar", "Fossil Fuel", "Wind"],
	Transportation : ["Space", "Air", "Land", "Sea"],
	Hardware : ["Desktop", "Laptop", "Peripheral", "Printer"],
	Software : ["Communication", "Office Program", "Video Game", "Web Application"],
	Houseware : ["Cleaning", "Furniture", "Kitchen", "Barbecue"],
	Other : ["School", "Shoes", "Musical", "Key Holder"]
};
//The attributes are, in order: Volatility multiplier (Index 0), Prototype Cost multiplier (Index 1), and Idea Strength increase multiplier (Index 2)
//Also included are Payout multipliers (Index 3) and TurnsShutdown (Index 4), for events, plus a "worth" multiplier (Index 5)
var SubCategoryAttributes = {
	"Hydroelectric" : [1, 1, 1, 1, 0, 1],
	"Solar" : [1, 0.8, 0.8, 1, 0, 1.4],
	"Fossil Fuel" : [1.1, 0.9, 1.1, 1, 0, 2],
	"Wind" : [0.7, 0.8, 0.6, 1, 0, 1.6],
	"Space" : [4, 3, 2.5, 1, 0, 1],
	"Air" : [2.5, 1.5, 2, 1, 0, 0.8],
	"Land" : [2.7, 1.5, 1.5, 1, 0, 1],
	"Sea" : [1.8, 1.7, 1.7, 1, 0, 1],
	"Desktop" : [0.5, 0.7, 0.3, 1, 0, 3],
	"Laptop" : [1, 0.5, 0.3, 1, 0, 3.5],
	"Peripheral" : [1.3, 0.7, 1, 1, 0, 1],
	"Printer" : [0.4, 0.8, 0.7, 1, 0, 1.6],
	"Communication" : [0.6, 0.4, 0.8, 1, 0, 1.3],
	"Office Program" : [0.3, 0.1, 0.3, 1, 0, 1.8],
	"Video Game" : [0.8, 0.3, 1.2, 1, 0, 1],
	"Web Application" : [0.5, 0.2, 0.8, 1, 0, 0.5],
	"Cleaning" : [1.2, 0.9, 1.3, 1, 0, 0.9],
	"Furniture" : [0.4, 0.7, 0.5, 1, 0, 1.1],
	"Kitchen" : [1.2, 0.9, 0.3, 1, 0, 0.7],
	"Barbecue" : [1.1, 0.5, 0.6, 1, 0, 0.8],
	"School" : [0.5, 0.6, 1, 1, 0, 1],
	"Shoes" : [0.3, 0.9, 0.4, 1, 0, 0.8],
	"Musical" : [0.2, 0.4, 0.6, 1, 0, 1.2],
	"Key Holder" : [0.1, 0.2, 0.2, 1, 0, 1.7]
};
function GameInitialize() {
	var doILoadGame = localStorage.getItem("LoadingAGame");
	if (doILoadGame !== "null") {
		LoadGameInitialize(doILoadGame);
	} else {
		NewGameInitialize();
	}
	TheGame.GameState = "ACTIVE";
}
function NewGameInitialize() {
	var GameCreationInfo = JSON.parse(localStorage.getItem("TheBrandNewGame"));
	TheGame = new Game("2947");
	TransferGameStartupInfo(GameCreationInfo, TheGame);
	if (GetDifficultyConstant(TheGame.Settings.Difficulty) > 1){
		TheGame.InterestRate += 0.1;
	}
	if (GetDifficultyConstant(TheGame.Settings.Difficulty) > 2){
		TheGame.InterestRate += 0.3;
	}
	if (GetDifficultyConstant(TheGame.Settings.Difficulty) > 3){
		TheGame.InterestRate += 0.6;
	}
	if(Online){
		TheGame.CurrentPlayerNum=ClientID;
	}
	else{
		TheGame.CurrentPlayerNum=0;
	}
	TheGame.CurrentPlayer = TheGame.Players[TheGame.CurrentPlayerNum];
	if (TheGame.Settings.PatentingEnabled === "On") {
		TheGame.PatentTracker = new PatentTracker();
	}
	for (var AnEvent in RandomEvents){
		TheGame.RandomEvents.push(jQuery.extend(true, {}, RandomEvents[AnEvent]));
	}
	UpdatePlayerDisplay();
	PopulateNewProdCategories();
	setInterval(function () {
		TipThink();
	}, 10);
	setTimeout(DisplayNewRoundEvent, 1);
	$("#MainBoard").hide();
	setTimeout(Appear, 750);
	setTimeout(function(){
		TheGame.CurrentPlayer.TurnInit();
	}, 1000);

}
function LoadGameInitialize(gameName) {
	TheGame = CircularJSON.parse(localStorage.getItem("LastSavedGame"));
	if (!TheGame) {
		NewGameInitialize();
	} else {
		//This code includes logic to recreate each object's particular functions, as even Circular-JSON loses sight of them.
		//Luckily there are only four such lines that are needed.
		Appear();
		SubCategoryAttributes = TheGame.SubCategoryAttributes;
		RandomEvents = TheGame.RandomEvents;
		TheGame.toString = function () {
			return this.ClassName + " " + this.ID.toString();
		};
		for (var q = 0; q < TheGame.Players.length; q++) {
			TheGame.Players[q].toString = function () {
				return this.ClassName + " " + this.GlobalID + ": " + this.Name + ", " + this.Type + ", " + this.Color;
			};
			TheGame.Players[q].TurnInit = function () {
				if (this.Type === "Computer") {
					VI_Begin(this);
				}
			};
			for (var j = 0; j < TheGame.Players[q].Products.length; j++) {
				TheGame.Players[q].Products[j].toString = function () {
					return this.ClassName + " " + this.GlobalID + ": " + this.Name + ", " + this.Owner.Name + ", " + this.Category + ", " + this.SubCategory + ", " + this.Color;
				};
				RecreateProductDisplay(TheGame.Players[q].Products[j]);
			}
		}
		TheGame.CurrentPlayer = TheGame.Players[TheGame.CurrentPlayerNum];
		UpdatePlayerDisplay();
		PopulateNewProdCategories();
		for (var i = 0; i < TheGame.CurrentPlayer.Products.length; i++) {
			$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("z-index", 2);
			$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("opacity", 1);
		}
		if (TheGame.Settings.NumberOfRounds - TheGame.CurrentRound <= 5) {
			changeCurrentBGM("TimeRunningOut");
		}
		$("#RoundNumberDisplay").text("ROUND " + TheGame.CurrentRound.toString());
		$("#new-product-button").attr("disabled", (TheGame.CurrentPlayer.hasMadeProductThisTurn));
		var Elem = document.getElementById("TipSpan");
		var welcomeBackMessage = "Welcome back to the stage of Entrepreneurship!";
		if (TheGame.CurrentRound >= TheGame.Settings.NumberOfRounds / 2) {
			welcomeBackMessage = "We missed you.";
		}
		Elem.style.left = BOARD_WIDTH.toString() + "px";
		Elem.innerHTML = welcomeBackMessage;
		setInterval(function () {
			TipThink();
		}, 10);
		StartTheClock();
		setTimeout(function () {
			TheGame.CurrentPlayer.TurnInit();
		}, 1000);
	}
	if (TheGame.CurrentPlayer.Type === "Computer") {
		$("#ControlLock").show();
	} 
}
function SaveThisGame(gameName) {
	TheGame.SubCategoryAttributes = SubCategoryAttributes;
	var saveMe = CircularJSON.stringify(TheGame);
	localStorage.setItem(gameName, saveMe);
	localStorage.setItem("LoadingAGame", gameName);
}
function TipThink() {
	var Elem = $("#TipSpan");
	var Pos = parseInt(Elem.css("left").replace("px", ""), 10);
	var NewPos = Pos - 1;
	if (NewPos <= -(Elem.width()) - 30) {
		NewPos = BOARD_WIDTH + 1;
		SelectedTip = Math.floor(Math.random() * Tips.length * 0.25 * (1 + 3*(TheGame.CurrentRound / TheGame.Settings.NumberOfRounds)));
		Elem.text(Tips[SelectedTip]);
	}
	Elem.css("left", (NewPos).toString() + "px");
}
function TransferGameStartupInfo(from, to) {
	to.Settings = {};
	to.Settings.Difficulty = from.Options.GameDifficulty;
	to.Settings.CPUIntelligence = from.Options.CPUIntelligence;
	to.Settings.PatentingEnabled = from.Options.PatentingEnabled;
	to.Settings.NumberOfRounds = from.Options.NumberOfRounds;
	to.GameType = from.GameType;
	Online = to.GameType === "Online";
	var IndexOffset = 0;
	if (!Online){
		IndexOffset = 1;
	}
	for (var i = IndexOffset; i <= 5+IndexOffset; i++) {
		var Ply;
		if (Online){
			Ply = from.Players[i];
		}
		else {
			Ply = from.Players["Ply" + NumberNameTable[i]];
		}
		if (Ply) {
			new Player(to, Ply.Name, Ply.Type, Ply.Color);
		}
	}
	if(Online){
		Host=localStorage.getItem("Host")==="true";
		ClientID=parseInt(localStorage.getItem("ClientID"),10);
		GameId = localStorage.getItem("gameId");
		PlayerPingsForHost = [];
		for (var i = 0; i < TheGame.Players.length; i++){
			FlaggedForPossibleDisconnect.push(false);
		}
		pubnub.publish({
			channel: GameId,
			message: {"gameInitialize": ClientID} 
		});
		pubnub.subscribe({
			channel: GameId,
			message: function(message){
				if("gameAction" in message){
					var clientId = message.gameAction.clientId;
					var functionNum = message.gameAction.functionNum;
					var args = JSON.parse(message.gameAction.args);
					Receive(clientId, functionNum, args);
				} else if ("pingIt" in message) {
					PingReceive(GameId, message.senderHost, message.playerID);
				} else if ("isItJustMe" in message) {
					NoItIsNotJustYou(GameId, message.playerID);
				} else if ("noItIsNot" in message) {
					OKJustChecking();
				}
			}
		});
	}
}
function GetDifficultyConstant(difficulty) {
	var returnValue = 0;

	if (difficulty === "EASY") {
		returnValue = 1;
	} else if (difficulty === "NORMAL") {
		returnValue = 2;
	} else if (difficulty === "HARD") {
		returnValue = 3;
	} else {
		returnValue = 4;
	}

	return returnValue;
}
function UpdatePlayerDisplay() {
	var OldCash = parseInt($("#CurPlyMoney").html(), 10);
	var OldName = $("#CurPlyName").html;
	var Ply = TheGame.CurrentPlayer;
	var MainBox = $("#CurPlyBox");
	MainBox.css("border-color", Ply.Color);
	$("#CurPlyName").html(Ply.Name);
	if (Ply.Name.length > 15) {
		$("#CurPlyName").title = Ply.Name;
	}
	$("#CurPlyMoney").html(Ply.Money.toString());
	$("#CurPlyProds").html(Ply.NumProducts.toString());
	$("#CurPlyDsgns").html(Ply.NumCreative.toString());
	$("#CurPlyDevs").html(Ply.NumDevs.toString());
	$("#CurPlyTsts").html(Ply.NumQA.toString());
	VisualCashAlert();
}
function PopulateNewProdCategories() {
	var Sel = $("#NewProductCategory");
	for (Item in ProductCategories) {
		Sel.append('<option>' + Item + '</option>');
	}
	Sel.selectedIndex = 0;
	SelectProductCategory();
}
function SelectProductCategory() {
	var Sel = $("#NewProductCategory");
	var SubSel = $("#NewProductSubCategory");
	SubSel.children().remove();
	var Cat = Sel.val();
	for (var i = 0; i < ProductCategories[Cat].length; i++) {
		SubSel.append('<option>' + ProductCategories[Cat][i] + '</option>');
	}
	SubSel.selectedIndex = 0;
}
function createNewProduct() {
	var nam = $("#NewProdName").val();
	if (nam) {
		ActuallyCreateNewProduct(Online,ClientID);
	} else {
		$("#NewProdName").css("background-color", "red");
		setTimeout(function () {
			$("#NewProdName").css("background-color", "white");
		}, 200);
		playSound(GameSounds.Wrong_Med);
	}
}
function ActuallyCreateNewProduct(online,cid,args){
	var nam=$("#NewProdName").val();
	var ply=TheGame.CurrentPlayer;
	var prodCat=$("#NewProductCategory option:selected").val();
	var subCat=$("#NewProductSubCategory option:selected").val();
	if((online)&&(cid!=ClientID)){
		ply=TheGame.Players[parseInt(args[0], 10)];
		nam=args[1];
		prodCat=args[2];
		subCat=args[3];
	}
	if ((!online) || ((online)&&(cid==ClientID))){
		hideNewProductDialog();
	}
	var prod = Product(ply, nam, prodCat, subCat, ply.Color);
	prod.Phase = "Idea";
	CreateProductDisplay(prod);
	playSound(GameSounds.ProductPlacement);
	ply.hasMadeProductThisTurn = true;
	if((online)&&(cid==ClientID)){
		var Args=[cid.toString(),nam,prodCat,subCat];
		Send(GameId, ClientID,5,Args);
		UpdateCurProdDisplay("ProductDisplayItem_" + prod.GlobalID);
		$("#ProductDisplayItem_" + prod.GlobalID).css('opacity', 1);
		$("#ProductDisplayItem_" + prod.GlobalID).css('z-index', "2");
	}
	if(cid==ClientID){
		$("#new-product-button").attr("disabled",(ply.hasMadeProductThisTurn));
	}
}
function CreateProductDisplay(prod) {
	var GameBoard = document.getElementById("GameBoardCircle");
	var ProdElem = document.createElement("div");
	ProdElem.id = "ProductDisplayItem_" + prod.GlobalID;
	prod.DisplayItemID = ProdElem.id;
	ProdElem.addEventListener("click", function () {
		playSound(GameSounds.ProductSelect);
		$("#" + ProdElem.id).css("box-shadow", "0px 0px 60px 10px #AAAAAA");
		UpdateCurProdDisplay(ProdElem.id);
		setTimeout(function () {
			$("#" + ProdElem.id).css("box-shadow", "4px 4px 15px -2px #000000");
		}, 200);
	});
	ProdElem.className = "ProductDisplayItem";
	ProdElem.style.backgroundImage = "url('../images/ProductIcons/" + prod.Category.toLowerCase() + "_" + prod.SubCategory.toLowerCase() + ".png')";
	ProdElem.style.left = "0px";
	ProdElem.style.top = "0px";
	ProdElem.style.borderStyle = "outset";
	ProdElem.style.borderColor = PlayerColors[prod.Color];
	ProdElem.style.backgroundColor = prod.Color;
	ProdElem.style.webkitTransform = "rotate(" + (-Rotation).toString() + "deg)";
	ProdElem.style.MozTransform = "rotate(" + (-Rotation).toString() + "deg)";
	GameBoard.appendChild(ProdElem);
	UpdateProductListDisplayPosition(GetProductsInSamePhase(prod));
	UpdatePlayerDisplay();
	if (!Online){
		ProdElem.style.opacity = 1;
		ProdElem.style.zIndex = "2";
		UpdateCurProdDisplay(ProdElem.id);
	}
}
function RecreateProductDisplay(prod) {
	var GameBoard = document.getElementById("GameBoardCircle");
	var ProdElem = document.createElement("div");
	ProdElem.id = "ProductDisplayItem_" + prod.GlobalID;
	prod.DisplayItemID = ProdElem.id;
	ProdElem.addEventListener("click", function () {
		playSound(GameSounds.ProductSelect);
		$("#" + ProdElem.id).css("box-shadow", "0px 0px 60px 10px #AAAAAA");
		UpdateCurProdDisplay(ProdElem.id);
		setTimeout(function () {
			$("#" + ProdElem.id).css("box-shadow", "4px 4px 15px -2px #000000");
		}, 200);
	});
	ProdElem.className = "ProductDisplayItem";
	ProdElem.style.backgroundImage = "url('../images/ProductIcons/" + prod.Category.toLowerCase() + "_" + prod.SubCategory.toLowerCase() + ".png')";
	ProdElem.style.left = "0px";
	ProdElem.style.top = "0px";
	ProdElem.style.zIndex = "1";
	ProdElem.style.borderStyle = "outset";
	ProdElem.style.borderColor = PlayerColors[prod.Color];
	ProdElem.style.backgroundColor = prod.Color;
	ProdElem.style.webkitTransform = "rotate(" + (-Rotation).toString() + "deg)";
	ProdElem.style.MozTransform = "rotate(" + (-Rotation).toString() + "deg)";
	GameBoard.appendChild(ProdElem);
	UpdateProductListDisplayPosition(GetProductsInSamePhase(prod));
}

function removeProduct(prod) {
	if (prod) {
		var theID = prod.GlobalID;
		playSound(GameSounds.LoseMoney);
		$("#ProductWindow").hide();
		if (isThisProductPatented(prod, TheGame)) {
			removePatentFromRecords(prod, TheGame);
		}
		if (prod === CurrentlySelectedProduct) {
			CurrentlySelectedProduct = null;
		}
		$("#ProductDisplayItem_" + theID.toString()).css('opacity', '0');
		$("#ProductDisplayItem_" + theID.toString()).css('transition', '390ms ease-out');
		setTimeout(function () {
			$("div").remove("#ProductDisplayItem_" + theID.toString());
		}, 390);
		if (prod.justStarted) {
			TheGame.CurrentPlayer.hasMadeProductThisTurn = false;
		}
		prod.Owner.Products.splice(prod.Owner.Products.indexOf(prod), 1);
		var ThePlayerAtLoss = TheGame.Players.indexOf(prod.Owner);
		TheGame.Players[ThePlayerAtLoss].NumProducts = TheGame.Players[ThePlayerAtLoss].Products.length;
		UpdateProductListDisplayPosition(GetProductsInThisPhase(prod.Phase, prod.Owner));
		UpdatePlayerDisplay();
		if (!ProductsBeingRemoved && Online){
			Send(GameId, ClientID,9,theID.toString());
		}
	}
	$("#new-product-button").attr("disabled", (TheGame.CurrentPlayer.hasMadeProductThisTurn));
}
function removeProductOnline(online,cid,args){
	if (ProductsBeingRemoved){
		setTimeout(function(){
			removeProductOnline(online,cid,args);
		},400);
	}
	else {
		if (!online) {
			alert("This is a guard statement.");
			return;
		}
		if (cid===ClientID) {
			alert("It is made of guard and statement.");
			return;
		}
		ProdElemID=parseInt(JSON.parse(args),10);
		if (ProdElemID !== null) {
			playSound(GameSounds.LoseMoney);
			$("#ProductWindow").hide();
			if (isThisProductPatented(TheGame.PlayerProducts[ProdElemID], TheGame)) {
				removePatentFromRecords(TheGame.PlayerProducts[ProdElemID], TheGame);
			}
			if (TheGame.PlayerProducts[ProdElemID] === CurrentlySelectedProduct) {
				CurrentlySelectedProduct = null;
			}
			$("#ProductDisplayItem_" + ProdElemID.toString()).css('opacity', '0');
			$("#ProductDisplayItem_" + ProdElemID.toString()).css('transition', '390ms ease-out');
			setTimeout(function () {
				$("div").remove("#ProductDisplayItem_" + ProdElemID.toString());
			}, 390);
			TheOwner = TheGame.PlayerProducts[ProdElemID].Owner;
			TheOwner.Products.splice(TheOwner.Products.indexOf(TheGame.PlayerProducts[ProdElemID]), 1);
			var ThePlayerAtLoss = TheGame.Players.indexOf(TheOwner);
			TheGame.Players[ThePlayerAtLoss].NumProducts = TheGame.Players[ThePlayerAtLoss].Products.length;
			UpdateProductListDisplayPosition(GetProductsInThisPhase(TheGame.PlayerProducts[ProdElemID].Phase, TheOwner));
			UpdatePlayerDisplay();
		}
	}
}
function removeMultipleProducts(HitList) {
	ProductsBeingRemoved = true;
	if (HitList.length > 1) {
		removeProduct(HitList[0]);
		HitList.splice(0, 1);
		setTimeout(function () {
			removeMultipleProducts(HitList);
		}, 400);
	} else {
		removeProduct(HitList[0]);
		ProductsBeingRemoved = false;
	}
}

function GetProductsInSamePhase(prod) {
	var ProdsInSameSpot = [];
	for (i = 0; i < prod.Owner.Products.length; i++) {
		if (prod.Owner.Products[i].Phase === prod.Phase) {
			ProdsInSameSpot.push(prod.Owner.Products[i]);
		}
	}
	return ProdsInSameSpot;
}

function GetProductsInThisPhase(ThisPhase, Ply) {
	var ProdsInSameSpot = [];

	for (j = 0; j < Ply.Products.length; j++) {
		if (Ply.Products[j].Phase === ThisPhase) {
			ProdsInSameSpot.push(Ply.Products[j]);
		}
	}

	return ProdsInSameSpot;
}

function UpdateProductListDisplayPosition(ProdList) {
	if (ProdList.length > 0) {
		var angularIncrement = 2 * (Math.PI) / (ProdList.length);
		var Magnitude = 25 * Math.log(ProdList.length) / Math.log(3);
		var scalar = Math.pow(Math.E,  - ((ProdList.length - 1) * 0.1)).toString();

		for (i = 0; i < ProdList.length; i++) {
			TheProd = ProdList[i];
			XOffset = Math.cos(angularIncrement * i);
			YOffset = Math.sin(angularIncrement * i);
			XPos = PhasePositions[TheProd.Phase][0] + XOffset * Magnitude;
			YPos = PhasePositions[TheProd.Phase][1] + YOffset * Magnitude;
			Rotation = Math.atan2(-XPos + PhasePositions.Maintenance[0], YPos - PhasePositions.Maintenance[1]) - Math.PI * Number((TheProd.Phase !== "Maintenance") || (ProdList.length > 1));

			var ProdElem = $("#" + "ProductDisplayItem_" + TheProd.GlobalID);
			ProdElem.css("left", (XPos.toString() + "px"));
			ProdElem.css("top", (YPos.toString() + "px"));
			ProdElem.css({
				'webkit-transform' : 'scale(' + scalar + ',' + scalar + ') rotate(' + Rotation.toString() + 'rad)'
			});
			ProdElem.css({
				'transform' : 'scale(' + scalar + ',' + scalar + ') rotate(' + Rotation.toString() + 'rad)'
			});
		}
	}
}

function EmployeeChange(type, num) {

	var designers = parseInt($("#EmpPopupDes").text(), 10);
	var developers = parseInt($("#EmpPopupDev").text(), 10);
	var testers = parseInt($("#EmpPopupTes").text(), 10);

	if (type === "des") {
		if (num + designers >= 0 && num + designers <= 100) {
			$("#EmpPopupDes").text((num + designers).toString());
		}
	} else if (type === "dev") {
		if (num + developers >= 0 && num + developers <= 100) {
			$("#EmpPopupDev").text((num + developers).toString());
		}
	} else if (type === "tes") {
		if (num + testers >= 0 && num + testers <= 100) {
			$("#EmpPopupTes").text((num + testers).toString());
		}
	}
}
function InitiateEmpPopupDisplays() {
	var ply = TheGame.CurrentPlayer;
	$("#EmpPopupDev").text(ply.NumDevs.toString());
	$("#EmpPopupDes").text(ply.NumCreative.toString());
	$("#EmpPopupTes").text(ply.NumQA.toString());
}
function HireTheEmployees(online,cid,args) {
	var ply = TheGame.CurrentPlayer;
	var designers = parseInt($("#EmpPopupDes").text(), 10);
	var developers = parseInt($("#EmpPopupDev").text(), 10);
	var testers = parseInt($("#EmpPopupTes").text(), 10);
	
	if((online)&&(cid!=ClientID)){
		ply=TheGame.Players[cid];
		designers=parseInt(args[0], 10);
		developers=parseInt(args[1], 10);
		testers=parseInt(args[2], 10);
	}
	
	if (designers > ply.NumCreative) {
		ply.Money -= (designers - ply.NumCreative) * BaseCosts.HireCreative;
	}
	if (developers > ply.NumDevs) {
		ply.Money -= (developers - ply.NumDevs) * BaseCosts.HireDev;
	}
	if (testers > ply.NumQA) {
		ply.Money -= (testers - ply.NumQA) * BaseCosts.HireQA;
	}

	ply.NumCreative = designers;
	ply.NumDevs = developers;
	ply.NumQA = testers;
	
	if((online)&&(cid==ClientID)){
		var Args=[designers.toString(),developers.toString(),testers.toString()];
		Send(GameId, ClientID,1,Args);
	}

	UpdatePlayerDisplay();
}
function UpdateCurProdDisplay(id) {
	if (id) {
		var Prod = GetProdFromDispElemID(id);
		CurrentlySelectedProduct = Prod;
		$("#ProductWindow").show();
		$("#ProductWindow").css("border-color", Prod.Owner.Color);
		if (Prod.OwnerNumber === TheGame.CurrentPlayerNum) {
			$("#CurProdDetailsButton").prop("disabled", false);
			$("#CurProdRevertButton").prop("disabled", false);
			var CurPhase = CurrentlySelectedProduct.Phase;
			if ((CurPhase === ProductPhases.Maintenance) || ((CurPhase === ProductPhases.Prototype && !(Prod.hasPrototype)) || (CurPhase === ProductPhases.Deployment && !(Prod.readyToDeploy)))) {
				$("#CurProdAdvanceButton").prop("disabled", true);
			} else {
				$("#CurProdAdvanceButton").prop("disabled", false);
			}
			if (CurPhase === ProductPhases.Idea) {
				$("#CurProdRevertButton").text("Remove");
			} else {
				$("#CurProdRevertButton").text("Regress");
			}
			if (TheGame.PatentTracker) {
				if (isThisCategoryPatented(Prod, TheGame) && isThisProductPatented(Prod, TheGame)) {
					$("#CurProdPatentButton").text("Patented!");
					$("#CurProdPatentButton").prop("disabled", true);
				} else {
					$("#CurProdPatentButton").text("Patent");
					$("#CurProdPatentButton").prop("disabled", false);
				}
			} else {
				$("#CurProdPatentButton").hide();
			}
		} else {
			$("#CurProdAdvanceButton").prop("disabled", true);
			$("#CurProdRevertButton").prop("disabled", true);
			$("#CurProdDetailsButton").prop("disabled", true);
			$("#CurProdPatentButton").prop("disabled", true);
		}
		document.getElementById("ProdDisplayName").innerHTML = Prod.Name;
		document.getElementById("ProdOwnerDisplayName").innerHTML = Prod.Owner.Name;
		document.getElementById("DisplayCAT").innerHTML = Prod.Category;
		document.getElementById("DisplaySUBCAT").innerHTML = Prod.SubCategory;
		var productScore = Math.round(getMonetaryValue(Prod) * TotalPayoutRate * (1.4 - 0.2 * (GetDifficultyConstant(TheGame.Settings.Difficulty))));
		var rating = productScore.toString();
		document.getElementById("DisplayOVLS").innerHTML = "$" + rating.toString();
	}
}
function PopulateDetails(id) {
	if (id) {
		var Prod = GetProdFromDispElemID(id);
		CurrentlySelectedProduct = Prod;
		$("#DetailsDialog").css("border-color", Prod.Owner.Color);

		$("#DetailsProd").text(Prod.Name);
		$("#DetailsCAT").text(Prod.Category);
		$("#DetailsSUBCAT").text(Prod.SubCategory);
		$("#DetailsPIS").text(Prod.IdeaStrength.toString());
		$("#DetailsPDS").text(Prod.DesignStrength.toString());
		$("#DetailsPBS").text(Prod.BuildStrength.toString());
		$("#DetailsTSS").text(Math.round(Prod.TestingStrength).toString());
		$("#DetailsCOS").text((Math.round((1 - Prod.Volatility) * 100)).toString() + "%");
		if (Prod.hasPrototype) {
			$("#DetailsHPT").text("Yes");
		} else {
			$("#DetailsHPT").text("No");
		}
		if (Prod.readyToDeploy) {
			$("#DetailsDPR").text("Yes");
		} else {
			$("#DetailsDPR").text("No");
		}
	}
}
function GetProdFromDispElemID(id) {
	var NewID = id.replace("ProductDisplayItem_", "");
	NewID = parseInt(NewID, 10);
	var Prod = TheGame.PlayerProducts[NewID];
	return Prod;
}
function TryToAdvanceProduct(online,cid,args) {
	var prod=CurrentlySelectedProduct;
	var ply=TheGame.CurrentPlayer;
	if((online)&&(cid!=ClientID)){
		prod=TheGame.PlayerProducts[parseInt(args[0], 10)];
		ply=TheGame.Players[cid];
	}
	var CurPhase = prod.Phase;
	if (CurPhase !== ProductPhases.Maintenance) {
		playSound(GameSounds.AdvanceProduct);
	}
	if (CurPhase === ProductPhases.Idea) {
		prod.Phase = ProductPhases.Design;
	} else if (CurPhase === ProductPhases.Design) {
		prod.Phase = ProductPhases.Prototype;
	} else if (CurPhase === ProductPhases.Prototype) {
		ply.Money = ply.Money - BaseCosts.Prototype * SubCategoryAttributes[prod.SubCategory][1];
		prod.Phase = ProductPhases.PrototypeTesting;
	} else if (CurPhase === ProductPhases.PrototypeTesting) {
		prod.Phase = ProductPhases.Development;
	} else if (CurPhase === ProductPhases.Development) {
		prod.Phase = ProductPhases.PreDepTesting;
	} else if (CurPhase === ProductPhases.PreDepTesting) {
		prod.Phase = ProductPhases.Deployment;
	} else if (CurPhase === ProductPhases.Deployment) {
		ply.Money = ply.Money - BaseCosts.Deployment;
		prod.Phase = ProductPhases.PostDepTesting;
	} else if (CurPhase === ProductPhases.PostDepTesting) {
		prod.Phase = ProductPhases.Maintenance;
	} else if (CurPhase === ProductPhases.Maintenance) {
		if(cid==ClientID){playSound(GameSounds.Wrong_Low)};
	}
	if (prod.isANewProduct && prod.Phase === ProductPhases.Maintenance) {
		prod.isANewProduct = false;
	}
	
	if((online)&&(cid==ClientID)){
		Args=[prod.GlobalID.toString()];
		Send(GameId, ClientID,6,Args);
		UpdateCurProdDisplay(prod.DisplayItemID);
	}
	else if (!online) {
		UpdateCurProdDisplay(prod.DisplayItemID);
	}
	UpdateProductListDisplayPosition(GetProductsInSamePhase(prod));
	UpdateProductListDisplayPosition(GetProductsInThisPhase(CurPhase, prod.Owner));
	UpdatePlayerDisplay();
}
function TryToRevertProduct(online,cid,args) {
	var prod=CurrentlySelectedProduct;
	var ply=TheGame.CurrentPlayer;
	if((online)&&(cid!=ClientID)){
		prod=TheGame.PlayerProducts[parseInt(args[0], 10)];
		ply=TheGame.Players[cid];
	}
	var CurPhase = prod.Phase;
	var removeCheck = false;
	if (CurPhase !== ProductPhases.Idea) {
		if(cid==ClientID){playSound(GameSounds.MinorFail)};
	}
	if (CurPhase === ProductPhases.Idea) {
		if(cid==ClientID){
			ShowRemoveDialog();
			removeCheck = true;
		}
	} else if (CurPhase === ProductPhases.Design) {
		prod.Phase = ProductPhases.Idea;
		prod.DesignStrength = 0;
	} else if (CurPhase === ProductPhases.Prototype) {
		prod.Phase = ProductPhases.Design;
	} else if (CurPhase === ProductPhases.PrototypeTesting) {
		prod.Phase = ProductPhases.Prototype;
	} else if (CurPhase === ProductPhases.Development) {
		prod.Phase = ProductPhases.PrototypeTesting;
		prod.BuildStrength = 0;
	} else if (CurPhase === ProductPhases.PreDepTesting) {
		prod.Phase = ProductPhases.Development;
	} else if (CurPhase === ProductPhases.Deployment) {
		prod.Phase = ProductPhases.PreDepTesting;
		ply.Money = ply.Money - BaseCosts.Deployment / 2;
	} else if (CurPhase === ProductPhases.PostDepTesting) {
		prod.Phase = ProductPhases.Deployment;
		ply.Money = ply.Money - BaseCosts.Deployment / 2;
	} else if (CurPhase === ProductPhases.Maintenance) {
		prod.Phase = ProductPhases.PostDepTesting;
	}
	if((online)&&(cid==ClientID)){
		Args=[prod.GlobalID.toString()];
		Send(GameId, ClientID,7,Args);
		if (!removeCheck){
			UpdateCurProdDisplay(prod.DisplayItemID);
		}
	}
	else if (!online && !removeCheck) {
		UpdateCurProdDisplay(prod.DisplayItemID);
	}
	if (!removeCheck) {
		UpdateProductListDisplayPosition(GetProductsInSamePhase(prod));
		UpdateProductListDisplayPosition(GetProductsInThisPhase(CurPhase, prod.Owner));
		UpdatePlayerDisplay();
	}
}
function VisualCashAlert() {
	var Ply = TheGame.CurrentPlayer;
	var Amt = Ply.Money - Ply.LastDisplayedMoney;
	var theNumber;
	
	if (Online){
		theNumber = "Online";
	}
	else {
		theNumber = NumberNameTable[TheGame.CurrentPlayerNum + 1];
	}
	if (!ShowCashAlert) {
		return;
	}
	if (Amt === 0) {
		return;
	}
	var Elem = $("#Cash" + theNumber);
	var Str = "";
	var Col = "";
	if (Amt < 0) {
		Col = "red";
		Str = "-$";
		playSound(GameSounds.LoseMoney);
	} else {
		Col = "cyan";
		Str = "+$";
		playSound(GameSounds.GainMoney);
	}
	Str = Str + Amt.toString().replace("-", "");
	ResetCashDisplayPos(theNumber);
	Elem.html(Str);
	Elem.css("color", Col);
	Elem.css("visibility", "visible");
	Elem.css("transition", "top 1s ease-in,opacity 1s ease-in");
	Elem.css("top", "4%");
	Elem.css("opacity", "0");
	setTimeout(function () {
		ResetCashDisplayPos(theNumber);
	}, 1000);
	Ply.LastDisplayedMoney = Ply.Money;
}
function ResetCashDisplayPos(num) {
	var Elem = $("#Cash" + num);
	Elem.css("transition", "none");
	Elem.css("top", "9%");
	Elem.css("opacity", "1");
	Elem.css("visibility", "hidden");
}
function PopulateScoreboard() {
	for (var PlyNum in TheGame.Players) {
		var Ply = TheGame.Players[PlyNum];
		var Str = "";
		if (PlyNum === "0") {
			Str = "PlyOne";
		} else if (PlyNum === "1") {
			Str = "PlyTwo";
		} else if (PlyNum === "2") {
			Str = "PlyThree";
		} else if (PlyNum === "3") {
			Str = "PlyFour";
		} else if (PlyNum === "4") {
			Str = "PlyFive";
		} else if (PlyNum === "5") {
			Str = "PlySix";
		}
		$("#" + Str + "ScbdBox").show();
		$("#" + Str + "ScbdBox").css("border-color", Ply.Color);
		$("#" + Str + "ScbdName").html(Ply.Name);
		$("#" + Str + "ScbdMoney").html(Ply.Money);
		$("#" + Str + "ScbdProds").html(Ply.NumProducts);
		$("#" + Str + "ScbdEmps").html(Ply.NumQA + Ply.NumDevs + Ply.NumCreative);
		if (!(Ply.isActive)){
			$("#" + Str + "ScbdBox").css('opacity',0.5);
		}
	}
}
function CycleTurn(online,cid,args) {
	if(!online){
		ActuallyCycleTurn(false);
	}else{
		TheGame.Players[cid].FinishedCurrentTurn=true;
		if(cid==ClientID){
			$("#ControlLock").show();
			Send(GameId, ClientID,2,[]);
		}
		var WillCycle=true;
		TheGame.Players.forEach(function(dude){
			if(!(dude.FinishedCurrentTurn) && (dude.isActive)){
				WillCycle = false;
			}
		});
		if(WillCycle){
			ActuallyCycleTurn(true);
		}
	}
}
function ActuallyCycleTurn(roundOnly){
	TheGame.CurrentPlayer.hasMadeProductThisTurn = false;
	$("#new-product-button").attr("disabled", (TheGame.CurrentPlayer.hasMadeProductThisTurn));
	$(".ProductDisplayItem").css("z-index", 1);
	$(".ProductDisplayItem").css("opacity", 0.5);
	if (TheGame.NumPlayers > 1) {
		var WillGo = false;
		if(!roundOnly){
			var NewPlyNum = TheGame.CurrentPlayerNum + 1;
			if (NewPlyNum > (TheGame.NumPlayers - 1)) {
				NewPlyNum = 0;
				WillGo = true;
			}
			TheGame.CurrentPlayerNum = NewPlyNum;
			TheGame.CurrentPlayer = TheGame.Players[TheGame.CurrentPlayerNum];
			$("#CurProdAdvanceButton").prop("disabled", true);
			$("#CurProdRevertButton").prop("disabled", true);
			if (CurrentlySelectedProduct) {
				UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayElemID);
			}
		}else{
			if (CurrentlySelectedProduct) {
				UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayElemID);
			}
			WillGo=true;
		}
		if (WillGo) {
			DisplayNewRoundEvent();
		} else {
			if (TheGame.CurrentPlayer.Type === "Computer") {
				$("#ControlLock").show();
			} else{
				$("#ControlLock").hide();
			}
			TriggeredEventIterator(TheGame.CurrentPlayer.TriggeredEvents);
			for (i = 0; i < TheGame.CurrentPlayer.Products.length; i++) {
				$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("z-index", 2);
				$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("opacity", 1);
			}
			playSound(GameSounds.NextTurn);
			$("#ProductWindow").hide();
			UpdatePlayerDisplay();
		}
	} else {
		DisplayNewRoundEvent();
	}
	TheGame.CurrentPlayer.TurnInit();
}
function CheckForBrokenProducts(){
	var TheBrokenProducts = [];
	var BrokenRate;
	for (var ProdNum in TheGame.PlayerProducts){
		BrokenRate = 0;
		if (TheGame.PlayerProducts[ProdNum].Phase === ProductPhases.Maintenance){
			BrokenRate = DoesItBreak(TheGame.PlayerProducts[ProdNum]);
		}
		TheBrokenProducts.push(BrokenRate);
	}
	SetBrokenProducts(Online, ClientID, JSON.stringify(TheBrokenProducts));
}
function SetBrokenProducts(online, cid, args){
	var TheBrokenProducts = JSON.parse(args);
	for (var ProdNum in TheGame.PlayerProducts){
		TheGame.PlayerProducts[ProdNum].BugAmount = TheBrokenProducts[ProdNum];
	}
	if (online && cid===ClientID){
		Send(ClientID,10,args);
	}
}
function CashChangeOnline(online, cid, args){
	var Ply = TheGame.Players[parseInt(args[0],10)];
	var CashChange = parseInt(args[1], 10);
	Ply.Money += CashChange;
	if (online && cid===ClientID){
		Send(cid,11,args);
	}
}
function DisplayNewRoundEvent() {
	window.clearInterval(TimerInterval);
	TheGame.Players.forEach(function(ply){
		ply.FinishedCurrentTurn=false;
	});
	$("#ControlLock").hide();
	var Num = TheGame.CurrentRound + 1;
	$('.Standard').attr("disabled", true);
	if (Num <= TheGame.Settings.NumberOfRounds) {
		if (!Online || Host){
			CheckForBrokenProducts();
		}
		if (TheGame.Settings.NumberOfRounds - Num <= 5) {
			changeCurrentBGM("TimeRunningOut");
		}
		var Elem = document.getElementById("MainBoard");
		Elem.style.transition = "left .75s ease-out";
		Elem.style.left = "800px";
		Elem = document.getElementById("RoundAnnouncer");
		Elem.innerHTML = "ROUND<br>" + Num;
		Elem.style.transition = "top .9s ease-out";
		Elem.style.top = "100px";
		playSound(GameSounds.NextRound);
		setTimeout(function () {
			var Elem = document.getElementById("MainBoard");
			Elem.style.transition = "none";
			Elem.style.left = "-800px";
			setTimeout(function () {
				var Elem = document.getElementById("MainBoard");
				Elem.style.transition = "left .65s ease-out";
				Elem.style.left = "0px";
				Elem = document.getElementById("RoundAnnouncer");
				Elem.style.transition = "top .5s ease-out";
				Elem.style.top = "600px";
				for (i = 0; i < TheGame.CurrentPlayer.Products.length; i++) {
					$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("z-index", 2);
					$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("opacity", 1);
				}
				$("#ProductWindow").hide();
				$("#RoundNumberDisplay").text("ROUND " + Num.toString());
				CurrentlySelectedProduct = null;
				StartTheClock();
				setTimeout(function () {
					var Elem = document.getElementById("MainBoard");
					Elem.style.transition = "none";
					Elem = document.getElementById("RoundAnnouncer");
					Elem.style.transition = "none";
					Elem.style.top = "-600px";
					$('.Standard').attr("disabled", false);
					NewRoundCalc();
				}, 650);
			}, 750);
		}, 650);
	} else {
		FinishGame();
	}
}
function NewRoundCalc() {
	if (!Online || Host){
		RandomEventSelector();
	}
	DecrementCategoryChanges();
	for (var i = 0; i < TheGame.Players.length; i++) {
		var Ply = TheGame.Players[i];
		Ply.HadAProductThisTurn = false;
		if (Ply.NumProducts > 0 && Ply.isActive) {
			Ply.HadAProductThisTurn = true;
			for (var j = 0; j < Ply.Products.length; j++) {
				var Prod = Ply.Products[j];
				if (Prod.Phase !== Prod.PhaseAtStartOfTurn) {
					Prod.turnsInSamePhase = 0;
				}
				Prod.PhaseAtStartOfTurn = Prod.Phase;
				Prod.turnsInSamePhase++;
				if (Prod.justStarted) {
					Prod.justStarted = false;
				}
				var numOnSameSpot = 0;
				for (k = 0; k < Ply.Products.length; k++) {
					if (Prod.Phase === Ply.Products[k].Phase) {
						numOnSameSpot++;
					}
				}
				if (numOnSameSpot === 0){
					numOnSameSpot = 1;
				}
				if (Prod.Phase === ProductPhases.Idea) {
					Prod.IdeaStrength = Prod.IdeaStrength + Math.ceil(SubCategoryAttributes[Prod.SubCategory][2] * 60 * (1.4 - 0.2 * (GetDifficultyConstant(TheGame.Settings.Difficulty))) / (numOnSameSpot + Prod.turnsInSamePhase));
					MoveItSoon(Ply, Prod);
				} else if (Prod.Phase === ProductPhases.Design) {
					EmployeeReductionCheck("des", Ply, Prod);
					Prod.DesignStrength = Prod.DesignStrength + Math.ceil(20 * Ply.NumCreative * (Math.log(3) / Math.log(3 + Ply.NumCreative)) / (numOnSameSpot + Prod.turnsInSamePhase));
				} else if (Prod.Phase === ProductPhases.Prototype) {
					Prod.hasPrototype = true;
					MoveItSoon(Ply, Prod);
				} else if (Prod.Phase === ProductPhases.PrototypeTesting) {
					EmployeeReductionCheck("tes", Ply, Prod);
					Prod.DesignStrength = Prod.DesignStrength + Math.ceil(Ply.NumQA * 12 * (Math.log(3) / Math.log(3 + Ply.NumQA)) / (numOnSameSpot + Prod.turnsInSamePhase));
					Prod.TestingStrength += (Prod.DesignStrength * 0.1 * Ply.NumQA * (Math.log(3) / Math.log(3 + Ply.NumQA)) / (numOnSameSpot + Prod.turnsInSamePhase));
				} else if (Prod.Phase === ProductPhases.Development) {
					EmployeeReductionCheck("dev", Ply, Prod);
					Prod.BuildStrength = Prod.BuildStrength + Math.ceil(20 * Ply.NumDevs * (Math.log(3) / Math.log(3 + Ply.NumDevs)) / (numOnSameSpot + Prod.turnsInSamePhase));
				} else if (Prod.Phase === ProductPhases.PreDepTesting) {
					EmployeeReductionCheck("tes", Ply, Prod);
					Prod.BuildStrength = Prod.BuildStrength + Math.ceil(Ply.NumQA * 12 * (Math.log(3) / Math.log(3 + Ply.NumCreative)) / (numOnSameSpot + Prod.turnsInSamePhase));
					Prod.TestingStrength += (Prod.BuildStrength * 0.1 * Ply.NumQA * (Math.log(3) / Math.log(3 + Ply.NumCreative)) / (numOnSameSpot + Prod.turnsInSamePhase));
				} else if (Prod.Phase === ProductPhases.Deployment) {
					Prod.readyToDeploy = true;
					MoveItSoon(Ply, Prod);
				} else if (Prod.Phase === ProductPhases.PostDepTesting) {
					EmployeeReductionCheck("tes", Ply, Prod);
					Prod.TestingStrength += Math.ceil(0.05 * (Prod.DesignStrength + Prod.BuildStrength) * Ply.NumQA * (Math.log(3) / Math.log(3 + Ply.NumCreative)) / (numOnSameSpot + Prod.turnsInSamePhase));
				} else if (Prod.Phase === ProductPhases.Maintenance) {
					var Broken = Prod.BugAmount;
					if (Broken > 0) {
						var Damages = Math.ceil((BaseCosts.PostDepBugCost) + getMonetaryValue(Prod) * Broken);
						CashChangeOnline(Online, ClientID, [Ply.Number.toString(),-Damages.toString()]);
						if (!Online || (Online && Ply.Number === ClientID)){
							IsItSoBadItGetsRemoved(Ply, Prod, Damages);
						}
						Prod.TestingStrength += (Prod.DesignStrength + Prod.BuildStrength);
					}
				}
				Prod.Volatility = 1 / (1 + 0.1 * Prod.TestingStrength * (1.4 - 0.2 * (GetDifficultyConstant(TheGame.Settings.Difficulty))));
			}
		}
	}
	for (var i = 0; i < TheGame.Players.length; i++) {
		var Ply = TheGame.Players[i];
		var Net = 0;
		if (Ply.isActive){
			if (Ply.NumProducts > 0) {
				for (var j = 0; j < Ply.Products.length; j++) {
					var Prod = Ply.Products[j];
					if (Prod.Phase === ProductPhases.Maintenance && (SubCategoryAttributes[Prod.SubCategory][4] <= 0)) {
						var earnings = Math.round(getMonetaryValue(Prod) * SubCategoryAttributes[Prod.SubCategory][3] * TotalPayoutRate * (1.4 - 0.2 * (GetDifficultyConstant(TheGame.Settings.Difficulty))));
						if (TheGame.PatentTracker) {
							patentOwnerID = doIPayRoyalties(Prod, TheGame.PatentTracker);
							if (patentOwnerID !== -1) {
								cashOwed = Math.round(earnings / 10);
								earnings -= cashOwed;
								TheGame.Players[patentOwnerID].Money += cashOwed;
							}
						}
						Net += earnings;
					}
				}
			}
			else if (!(Ply.HadAProductThisTurn)) {
				Net = Math.round(BasePayouts.DayJobEachTurn * TotalPayoutRate * (1.4 - 0.2 * (GetDifficultyConstant(TheGame.Settings.Difficulty))));
			}
			if (Ply.Money < 0){
				Net += Math.floor((Ply.Money * TheGame.InterestRate) - (Ply.Money))
			}
			Net = Net - ((BaseCosts.PayDev * Ply.NumDevs) + (BaseCosts.PayQA * Ply.NumQA) + (BaseCosts.PayCreative * Ply.NumCreative));
			Ply.Money = Ply.Money + Net;
		}
	}
	TheGame.CurrentRound = TheGame.CurrentRound + 1;
	if (TheGame.CurrentPlayer.Type === "Computer") {
		$("#ControlLock").show();
	} else {
		$("#ControlLock").hide();
	}
	if(!Online){
		RandomEventIterator();
	}else if(Host){
		var TheVents = [];
		for (var AnEvent in RandomEventsToIterate){
			TheVents.push($.extend(true, {}, RandomEventsToIterate[AnEvent]));
		}
		Send(GameId,ClientID,8,JSON.stringify(TheVents));
		RandomEventIterator();
	}
	UpdatePlayerDisplay();
	if (CurrentlySelectedProduct) {
		UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	}
}
function RandomEventsGo(online,cid,args){
	if(!online){alert("you cant do this");return;}
	if(cid===ClientID){alert("don't do this");return;}
	RandomEventsToIterate=JSON.parse(args);
	RandomEventIterator();
	UpdatePlayerDisplay();
}
function DecrementCategoryChanges() {
	for (SubCat in SubCategoryAttributes) {
		if (SubCategoryAttributes[SubCat][3] === 0) {
			SubCategoryAttributes[SubCat][3] = 0.1;
		} else {
			if (SubCategoryAttributes[SubCat][3] > 1) {
				SubCategoryAttributes[SubCat][3] -= 0.1;
			} else if (SubCategoryAttributes[SubCat][3] * 10 < 1) {
				SubCategoryAttributes[SubCat][3] += 0.1;
			}
			SubCategoryAttributes[SubCat][3] = Math.round(SubCategoryAttributes[SubCat][3] * 10) / 10;
		}
		if (SubCategoryAttributes[SubCat][4] > 0) {
			SubCategoryAttributes[SubCat][4]--;
		}
	}
	if (Math.round(TotalPayoutRate * 10) / 10 > 1) {
		TotalPayoutRate -= 0.1;
	} else if (Math.round(TotalPayoutRate * 10) / 10 < 1) {
		TotalPayoutRate += 0.1;
	}
}
function Appear() {
	$("#MainBoard").show();
	ShowCashAlert = true;
}

function PatentTracker() {
	var newPatentTracker = {};
	newPatentTracker.ClassName = "PATENTTRACKER";
	newPatentTracker.Categories = [];
	newPatentTracker.numPatents = 0;

	for (Item in ProductCategories) {
		for (SubItem in ProductCategories[Item]) {
			newPatentTracker.Categories.push(ProductCategories[Item][SubItem]);
		}
	}
	newPatentTracker.Records = [];

	for (Item in newPatentTracker.Categories) {
		newPatentTracker.Records.push([newPatentTracker.Categories[Item], null, null]);
	}

	return newPatentTracker;
}

//This is here for unit testing purposes. And also because it works offline for sure.
function OldTryToBuyPatent(product, game) {
 	var cost = 2000;
 	var patentMessage = "Product " + product.Name + " was successfully patented!";
	var categoryIndex = game.PatentTracker.Categories.indexOf(product.SubCategory);
 	var isPatentedAlready = isThisCategoryPatented(product, game);
 	var inPatentableCategory = true;
 	var preMaintenance = product.isANewProduct;
 	var wellBuiltEnough = getMonetaryValue(product) >= 1000;
 	var hasTheMoney = (game.CurrentPlayer.Money >= cost);

 	if (isPatentedAlready) {
 		patentOwner = game.PatentTracker.Records[categoryIndex][1];
 		if (patentOwner === game.CurrentPlayer.GlobalID) {
 			patentMessage = "You've already purchased a patent for this type of product!";
 		} else {
 			patentMessage = "Player " + (patentOwner + 1).toString() + ": " + game.Players[patentOwner].Name + " already has the patent for " + product.SubCategory + " products!";
 		}
 	} else if (!inPatentableCategory) {
 		patentMessage = product.SubCategory + "-type products cannot be patented!";
 	} else if (!preMaintenance) {
 		patentMessage = "This product has already been on the market!";
 	} else if (!wellBuiltEnough) {
 		patentMessage = "Your product isn't impressive enough just yet!";
 	} else if (!hasTheMoney) {
 		patentMessage = "You are $" + (cost - game.CurrentPlayer.Money).toString() + " short!";
 	} else {
		game.CurrentPlayer.Money -= cost;
		game.PatentTracker.Records[categoryIndex][1] = game.CurrentPlayer.GlobalID;
		game.PatentTracker.Records[categoryIndex][2] = product.GlobalID;
		game.PatentTracker.numPatents++;
		UpdatePlayerDisplay();
		UpdateCurProdDisplay(product.DisplayItemID);
 	}
 	return patentMessage;
}

function TryToBuyPatent() {
	var product=CurrentlySelectedProduct;
	var game=TheGame;
	var cost = 2000;
	var patentMessage = "Product " + product.Name + " was successfully patented!";

	var categoryIndex = game.PatentTracker.Categories.indexOf(product.SubCategory);

	var isPatentedAlready = isThisCategoryPatented(product, game);
	var inPatentableCategory = true;
	var preMaintenance = product.isANewProduct;
	var wellBuiltEnough = getMonetaryValue(product) >= 1000;
	var hasTheMoney = (game.CurrentPlayer.Money >= cost);

	if (isPatentedAlready) {
		patentOwner = game.PatentTracker.Records[categoryIndex][1];

		if (patentOwner === game.CurrentPlayer.GlobalID) {
			patentMessage = "You've already purchased a patent for this type of product!";
		} else {
			patentMessage = "Player " + (patentOwner + 1).toString() + ": " + game.Players[patentOwner].Name + " already has the patent for " + product.SubCategory + " products!";
		}
	} else if (!inPatentableCategory) {
		patentMessage = product.SubCategory + "-type products cannot be patented!";
	} else if (!preMaintenance) {
		patentMessage = "This product has already been on the market!";
	} else if (!wellBuiltEnough) {
		patentMessage = "Your product isn't impressive enough just yet!";
	} else if (!hasTheMoney) {
		patentMessage = "You are $" + (cost - game.CurrentPlayer.Money).toString() + " short!";
	} else {
		PatentProduct(Online,ClientID,[product.GlobalID,cost]);
	}

	return patentMessage;
}

function PatentProduct(online,cid,args){
	var product=CurrentlySelectedProduct;
	var ply=TheGame.CurrentPlayer;
	var cost = parseInt(args[1],10);
	if((online)&&(cid!=ClientID)){
		product=TheGame.PlayerProducts[parseInt(args[0], 10)];
		ply=TheGame.Players[cid];
	}
	var categoryIndex = TheGame.PatentTracker.Categories.indexOf(product.SubCategory);
	ply.Money -= cost;
	TheGame.PatentTracker.Records[categoryIndex][1] = ply.GlobalID;
	TheGame.PatentTracker.Records[categoryIndex][2] = product.GlobalID;
	TheGame.PatentTracker.numPatents++;
	if((online)&&(cid==ClientID)){
		Send(GameId, ClientID,3,[product.GlobalID,cost]);
		UpdatePlayerDisplay();
		UpdateCurProdDisplay(product.DisplayItemID);
	}
}
function isThisCategoryPatented(prod, game) {
	return (game.PatentTracker.Records[(game.PatentTracker.Categories.indexOf(prod.SubCategory))][1] !== null);
}
function isThisProductPatented(prod, game) {
	return game.PatentTracker.Records[(game.PatentTracker.Categories.indexOf(prod.SubCategory))][2] === prod.GlobalID;
}
function removePatentFromRecords(product, game) {
	var categoryIndex = game.PatentTracker.Categories.indexOf(product.SubCategory);
	game.PatentTracker.Records[categoryIndex][1] = null;
	game.PatentTracker.Records[categoryIndex][2] = null;
}

function PatentMessageDisplay(theMessage) {
	UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);

	$("#PatentText").text(theMessage);
	var theSound = GameSounds.Event;

	if (theMessage.indexOf("successfully patented!") > -1) {
		$("#PatentTitle").text("SUCCESS!");
		EventFlash();
	} else {
		$("#PatentTitle").text("FAILURE!");
		theSound = GameSounds.Wrong_BAD;
	}

	if (theMessage.indexOf("successfully patented!") > -1) {
		$("#PatentTip").text("Now you earn revenue off of other players with the same type of product!");
		$("#PatentTip").show();
	} else if (theMessage.indexOf("impressive") > -1) {
		$("#PatentTip").text("Try further building the product's Idea, Design, or Build strength. Having a great and well-thought idea is key to a good innovation.");
		$("#PatentTip").show();
	} else if (theMessage.indexOf("already") > -1) {
		$("#PatentTip").text("Try innovating with a different type of product instead!");
		$("#PatentTip").show();
	} else {
		$("#PatentTip").hide();
	}
	playSound(theSound);
}

function doIPayRoyalties(product, patentTracker) {
	var patentOwnerID = -1;
	var index = patentTracker.Categories.indexOf(product.SubCategory);

	if ((product.Owner.GlobalID != patentTracker.Records[index][1]) && (patentTracker.Records[index][1] !== null)) {
		patentOwnerID = patentTracker.Records[index][1];
	}

	return patentOwnerID;
}

function RandomEventSelector() {
	var IterateThroughThese = new Array();
	var difficultyOffset = 2;
	if (TheGame.Settings.Difficulty === "EASY") {
		difficultyOffset = 5;
	} else if (TheGame.Settings.Difficulty === "HARD") {
		difficultyOffset = -2;
	} else if (TheGame.Settings.Difficulty === "LUNATIC") {
		difficultyOffset = -5;
	};
	for (i = 0; i < TheGame.RandomEvents.length; i++) {
		if (TheGame.RandomEvents[i].TurnsUntilActive > 0) {
			TheGame.RandomEvents[i].TurnsUntilActive = TheGame.RandomEvents[i].TurnsUntilActive - 1;
		}
	}
	for (j = 0; j < (Math.log(TheGame.CurrentRound + 6) / Math.log(10)); j++) {
		var theValue = Math.floor(Math.random() * 11 - 5) + difficultyOffset;
		for (i = 0; i < TheGame.RandomEvents.length; i++) {
			if (theValue === TheGame.RandomEvents[i].Scale) {
				if (IterateThroughThese.indexOf(TheGame.RandomEvents[i]) < 0) {
					if ((TheGame.RandomEvents[i].TurnsUntilActive <= 0) && (TheGame.RandomEvents[i].Likeliness >= Math.random())) {
						if (TheGame.RandomEvents[i].AreaOfEffect === "OnePlayer") {
							TheGame.RandomEvents[i].Target = Math.floor(Math.random() * TheGame.Players.length);
						} else {
							TheGame.RandomEvents[i].Target = [];
							for (var PlyNum in TheGame.Players){
								TheGame.RandomEvents[i].Target.push(PlyNum);
							}
						}
						
						if (TheGame.RandomEvents[i].Type === "AssetDestruction"){
							TheGame.RandomEvents[i].toBeRemoved = [];
							if (Array.isArray(TheGame.RandomEvents[i].Target)) {
								for (var l = 0; l < TheGame.RandomEvents[i].Target.length; l++) {
									var numProd = 0;
									var tries = 0;
									var playerNumber = TheGame.RandomEvents[i].Target[l];
									var ply = TheGame.Players[playerNumber];
									if (ply.Products.length > 0) {
										for (k = 0; ((numProd < TheGame.RandomEvents[i].Value) && numProd < ply.Products.length && (tries < 2 * TheGame.RandomEvents[i].Value)); k++) {
											k = (k % (ply.Products.length));
											if (k === 0) {
												tries++;
											}
											if (Math.random() > 0.85) {
												numProd++;
												if (TheGame.RandomEvents[i].toBeRemoved.indexOf(ply.Products[k].GlobalID) <= -1){
													TheGame.RandomEvents[i].toBeRemoved.push(ply.Products[k].GlobalID);
												}
											}
										}
									}
								}
							}
							else {
								var numProd = 0;
								var tries = 0;
								var playerNumber = TheGame.RandomEvents[i].Target;
								var ply = TheGame.Players[playerNumber];
								if (ply.Products.length > 0) {
									for (k = 0; (numProd < TheGame.RandomEvents[i].Value && numProd < ply.Products.length && (tries < 2 * TheGame.RandomEvents[i].Value)); k++) {
										k = (k % (ply.Products.length));
										if (k === 0) {
											tries++;
										}
										if (Math.random() > 0.85) {
											numProd++;
											if (TheGame.RandomEvents[i].toBeRemoved.indexOf(ply.Products[k].GlobalID) <= -1){
												TheGame.RandomEvents[i].toBeRemoved.push(ply.Products[k].GlobalID);
											}
										}
									}
								}
							}
						}
						IterateThroughThese.push(TheGame.RandomEvents[i]);
						TheGame.RandomEvents[i].TurnsUntilActive = TheGame.RandomEvents[i].OccurrenceInterval;
					}
				}
			}
		}
	}
	RandomEventsToIterate = IterateThroughThese;
}

function RandomEventIterator() {
	if (RandomEventsToIterate.length > 0) {
		playSound(GameSounds.Event);
		EventFlash();
		var Event = RandomEventsToIterate[0];
		var Msg = Event.Name;
		var Desc = Event.Message + " ";
		var AllCaps = (Event.Message === Event.Message.toUpperCase());
		var Action = Event.Type;
		var Value = Event.Value;
		var TargetNum = Event.Target;
		var Target = null;
		
		if (Array.isArray(TargetNum)){
			Target = TheGame.Players;
		}
		else {
			Target = TheGame.Players[TargetNum];
		}
		
		if (Action === "CashChange") {
			if (Array.isArray(Target)) {
				Desc += "All players receive $" + Value.toString() + "!";
				for (i = 0; i < Target.length; i++) {
					Target[i].Money += Value;
				}
			} else {
				Desc += "Player " + (Target.Name) + " receives $" + Value.toString() + "!";
				Target.Money += Value;
			}
		} else if (Action.indexOf("PayoutRateChange") > -1) {
			if (Value < 1) {
				Desc += "Revenue is reduced to " + Math.round(Value * 100) + "%";
			} else {
				Desc += "Revenue is " + Math.round((Value - 1) * 100) + "% more than normal";
			}
			if (Action.indexOf("_All") > -1) {
				Desc += " all around!";
				TotalPayoutRate = Value;
			} else {
				var effectedSubCat = Action.substring(17, Action.length);
				SubCategoryAttributes[effectedSubCat][3] = Value;
				Desc += " for all " + effectedSubCat + " products!";
			}
		} else if (Action.indexOf("CategoryShutdown") > -1) {
			Desc += "All ";
			if (Action.indexOf("SubCategoryShutdown") > -1) {
				var effectedSubCat = Action.substring(20, Action.length);
				SubCategoryAttributes[effectedSubCat][4] = Value;
				Desc += effectedSubCat + " products stop generating revenue for the next ";
			} else {
				var effectedCat = Action.substring(17, Action.length);
				for (i = 0; i < ProductCategories[effectedCat].length; i++) {
					SubCategoryAttributes[ProductCategories[effectedCat][i]][4] = Value;
				}
				Desc += effectedCat + " products stop generating revenue for the next ";
			}
			if (Value > 1) {
				Desc += Value.toString() + " turns!";
			} else {
				Desc += " turn!";
			}
		} else if (Action === "AssetDestruction") {
			var toBeRemoved = [];
			for (var Lost in Event.toBeRemoved){
				toBeRemoved.push(TheGame.PlayerProducts[Event.toBeRemoved[Lost]]);
			}
			if (Array.isArray(Target)) {
				Desc += "All players have lost up to " + Value.toString() + " product";
				if (Value !== 1) {
					Desc += "s";
				}
				Desc += "!";
			} else {
				var numProd = toBeRemoved.length;
				if (numProd > 1) {
					Desc += "Player " + Target.Name + " has lost " + numProd.toString() + " products!";
				} else if (numProd > 0) {
					Desc += "Player " + Target.Name + " has lost a product!";
				} else {
					Desc += "Player " + Target.Name + " luckily did not lose anything!";
				}
			}
			if (toBeRemoved.length > 0) {
				removeMultipleProducts(toBeRemoved);
			}
		}
		if (AllCaps){
			Desc = Desc.toUpperCase();
		}
		$("#EventTitle").text(Msg);
		$("#EventDesc").text(Desc);
		$("#EventImage").attr('src', "../images/events/event_" + Event.Picture + ".png");
		ShowEventDialog();
		RandomEventsToIterate.splice(0, 1);
		UpdatePlayerDisplay();
	} else {
		TriggeredEventIterator(TheGame.CurrentPlayer.TriggeredEvents);
	}
}

function getMonetaryValue(prod) {
	return Math.ceil(Math.pow(prod.IdeaStrength, 2) * Math.pow(prod.DesignStrength, 1.1) * Math.pow(prod.BuildStrength, 1.1) / 1000) * SubCategoryAttributes[prod.SubCategory][5];
}

function DoesItBreak(prod) {
	prod.BugAmount = (prod.Volatility - Math.random()) * SubCategoryAttributes[prod.SubCategory][0];
	return prod.BugAmount;
}

function MoveItSoon(Ply, prod) {
	var TheName = prod.Name;
	var ThePhase = ProductPhaseNames[prod.Phase];
	
	if (prod.Phase === ProductPhases.Prototype) {
		Ply.TriggeredEvents.push(function () {
			if (prod){
				TriggeredEventDisplay(Ply.Name + ", the prototype for your product " + TheName + " has been completed.", GameSounds.MoveitMessage, "longtime");
			}
			else {
				TriggeredEventDisplay(Ply.Name + ", the prototype for your product " + TheName + " had been completed, but it no longer exists.", GameSounds.MoveitMessage, "longtime");
			}
		});
	}
	else if (prod.Phase === ProductPhases.Deployment) {
		Ply.TriggeredEvents.push(function () {
			if (prod){
				TriggeredEventDisplay(Ply.Name + ", your product " + TheName + " is ready for deployment.", GameSounds.MoveitMessage, "longtime");
			}
			else {
				TriggeredEventDisplay(Ply.Name + ", your product " + TheName + " was ready for deployment, but it no longer exists.", GameSounds.MoveitMessage, "longtime");
			}
		});
	}
	else if (prod.turnsInSamePhase >= 6) {
		Ply.TriggeredEvents.push(function () {
			if (prod){
				TriggeredEventDisplay(Ply.Name + ", your product " + TheName + " has been in the " + ThePhase + " phase for a while. Consider moving it along.", GameSounds.MoveitMessage, "longtime");
			}
			else {
				TriggeredEventDisplay(Ply.Name + ", your product " + TheName + " was in the " + ThePhase + " phase for a while before it was lost.", GameSounds.MoveitMessage, "longtime");
			}
		});
	}
}

function EmployeeReductionCheck(employeeType, Ply, prod) {
	var numLost = 0;
	var messagePart;
	if (prod.turnsInSamePhase >= 8) {
		numLost = Math.ceil(Math.random() * 5);
		if (employeeType === "des") {
			if (numLost > Ply.NumCreative) {
				numLost = Ply.NumCreative;
			}
			Ply.NumCreative -= numLost;
			messagePart = numLost.toString() + " of your designers just quit!";
		} else if (employeeType === "dev") {
			if (numLost > Ply.NumDev) {
				numLost = Ply.NumDev;
			}
			Ply.NumDev -= numLost;
			messagePart = numLost.toString() + " of your developers just quit!";
		} else if (employeeType === "tes") {
			if (numLost > Ply.NumQA) {
				numLost = Ply.NumQA;
			}
			Ply.NumQA -= numLost;
			messagePart = numLost.toString() + " of your testers just quit!";
		}
		if (numLost > 0) {
			if(Online){
				var Args=[Ply.NumCreative.toString(),Ply.NumDev.toString(),Ply.NumQA.toString()];
				Send(GameId, ClientID,1,Args);
			}
			var TheName = prod.Name;
			Ply.TriggeredEvents.push(function () {
				EventFlash();
				if (prod) {
					TriggeredEventDisplay(Ply.Name + ", your " + TheName + " has been in the same phase for too long! " + messagePart, GameSounds.Event, "employeeloss");
				}
				else {
					TriggeredEventDisplay(Ply.Name + ", prior to being destroyed, your " + TheName + " was in the same phase for too long, and " + messagePart, GameSounds.Event, "employeeloss");
				}
				UpdatePlayerDisplay();
			});
		} else {
			MoveItSoon(Ply, prod);
		}
	} else {
		MoveItSoon(Ply, prod);
	}
}

function IsItSoBadItGetsRemoved(Ply, Prod, AmountLost) {
	if ((AmountLost >= getMonetaryValue(Prod))/2 || getMonetaryValue(Prod) <= 0) {
		Ply.TriggeredEvents.push(function () {
			EventFlash();
			removeProduct(Prod);
			TriggeredEventDisplay("Your " + Prod.Name + " was just recalled! Try again with something new!", GameSounds.Event, "fail");
		});
	}
}

function TriggeredEventDisplay(message, sound, picture) {
	playSound(sound);
	$("#TriggerDesc").text(message);
	$("#TriggerImage").attr('src', "../images/events/event_" + picture + ".png");
	ShowTriggerDialog();
}

function TriggeredEventIterator(TheTriggeredEvents) {
	if (TheTriggeredEvents.length > 0) {
		if (TheTriggeredEvents[0] !== null) {
			TheTriggeredEvents[0]();
		}
		TheTriggeredEvents.splice(0, 1);
	}
	else if (TheGame.GameType === "Local") {
		SaveThisGame("LastSavedGame");
	}
}

function EventFlash() {
	setTimeout(function () {
		$("#PopupOverlay").css("transition", "0ms ease-out");
		$("#PopupOverlay").css("background-color", "rgba(100,100,100,.75)");
		setTimeout(function () {
			$("#PopupOverlay").css("transition", "450ms ease-out");
			$("#PopupOverlay").css("background-color", "rgba(0,0,0,.5)");
		}, 50);
	}, 2);
}

function FinishGame() {
	TheGame.GameState = "COMPLETE";
	ShowCashAlert = false;
	$("#ProductWindow").hide();
	for (var i = 0; i < TheGame.Players.length; i++) {
		var Ply = TheGame.Players[i];
		var Net = 0;
		if (Ply.NumProducts < 1) {
			Net = Math.round(BasePayouts.DayJobEachTurn * TotalPayoutRate * (1.4 - 0.2 * (GetDifficultyConstant(TheGame.Settings.Difficulty))));
		} else {
			for (var j = 0; j < Ply.Products.length; j++) {
				var Prod = Ply.Products[j];
				if (Prod.Phase === ProductPhases.Maintenance && (SubCategoryAttributes[Prod.SubCategory][4] <= 0)) {
					var earnings = Math.round(getMonetaryValue(Prod) * SubCategoryAttributes[Prod.SubCategory][3] * TotalPayoutRate * (1.4 - 0.2 * (GetDifficultyConstant(TheGame.Settings.Difficulty))));
					if (TheGame.PatentTracker) {
						patentOwnerID = doIPayRoyalties(Prod, TheGame.PatentTracker);
						if (patentOwnerID !== -1) {
							cashOwed = Math.round(earnings / 10);
							earnings -= cashOwed;
							TheGame.Players[patentOwnerID].Money += cashOwed;
						}
					}
					Net += earnings;
				}
			}
		}
		Net = Net - ((BaseCosts.PayDev * Ply.NumDevs) + (BaseCosts.PayQA * Ply.NumQA) + (BaseCosts.PayCreative * Ply.NumCreative));
		Ply.Money = Ply.Money + Net;
	}
	GameOverDisplay();
}

function GameOverDisplay() {
	playSound(GameSounds.GameOver);
	$("#GameOverOverlay").show();
	$("#GameOverTitle").css("top", "200px");
	setTimeout(function () {
		$("#FinishGameButton").show();
		$("#FinishGameButton").attr("disabled", false);
		$("#FinishGameButton").css("transition", "opacity .6s ease-out");
		$("#FinishGameButton").css("opacity", "1");
	}, 900);
}

function GetFinalResults() {
	var Plyr = {};
	Plyr.length = 0;
	for (PlyNum in TheGame.Players) {
		var Ply = TheGame.Players[PlyNum];
		Plyr[PlyNum] = {};
		Plyr[PlyNum].Name = Ply.Name;
		Plyr[PlyNum].Money = Ply.Money;
		Plyr[PlyNum].Color = Ply.Color;
		Plyr[PlyNum].NumProducts = Ply.NumProducts;
		Plyr[PlyNum].NumEmployees = (Ply.NumQA + Ply.NumDevs + Ply.NumCreative);
		Plyr[PlyNum].isActive = Ply.isActive;
		Plyr.length++;
	}
	localStorage.setItem("FinalResults", JSON.stringify(Plyr));
	localStorage.setItem("WasItOnline", Online.toString());
}

function SwitchToFinalResults() {
	GetFinalResults();
	$("#Blanket").show();
	setTimeout(function () {
		$("#Blanket").css("transition", "500ms ease-out");
		$("#Blanket").css("opacity", "1");
		setTimeout(function () {
			window.location = "gameover.html";
		}, 650);
	}, 50);
}

function QuitNetworkedGame(online,cid,args){
	if(!online){alert("what in the world...?");return;}
	if(cid===ClientID && args==="NoRecursion"){
		Send(GameId, ClientID,4,Host.toString());
	}else{
		TheGame.Players[cid].isActive = false;
		var WereTheyHost = args === "true";
		if (WereTheyHost){
			TheGame.Players[cid].isHost = false;
			TheGame.Players[(cid+1)%(TheGame.Players.length)].isHost = true;
			Host = ClientID===((cid+1)%(TheGame.Players.length));
			localStorage.setItem("Host", Host.toString());
		}
	}
}