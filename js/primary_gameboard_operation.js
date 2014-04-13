var TheGame;
var RotateDir=0;
var Rotation=0;
var CurrentlySelectedProduct;
var ShowCashAlert=false;
var EVENT_CHANCE=0.5;
var BOARD_WIDTH=800; //used until we can dynamically grab the main background's width
var TotalPayoutRate=1;
var ProductsBeingRemoved;
var RandomEventsToIterate;

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
};
var BasePayouts={
	DayJobEachTurn:100
};
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
};
var PhasePositions={
	Idea:[270+225*Math.cos(13*Math.PI/8),270+225*Math.sin(13*Math.PI/8)], //[350,50],
	Design:[270+225*Math.cos(15*Math.PI/8),270+225*Math.sin(15*Math.PI/8)], //[480,180],
	Prototype:[270+225*Math.cos(1*Math.PI/8),270+225*Math.sin(1*Math.PI/8)], //[480,340],
	PrototypeTesting:[270+225*Math.cos(3*Math.PI/8),270+225*Math.sin(3*Math.PI/8)], //[350,480],
	Development:[270+225*Math.cos(5*Math.PI/8),270+225*Math.sin(5*Math.PI/8)], //[190,480],
	PreDeploymentTesting:[270+225*Math.cos(7*Math.PI/8),270+225*Math.sin(7*Math.PI/8)], //[60,340],
	Deployment:[270+225*Math.cos(9*Math.PI/8),270+225*Math.sin(9*Math.PI/8)], //[60,180],
	PostDeploymentTesting:[270+225*Math.cos(11*Math.PI/8),270+225*Math.sin(11*Math.PI/8)], //[190,50],
	Maintenance:[270,270]
};
//Format is: Name, Initial Description, AreaOfEffect, Scale, Type, Value, Picture, Likeliness, and OccurrenceInterval (With a counter)
//0  Name is a self-explanatory string
//1  Initial description is what goes at the beginning of the smaller text in the random event modal.
//2  AreaOfEffect is a string that determines whether to display to all players or one random player
//3  Scale is an integer rating between -10 and 10, -10 being the most negative and 10 being the most positive
//4  Type is a string that labels what kind of event it is
//5  Value is the parameter necessary for that type of event to execute properly
//6  Picture is a string for the suffix of the picture file name to be used. Ex. "cash" for event_cash.png Pics themselves should be 250*250 pngs.
//7  Likeliness is self-explanatory, but it's a decimal between 0 and 1
//8  OccurrenceInterval is the number of turns an event has to wait before occurring again
//9  There's also a counter to help with that. It starts at 3 for all to delay their occurrence in the game.
var RandomEvents=[
	["Tax break!","The IRS is in a good mood!","AllPlayers",2,"CashChange",750,"cash", 0.45, 12, 3],
	["Explosion!","A major accident has destroyed a great chunk of your area!","OnePlayer",-5,"AssetDestruction",2,"disaster", 0.3, 6, 3],
	["Stock Market Plummets!","People are scared to buy new things!","AllPlayers",-3,"PayoutRateChange_All",0.5,"stockcrash", 0.4, 10, 3],
	["Video Game craze!","A new study was released showing positive effects of gaming!","AllPlayers",3,"PayoutRateChange_Video Game",1.5,"controller", 0.35, 15, 3],
	["Cyber-security Attack!","Could Anonymous be at it again?","AllPlayers",-6,"CategoryShutdown_Software",2,"cyberattack", 0.1, 5, 3],
	["All airlines grounded!","Authorities swear this is just protocol.","AllPlayers",-4,"SubCategoryShutdown_Air",1,"airport", 0.2, 20, 3],
	["Alternative Energy!","Yet another push for alternative energy sources is picking up steam.","AllPlayers",1,"PayoutRateChange_Solar",1.1,"solarpanel", 0.7, 12, 3],
	["Recession!","The economy looks to be in bad shape right now.","AllPlayers",-9,"PayoutRateChange_All",0.1,"recession", 0.1, 40, 3],
	["Going green!","Whether it's for the trees or against these devices...","AllPlayers",-1,"PayoutRateChange_Printer",0.7,"tree", 0.8, 9, 3],
	["Grant!","Someone with high authority seems to like what you are doing.","OnePlayer",10,"CashChange",100000,"cash", 0.2, 60, 3]
];
var ProductCategories={
	Energy:["Hydroelectric","Solar","Fossil Fuel","Wind"],
	Transportation:["Space","Air","Land","Sea"],
	Hardware:["Desktop","Laptop","Peripheral","Printer"],
	Software:["Communication","Office Program","Video Game","Web Application"],
	Houseware:["Cleaning","Furniture","Kitchen","Barbecue"],
	Other:["School","Shoes","Musical","Key Holder"]
};
//The attributes are, in order: Volatility multiplier (Index 0), Prototype Cost multiplier (Index 1), and Idea Strength increase multiplier (Index 2)
//Also include are Payout multipliers (Index 3) and TurnsShutdown (Index 4), for events
var SubCategoryAttributes={
	"Hydroelectric":[1,1,1,1,0],
	"Solar":[1,0.8,0.8,1,0],
	"Fossil Fuel":[1.1,0.9,1.1,1,0],
	"Wind":[0.7,0.8,0.6,1,0],
	"Space":[3,2,2,1,0],
	"Air":[2.5,1.5,2,1,0],
	"Land":[1.6,1.5,1.5,1,0],
	"Sea":[1.8,1.7,1.7,1,0],
	"Desktop":[0.5,0.7,0.3,1,0],
	"Laptop":[1,0.5,0.3,1,0],
	"Peripheral":[1.3,0.7,1,1,0],
	"Printer":[0.4,0.8,0.7,1,0],
	"Communication":[0.6,0.4,0.8,1,0],
	"Office Program":[0.3,0.1,0.3,1,0],
	"Video Game":[0.8,0.3,1.2,1,0],
	"Web Application":[0.5,0.2,0.8,1,0],
	"Cleaning":[1.2,0.9,1.3,1,0],
	"Furniture":[0.4,0.7,0.5,1,0],
	"Kitchen":[1.2,0.9,0.3,1,0],
	"Barbecue":[1.1,0.5,0.6,1,0],
	"School":[0.5,0.6,1,1,0],
	"Shoes":[0.3,0.9,0.4,1,0],
	"Musical":[0.2,0.4,0.6,1,0],
	"Key Holder":[0.1,0.2,0.2,1,0]
};
function GameInitialize(){
	var doILoadGame = localStorage.getItem("LoadingAGame");
	if (doILoadGame !== "null"){
		LoadGameInitialize(doILoadGame);
	}
	else{
		NewGameInitialize();
	}
	TheGame.GameState = "ACTIVE";
}
function NewGameInitialize(){
	var GameCreationInfo=JSON.parse(localStorage.getItem("TheBrandNewGame"));
	TheGame=new Game("2947");
	TransferGameStartupInfo(GameCreationInfo,TheGame);
	TheGame.CurrentPlayer=TheGame.Players[TheGame.CurrentPlayerNum];
	TheGame.CurrentPlayerNum=TheGame.CurrentPlayer.Number;
	if (TheGame.Settings.PatentingEnabled==="On"){
		TheGame.PatentTracker = new PatentTracker();
	}
	UpdatePlayerDisplay();
	PopulateNewProdCategories();
	setInterval(function(){TipThink();},10);
	if (TheGame.GameType==="Local"){
		setInterval(function(){SaveThink();},1000);
		localStorage.setItem("LoadingAGame", "LastSavedGame");
	}
	setTimeout(DisplayNewRoundEvent,1);
	$("#MainBoard").hide();
	setTimeout(Appear,750);
	setTimeout(function(){
		TheGame.CurrentPlayer.TurnInit();
	},2000);

}
function LoadGameInitialize(gameName){
	TheGame = CircularJSON.parse(localStorage.getItem("LastSavedGame"));
	if (!TheGame){
		NewGameInitialize();
	}
	else{
		//This code includes logic to recreate each object's particular functions, as even Circular-JSON loses sight of them.
		//Luckily there are only four such lines that are needed.
		Appear();
		SubCategoryAttributes = TheGame.SubCategoryAttributes;
		RandomEvents = TheGame.RandomEvents;
		TheGame.toString = function () { return this.ClassName + " " + this.ID.toString(); };
		for (var q = 0; q < TheGame.Players.length; q++) {
			TheGame.Players[q].toString = function () { return this.ClassName+" "+this.GlobalID+": "+this.Name+", "+this.Type+", "+this.Color; };
			TheGame.Players[q].TurnInit = function () { if (this.Type==="Computer") { VI_Begin(this); } };
			for (var j = 0; j < TheGame.Players[q].Products.length; j++) {
				TheGame.Players[q].Products[j].toString = function () { return this.ClassName+" "+this.GlobalID+": "+this.Name+", "+this.Owner.Name+", "+this.Category+", "+this.SubCategory+", "+this.Color; };
				RecreateProductDisplay(TheGame.Players[q].Products[j]);
			}
		}
		TheGame.CurrentPlayer=TheGame.Players[TheGame.CurrentPlayerNum];
		TheGame.CurrentPlayerNum=TheGame.CurrentPlayer.Number;
		UpdatePlayerDisplay();
		PopulateNewProdCategories();
		for (var i=0; i<TheGame.CurrentPlayer.Products.length; i++){
			$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("z-index",2);
		}
		if (TheGame.Settings.NumberOfRounds-TheGame.CurrentRound <= 5){
			changeCurrentBGM("TimeRunningOut");
		}
		$("#RoundNumberDisplay").text("ROUND " + TheGame.CurrentRound.toString());
		$("#new-product-button").attr("disabled",(TheGame.CurrentPlayer.hasMadeProductThisTurn));
		var Elem=document.getElementById("TipSpan");
		var welcomeBackMessage = "Welcome back to the stage of Entrepreneurship!";
		if (TheGame.CurrentRound >= TheGame.Settings.NumberOfRounds/2){
			welcomeBackMessage = "We missed you.";
		}
		Elem.style.left=BOARD_WIDTH.toString()+"px";
		Elem.innerHTML=welcomeBackMessage;
		setInterval(function(){TipThink();},10);
		if (TheGame.GameType==="Local"){
			setInterval(function(){SaveThink();},1000);
		}
		setTimeout(function(){
			TheGame.CurrentPlayer.TurnInit();
		},1250);
	}
}
function SaveThisGame(gameName){
	TheGame.SubCategoryAttributes = SubCategoryAttributes;
	TheGame.RandomEvents = RandomEvents;
	var saveMe = CircularJSON.stringify(TheGame);
	localStorage.setItem(gameName, saveMe);
}
function TipThink(){
	var Elem=document.getElementById("TipSpan");
	var Pos=parseInt(Elem.style.left.replace("px",""),10);
	var NewPos=Pos-1;
	if(NewPos<=-Elem.innerHTML.length*15){
		NewPos=BOARD_WIDTH+1;
		SelectedTip = Math.floor(Math.random()*Tips.length*0.5*(1+(TheGame.CurrentRound/TheGame.Settings.NumberOfRounds)));
		Elem.innerHTML=Tips[SelectedTip];
	}
	Elem.style.left=(NewPos).toString()+"px";
}
function TransferGameStartupInfo(from,to){
	for(var i=1;i<=6;i++){
		var Ply=from.Players["Ply"+NumberNameTable[i]];
		if(Ply){
			new Player(to,Ply.Name,Ply.Type,Ply.Color);
		}
	}
	to.Settings={};
	to.Settings.Difficulty=from.Options.GameDifficulty;
	to.Settings.CPUIntelligence=from.Options.CPUIntelligence;
	to.Settings.PatentingEnabled=from.Options.PatentingEnabled;
	to.Settings.NumberOfRounds=from.Options.NumberOfRounds;
	to.GameType=from.GameType;
}
function GetDifficultyConstant(difficulty){
	var returnValue = 0;
	
	if (difficulty === "EASY"){
		returnValue = 1;
	}
	else if (difficulty === "NORMAL"){
		returnValue = 2;
	}
	else if (difficulty === "HARD"){
		returnValue = 3;
	}
	else{
		returnValue = 4;
	}
	
	return returnValue;
}
function UpdatePlayerDisplay(){
	var OldCash=parseInt($("#CurPlyMoney").html(), 10);
	var OldName=$("#CurPlyName").html;
	var Ply=TheGame.CurrentPlayer;
	var MainBox=$("#CurPlyBox");
	MainBox.css("border-color",Ply.Color);
	$("#CurPlyName").html(Ply.Name);
	if(Ply.Name.length>15){$("#CurPlyName").title=Ply.Name;}
	$("#CurPlyMoney").html(Ply.Money.toString());
	$("#CurPlyProds").html(Ply.NumProducts.toString());
	$("#CurPlyDsgns").html(Ply.NumCreative.toString());
	$("#CurPlyDevs").html(Ply.NumDevs.toString());
	$("#CurPlyTsts").html(Ply.NumQA.toString());
	setTimeout(VisualCashAlert,100);
}
function PopulateNewProdCategories(){
	var Sel=$("#NewProductCategory");
	for(Item in ProductCategories){
		Sel.append('<option>'+Item+'</option>');
	}
	Sel.selectedIndex=0;
	SelectProductCategory();
}
function SelectProductCategory(){
	var Sel=$("#NewProductCategory");
	var SubSel=$("#NewProductSubCategory");
	SubSel.children().remove();
	var Cat=Sel.val();
	for(var i=0;i<ProductCategories[Cat].length;i++){
		SubSel.append('<option>'+ProductCategories[Cat][i]+'</option>');
	}
	SubSel.selectedIndex=0;
}
function createNewProduct(){
	var nam=$("#NewProdName").val();
	if (nam){
		var prod=Product(TheGame.CurrentPlayer,nam,$("#NewProductCategory option:selected").val(),$("#NewProductSubCategory option:selected").val(),TheGame.CurrentPlayer.Color);
		prod.Phase="Idea";
		CreateProductDisplay(prod);
		hideNewProductDialog();
		playSound(GameSounds.ProductPlacement);
		TheGame.CurrentPlayer.hasMadeProductThisTurn = true;
	}
	else {
		$("#NewProdName").css("background-color", "red");
		setTimeout(function(){
			$("#NewProdName").css("background-color", "white");
		},200);
		playSound(GameSounds.Wrong_Med);
	}
	$("#new-product-button").attr("disabled",(TheGame.CurrentPlayer.hasMadeProductThisTurn));
}
function CreateProductDisplay(prod){
	var GameBoard=document.getElementById("GameBoardCircle");
	var ProdElem=document.createElement("div");
	ProdElem.id="ProductDisplayItem_"+prod.GlobalID;
	prod.DisplayItemID=ProdElem.id;
	ProdElem.addEventListener("click",function(){
		playSound(GameSounds.Message);
		$("#"+ProdElem.id).css("box-shadow", "0px 0px 60px 10px #AAAAAA");
		$("#"+ProdElem.id).css("opacity", "1");
		UpdateCurProdDisplay(ProdElem.id);
		setTimeout(function(){
			$("#"+ProdElem.id).css("box-shadow", "4px 4px 15px -2px #000000");
			$("#"+ProdElem.id).css("opacity", "0.8");
		},200);
	});
	ProdElem.className="ProductDisplayItem";
	ProdElem.style.backgroundImage="url('../images/ProductIcons/"+prod.Category.toLowerCase()+"_"+prod.SubCategory.toLowerCase()+".png')";
	ProdElem.style.left="0px";
	ProdElem.style.top="0px";
	ProdElem.style.zIndex="2";
	ProdElem.style.borderStyle="outset";
	ProdElem.style.borderColor=PlayerColors[prod.Color];
	ProdElem.style.backgroundColor=prod.Color;
	ProdElem.style.webkitTransform="rotate("+(-Rotation).toString()+"deg)";
	ProdElem.style.MozTransform="rotate("+(-Rotation).toString()+"deg)";
	GameBoard.appendChild(ProdElem);
	UpdateProductListDisplayPosition(GetProductsInSamePhase(prod));
	UpdatePlayerDisplay();
	UpdateCurProdDisplay(ProdElem.id);
}
function RecreateProductDisplay(prod){
	var GameBoard=document.getElementById("GameBoardCircle");
	var ProdElem=document.createElement("div");
	ProdElem.id="ProductDisplayItem_"+prod.GlobalID;
	prod.DisplayItemID=ProdElem.id;
	ProdElem.addEventListener("click",function(){
		playSound(GameSounds.Message);
		$("#"+ProdElem.id).css("box-shadow", "0px 0px 60px 10px #AAAAAA");
		$("#"+ProdElem.id).css("opacity", "1");
		UpdateCurProdDisplay(ProdElem.id);
		setTimeout(function(){
			$("#"+ProdElem.id).css("box-shadow", "4px 4px 15px -2px #000000");
			$("#"+ProdElem.id).css("opacity", "0.8");
		},200);
	});
	ProdElem.className="ProductDisplayItem";
	ProdElem.style.backgroundImage="url('../images/ProductIcons/"+prod.Category.toLowerCase()+"_"+prod.SubCategory.toLowerCase()+".png')";
	ProdElem.style.left="0px";
	ProdElem.style.top="0px";
	ProdElem.style.zIndex="1";
	ProdElem.style.borderStyle="outset";
	ProdElem.style.borderColor=PlayerColors[prod.Color];
	ProdElem.style.backgroundColor=prod.Color;
	ProdElem.style.webkitTransform="rotate("+(-Rotation).toString()+"deg)";
	ProdElem.style.MozTransform="rotate("+(-Rotation).toString()+"deg)";
	GameBoard.appendChild(ProdElem);
	UpdateProductListDisplayPosition(GetProductsInSamePhase(prod));
}
//Removes the product passed through the parameter
function removeProduct(prod){
	if (prod) {
		playSound(GameSounds.LoseMoney);
		$("#ProductWindow").hide();
		if (isThisProductPatented(prod, TheGame)){
			removePatentFromRecords(prod, TheGame);
		}
		if (prod === CurrentlySelectedProduct){
			CurrentlySelectedProduct = null;
		}
		$("#ProductDisplayItem_"+prod.GlobalID).css('opacity', '0');
		$("#ProductDisplayItem_"+prod.GlobalID).css('transition', '500ms ease-out');
		setTimeout(function(){
			$("div").remove("#ProductDisplayItem_"+prod.GlobalID);
		},500);
		if (prod.justStarted){
			TheGame.CurrentPlayer.hasMadeProductThisTurn = false;
		}
		prod.Owner.Products.splice(prod.Owner.Products.indexOf(prod), 1);
		TheGame.Players[TheGame.CurrentPlayerNum].NumProducts = TheGame.Players[TheGame.CurrentPlayerNum].Products.length;
		UpdatePlayerProductDisplayPosition(prod.Owner);
		UpdatePlayerDisplay();
	}
	$("#new-product-button").attr("disabled",(TheGame.CurrentPlayer.hasMadeProductThisTurn));
}
//Takes a series of products and removes them in succession
function removeMultipleProducts(HitList) {
	ProductsBeingRemoved=true;
	if (HitList.length > 1) {
		removeProduct(HitList[0]);
		HitList.splice(0,1);
		setTimeout(function(){
			removeMultipleProducts(HitList);
		}, 400);
	}
	else {
		removeProduct(HitList[0]);
		ProductsBeingRemoved=false;
	}
}

function GetProductsInSamePhase(prod){
	var ProdsInSameSpot = [];
	
	for (i = 0; i < prod.Owner.Products.length; i++){
		if (prod.Owner.Products[i].Phase === prod.Phase){
			ProdsInSameSpot.push(prod.Owner.Products[i]);
		}
	}
	
	return ProdsInSameSpot;
}

function GetProductsInThisPhase(ThisPhase, Ply){
	var ProdsInSameSpot = [];
	
	for (j = 0; j < Ply.Products.length; j++){
		if (Ply.Products[j].Phase === ThisPhase){
			ProdsInSameSpot.push(Ply.Products[j]);
		}
	}
	
	return ProdsInSameSpot;
}

function UpdatePlayerProductDisplayPosition(Ply){
	var ProductPhaseArray = [];
	for (i = 0; i < Ply.Products.length; i++){
		if (ProductPhaseArray.indexOf(Ply.Products[i].Phase) <= -1) {
			ProductPhaseArray.push(Ply.Products[i].Phase);
		}
	}
	for (i = 0; i < ProductPhaseArray.length; i++){
		UpdateProductListDisplayPosition(GetProductsInThisPhase(ProductPhaseArray[i], Ply));
	}
}

function UpdateProductListDisplayPosition(ProdList){
	var angularIncrement = 2*(Math.PI)/(ProdList.length);
	var Magnitude = 25*Math.log(ProdList.length)/Math.log(3);
	var scalar = Math.pow(Math.E, -((ProdList.length - 1)*0.1)).toString();
	
	for (i = 0; i < ProdList.length; i++){
		TheProd = ProdList[i];
		XOffset = Math.cos(angularIncrement*i);
		YOffset = Math.sin(angularIncrement*i);
		XPos = PhasePositions[TheProd.Phase][0]+XOffset*Magnitude;
		YPos = PhasePositions[TheProd.Phase][1]+YOffset*Magnitude;
		Rotation = Math.atan2(-XPos+PhasePositions.Maintenance[0], YPos-PhasePositions.Maintenance[1])-Math.PI*Number((TheProd.Phase!=="Maintenance") || (ProdList.length>1));
		
		var ProdElem=$("#"+"ProductDisplayItem_"+TheProd.GlobalID);
		ProdElem.css("left",(XPos.toString()+"px"));
		ProdElem.css("top",(YPos.toString()+"px"));
		ProdElem.css({ 'webkit-transform': 'scale('+scalar+','+scalar+') rotate('+ Rotation.toString() +'rad)'});
		ProdElem.css({ 'transform': 'scale('+scalar+','+scalar+') rotate('+Rotation.toString()+'rad)'});
	}	
}

function EmployeeChange(type,num){
	
	var designers = parseInt($("#EmpPopupDes").text(), 10);
	var developers = parseInt($("#EmpPopupDev").text(), 10);
	var testers = parseInt($("#EmpPopupTes").text(), 10);
	
	if (type==="des"){
		if (num+designers>=0 && num+designers<=100){
			$("#EmpPopupDes").text((num+designers).toString());
		}
	}else if(type==="dev"){
		if (num+developers>=0 && num+developers<=100){
			$("#EmpPopupDev").text((num+developers).toString());
		}
	}else if(type==="tes"){
		if (num+testers>=0 && num+testers<=100){
			$("#EmpPopupTes").text((num+testers).toString());
		}
	}
}
function InitiateEmpPopupDisplays(){
	var ply=TheGame.CurrentPlayer;
	$("#EmpPopupDev").text(ply.NumDevs.toString());
	$("#EmpPopupDes").text(ply.NumCreative.toString());
	$("#EmpPopupTes").text(ply.NumQA.toString());
}
function HireTheEmployees(){
	var ply = TheGame.CurrentPlayer;
	var designers = parseInt($("#EmpPopupDes").text(), 10);
	var developers = parseInt($("#EmpPopupDev").text(), 10);
	var testers = parseInt($("#EmpPopupTes").text(), 10);
	
	if (designers > ply.NumCreative){
		ply.Money-=(designers-ply.NumCreative)*BaseCosts.HireCreative;
	}
	if (developers > ply.NumDevs){
		ply.Money-=(developers-ply.NumDevs)*BaseCosts.HireDev;
	}
	if (testers > ply.NumQA){
		ply.Money-=(testers-ply.NumQA)*BaseCosts.HireQA;
	}
		
	ply.NumCreative=designers;
	ply.NumDevs=developers;
	ply.NumQA=testers;
	
	UpdatePlayerDisplay();
}
function UpdateCurProdDisplay(id){
	if(id){
		var Prod=GetProdFromDispElemID(id);
		CurrentlySelectedProduct=Prod;
		$("#ProductWindow").show();
		$("#ProductWindow").css("border-color",Prod.Owner.Color);
		if(Prod.OwnerNumber===TheGame.CurrentPlayerNum){
			$("#CurProdDetailsButton").prop("disabled",false);
			$("#CurProdRevertButton").prop("disabled",false);
			var CurPhase=CurrentlySelectedProduct.Phase;
			if ((CurPhase === ProductPhases.Maintenance) || ((CurPhase === ProductPhases.Prototype && !(Prod.hasPrototype))||(CurPhase === ProductPhases.Deployment && !(Prod.readyToDeploy)))){
				$("#CurProdAdvanceButton").prop("disabled",true);
			}
			else{
				$("#CurProdAdvanceButton").prop("disabled",false);
			}
			if (CurPhase === ProductPhases.Idea){
				$("#CurProdRevertButton").text("Remove");
			}
			else{
				$("#CurProdRevertButton").text("Regress");
			}
			if (TheGame.PatentTracker){
				if (isThisCategoryPatented(Prod, TheGame) && isThisProductPatented(Prod, TheGame)){
					$("#CurProdPatentButton").text("Patented!");
					$("#CurProdPatentButton").prop("disabled",true);
				}
				else {
					$("#CurProdPatentButton").text("Patent");
					$("#CurProdPatentButton").prop("disabled",false);
				}
			}
			else{
				$("#CurProdPatentButton").hide();
			}
		}
		else{
			$("#CurProdAdvanceButton").prop("disabled",true);
			$("#CurProdRevertButton").prop("disabled",true);
			$("#CurProdDetailsButton").prop("disabled",true);
			$("#CurProdPatentButton").prop("disabled",true);
		}
		document.getElementById("ProdDisplayName").innerHTML=Prod.Name;
		document.getElementById("ProdOwnerDisplayName").innerHTML=Prod.Owner.Name;
		document.getElementById("DisplayCAT").innerHTML=Prod.Category;
		document.getElementById("DisplaySUBCAT").innerHTML=Prod.SubCategory;
		var productScore = Math.round(getMonetaryValue(Prod)*TotalPayoutRate*(1.4-0.2*(GetDifficultyConstant(TheGame.Settings.Difficulty))));
		var rating = productScore.toString();
		document.getElementById("DisplayOVLS").innerHTML="$"+rating.toString();
	}
}
function PopulateDetails(id){
	if(id){
		var Prod=GetProdFromDispElemID(id);
		CurrentlySelectedProduct=Prod;
		$("#DetailsDialog").css("border-color",Prod.Owner.Color);
		
		$("#DetailsProd").text(Prod.Name);
		$("#DetailsCAT").text(Prod.Category);
		$("#DetailsSUBCAT").text(Prod.SubCategory);
		$("#DetailsPIS").text(Prod.IdeaStrength.toString());
		$("#DetailsPDS").text(Prod.DesignStrength.toString());
		$("#DetailsPBS").text(Prod.BuildStrength.toString());
		$("#DetailsTSS").text(Math.round(Prod.TestingStrength).toString());
		$("#DetailsCOS").text((Math.round((1-Prod.Volatility)*100)).toString()+"%");
		if (Prod.hasPrototype){
			$("#DetailsHPT").text("Yes");
		}
		else{
			$("#DetailsHPT").text("No");
		}
		if (Prod.readyToDeploy){
			$("#DetailsDPR").text("Yes");
		}
		else{
			$("#DetailsDPR").text("No");
		}
	}
}
function GetProdFromDispElemID(id){
	var NewID=id.replace("ProductDisplayItem_","");
	NewID=parseInt(NewID, 10);
	var Prod=TheGame.PlayerProducts[NewID];
	return Prod;
}
function TryToAdvanceProduct(){
	var CurPhase=CurrentlySelectedProduct.Phase;
	if(CurPhase!==ProductPhases.Maintenance){
		playSound(GameSounds.AdvanceProduct);
	}
	if(CurPhase===ProductPhases.Idea){
		CurrentlySelectedProduct.Phase=ProductPhases.Design;
	}else if(CurPhase===ProductPhases.Design){
		CurrentlySelectedProduct.Phase=ProductPhases.Prototype;
	}else if(CurPhase===ProductPhases.Prototype){
		TheGame.CurrentPlayer.Money=TheGame.CurrentPlayer.Money-BaseCosts.Prototype*SubCategoryAttributes[CurrentlySelectedProduct.SubCategory][1];
		CurrentlySelectedProduct.Phase=ProductPhases.PrototypeTesting;
	}else if(CurPhase===ProductPhases.PrototypeTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Development;
	}else if(CurPhase===ProductPhases.Development){
		CurrentlySelectedProduct.Phase=ProductPhases.PreDepTesting;
	}else if(CurPhase===ProductPhases.PreDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Deployment;
	}else if(CurPhase===ProductPhases.Deployment){
		TheGame.CurrentPlayer.Money=TheGame.CurrentPlayer.Money-BaseCosts.Deployment;
		CurrentlySelectedProduct.Phase=ProductPhases.PostDepTesting;
	}else if(CurPhase===ProductPhases.PostDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Maintenance;
	}else if(CurPhase===ProductPhases.Maintenance){
		playSound(GameSounds.Wrong_Low);
	}
	
	//This if-block is for patenting reasons.
	if (CurrentlySelectedProduct.isANewProduct && CurrentlySelectedProduct.Phase===ProductPhases.Maintenance){
		CurrentlySelectedProduct.isANewProduct = false;
	}
	
	UpdateProductListDisplayPosition(GetProductsInSamePhase(CurrentlySelectedProduct));
	UpdateProductListDisplayPosition(GetProductsInThisPhase(CurPhase,CurrentlySelectedProduct.Owner));
	UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	UpdatePlayerDisplay();
}
function TryToRevertProduct(){
	var CurPhase=CurrentlySelectedProduct.Phase;
	var removeCheck = false;
	if(CurPhase!==ProductPhases.Idea){playSound(GameSounds.MinorFail);}
	if(CurPhase===ProductPhases.Idea){
		ShowRemoveDialog();
		removeCheck = true;
	}else if(CurPhase===ProductPhases.Design){
		CurrentlySelectedProduct.Phase=ProductPhases.Idea;
		CurrentlySelectedProduct.DesignStrength=0;
	}else if(CurPhase===ProductPhases.Prototype){
		CurrentlySelectedProduct.Phase=ProductPhases.Design;
	}else if(CurPhase===ProductPhases.PrototypeTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Prototype;
	}else if(CurPhase===ProductPhases.Development){
		CurrentlySelectedProduct.Phase=ProductPhases.PrototypeTesting;
		CurrentlySelectedProduct.BuildStrength=0;
	}else if(CurPhase===ProductPhases.PreDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Development;
	}else if(CurPhase===ProductPhases.Deployment){
		CurrentlySelectedProduct.Phase=ProductPhases.PreDepTesting;
		TheGame.CurrentPlayer.Money=TheGame.CurrentPlayer.Money-BaseCosts.Deployment/2;
	}else if(CurPhase===ProductPhases.PostDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Deployment;
		TheGame.CurrentPlayer.Money=TheGame.CurrentPlayer.Money-BaseCosts.Deployment/2;
	}else if(CurPhase===ProductPhases.Maintenance){
		CurrentlySelectedProduct.Phase=ProductPhases.PostDepTesting;
	}
	if (!removeCheck){
		UpdateProductListDisplayPosition(GetProductsInSamePhase(CurrentlySelectedProduct));
		UpdateProductListDisplayPosition(GetProductsInThisPhase(CurPhase,CurrentlySelectedProduct.Owner));
		UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
		UpdatePlayerDisplay();
	}
}
function VisualCashAlert(){
	var Ply=TheGame.CurrentPlayer;
	var Amt=Ply.Money-Ply.LastDisplayedMoney;
	var theNumber = NumberNameTable[TheGame.CurrentPlayerNum+1];
	if(!ShowCashAlert){return;}
	if(Amt===0){return;}
	var Elem=$("#Cash"+theNumber);
	var Str="";
	var Col="";
	if(Amt<0){
		Col="red";
		Str="-$";
		playSound(GameSounds.LoseMoney);
	}else{
		Col="cyan";
		Str="+$";
		playSound(GameSounds.GainMoney);
	}
	Str=Str+Amt.toString().replace("-","");
	ResetCashDisplayPos(theNumber);
	Elem.html(Str);
	Elem.css("color",Col);
	Elem.css("visibility","visible");
	Elem.css("transition","top 1s ease-in,opacity 1s ease-in");
	Elem.css("top","4%");
	Elem.css("opacity","0");
	setTimeout(function(){
		ResetCashDisplayPos(theNumber);
	},1000);
	Ply.LastDisplayedMoney=Ply.Money;
}
function ResetCashDisplayPos(num){
	var Elem=$("#Cash"+num);
	Elem.css("transition","none");
	Elem.css("top","9%");
	Elem.css("opacity","1");
	Elem.css("visibility","hidden");
}
function PopulateScoreboard(){
	for(PlyNum in TheGame.Players){
		var Ply=TheGame.Players[PlyNum];
		var Str="";
		if(PlyNum===0){Str="PlyOne";}else if(PlyNum===1){Str="PlyTwo";}else if(PlyNum===2){Str="PlyThree";}else if(PlyNum===3){Str="PlyFour";}else if(PlyNum===4){Str="PlyFive";}else if(PlyNum===5){Str="PlySix";}
		$("#"+Str+"ScbdBox").show();
		$("#"+Str+"ScbdBox").css("border-color",Ply.Color);
		$("#"+Str+"ScbdName").html(Ply.Name);
		$("#"+Str+"ScbdMoney").html(Ply.Money);
		$("#"+Str+"ScbdProds").html(Ply.NumProducts);
		$("#"+Str+"ScbdEmps").html(Ply.NumQA+Ply.NumDevs+Ply.NumCreative);
	}
}
function CycleTurn(){
	TheGame.CurrentPlayer.hasMadeProductThisTurn = false;
	$("#new-product-button").attr("disabled",(TheGame.CurrentPlayer.hasMadeProductThisTurn));
	$(".ProductDisplayItem").css("z-index",1);
	if(TheGame.NumPlayers>1){
		var WillGo=false;
		var NewPlyNum=TheGame.CurrentPlayerNum+1;
		if(NewPlyNum>(TheGame.NumPlayers-1)){
			NewPlyNum=0;
			WillGo=true;
		}
		TheGame.CurrentPlayerNum=NewPlyNum;
		TheGame.CurrentPlayer=TheGame.Players[TheGame.CurrentPlayerNum];
		$("#CurProdAdvanceButton").prop("disabled",true);
		$("#CurProdRevertButton").prop("disabled",true);
		if(CurrentlySelectedProduct){
			UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayElemID);
		}
		if(WillGo){
			DisplayNewRoundEvent();
		}else{
			if (TheGame.CurrentPlayer.Type==="Computer"){
				$("#ControlLock").show();
			}
			else{
				$("#ControlLock").hide();
			}
			TriggeredEventIterator(TheGame.CurrentPlayer.TriggeredEvents);
			for (i=0; i<TheGame.CurrentPlayer.Products.length; i++){
				$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("z-index",2);
			}
			playSound(GameSounds.NextTurn);
			$("#ProductWindow").hide();
			UpdatePlayerDisplay();
		}
	}
	else{
		DisplayNewRoundEvent();
	}
	setTimeout(function(){
		TheGame.CurrentPlayer.TurnInit();
	},1250);
}
function DisplayNewRoundEvent(){
	$("#ControlLock").hide();
	var Num=TheGame.CurrentRound+1;
	$('.Standard').attr("disabled", true);
	if(Num<=TheGame.Settings.NumberOfRounds){
		if (TheGame.Settings.NumberOfRounds-Num <= 5){
			changeCurrentBGM("TimeRunningOut");
		}
		var Elem=document.getElementById("MainBoard");
		Elem.style.transition="left .75s ease-out";
		Elem.style.left="800px";
		Elem=document.getElementById("RoundAnnouncer");
		Elem.innerHTML="ROUND<br>"+Num;
		Elem.style.transition="top .9s ease-out";
		Elem.style.top="100px";
		playSound(GameSounds.NextRound);
		setTimeout(function(){
			var Elem=document.getElementById("MainBoard");
			Elem.style.transition="none";
			Elem.style.left="-800px";
			setTimeout(function(){
				var Elem=document.getElementById("MainBoard");
				Elem.style.transition="left .65s ease-out";
				Elem.style.left="0px";
				Elem=document.getElementById("RoundAnnouncer");
				Elem.style.transition="top .5s ease-out";
				Elem.style.top="600px";
				for (i=0; i<TheGame.CurrentPlayer.Products.length; i++){
					$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("z-index",2);
				}
				$("#ProductWindow").hide();
				$("#RoundNumberDisplay").text("ROUND " + Num.toString());
				CurrentlySelectedProduct=null;
				setTimeout(function(){
					var Elem=document.getElementById("MainBoard");
					Elem.style.transition="none";
					Elem=document.getElementById("RoundAnnouncer");
					Elem.style.transition="none";
					Elem.style.top="-600px";
					$('.Standard').attr("disabled", false);
					NewRoundCalc();
				},650);
			},750);
		},650);
	}
	else{
		FinishGame();
	}
}
function NewRoundCalc(){
	RandomEventSelector();
	DecrementCategoryChanges();
	for(var i=0;i<TheGame.Players.length;i++){
		var Ply=TheGame.Players[i];
		if(Ply.NumProducts>0){
			for(var j=0;j<Ply.Products.length;j++){
				var Prod=Ply.Products[j];
				if (Prod.Phase !== Prod.PhaseAtStartOfTurn){
					Prod.turnsInSamePhase=0;
				}
				Prod.PhaseAtStartOfTurn = Prod.Phase;
				Prod.turnsInSamePhase++;
				if(Prod.justStarted){
					Prod.justStarted = false;
				}
				var numOnSameSpot = 0;
				for (k = 0; k<Ply.Products.length; k++){
					if (Prod.Phase === Ply.Products[k].Phase){
						numOnSameSpot++;
					}
				}
				if(Prod.Phase===ProductPhases.Idea){
					Prod.IdeaStrength=Prod.IdeaStrength+Math.ceil(SubCategoryAttributes[Prod.SubCategory][2]*60*(1.4-0.2*(GetDifficultyConstant(TheGame.Settings.Difficulty)))/(numOnSameSpot+Prod.turnsInSamePhase));
					MoveItSoon(Ply, Prod);
				}else if(Prod.Phase===ProductPhases.Design){
					EmployeeReductionCheck("des", Ply, Prod);
					Prod.DesignStrength=Prod.DesignStrength+Math.ceil(20*Ply.NumCreative*(Math.log(3)/Math.log(3+Ply.NumCreative))/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase===ProductPhases.Prototype){
					Prod.hasPrototype=true;
				}else if(Prod.Phase===ProductPhases.PrototypeTesting){
					EmployeeReductionCheck("tes", Ply, Prod);
					Prod.DesignStrength=Prod.DesignStrength+Math.ceil(Ply.NumQA*12*(Math.log(3)/Math.log(3+Ply.NumQA))/(numOnSameSpot+Prod.turnsInSamePhase));
					Prod.TestingStrength+=(Prod.DesignStrength*0.1*Ply.NumQA*(Math.log(3)/Math.log(3+Ply.NumQA))/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase===ProductPhases.Development){
					EmployeeReductionCheck("dev", Ply, Prod);
					Prod.BuildStrength=Prod.BuildStrength+Math.ceil(20*Ply.NumDevs*(Math.log(3)/Math.log(3+Ply.NumDevs))/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase===ProductPhases.PreDepTesting){
					EmployeeReductionCheck("tes", Ply, Prod);
					Prod.BuildStrength=Prod.BuildStrength+Math.ceil(Ply.NumQA*12*(Math.log(3)/Math.log(3+Ply.NumCreative))/(numOnSameSpot+Prod.turnsInSamePhase));
					Prod.TestingStrength+=(Prod.BuildStrength*0.1*Ply.NumQA*(Math.log(3)/Math.log(3+Ply.NumCreative))/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase===ProductPhases.Deployment){
					Prod.readyToDeploy=true;
				}else if(Prod.Phase===ProductPhases.PostDepTesting){
					EmployeeReductionCheck("tes", Ply, Prod);
					Prod.TestingStrength+=Math.ceil(0.05*(Prod.DesignStrength+Prod.BuildStrength)*Ply.NumQA*(Math.log(3)/Math.log(3+Ply.NumCreative))/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase===ProductPhases.Maintenance){
					var Broken = DoesItBreak(Prod);
					if (Broken>0){
						var Damages = Math.ceil((BaseCosts.PostDepBugCost)+getMonetaryValue(Prod)*Broken);
						Ply.Money=Ply.Money-Damages;
						IsItSoBadItGetsRemoved(Ply, Prod, Damages);
						Prod.TestingStrength+=(Prod.DesignStrength+Prod.BuildStrength);
					}
				}
				Prod.Volatility = 1/(1+0.1*Prod.TestingStrength*(1.4-0.2*(GetDifficultyConstant(TheGame.Settings.Difficulty))));
			}
		}
	}
	for(var i=0;i<TheGame.Players.length;i++){
		var Ply=TheGame.Players[i];
		var Net=0;
		if(Ply.NumProducts<1){
			Net=Math.round(BasePayouts.DayJobEachTurn*TotalPayoutRate*(1.4-0.2*(GetDifficultyConstant(TheGame.Settings.Difficulty))));
		}else{
			for(var j=0;j<Ply.Products.length;j++){
				var Prod=Ply.Products[j];
				if(Prod.Phase===ProductPhases.Maintenance && (SubCategoryAttributes[Prod.SubCategory][4] <= 0)){
					var earnings = Math.round(getMonetaryValue(Prod)*SubCategoryAttributes[Prod.SubCategory][3]*TotalPayoutRate*(1.4-0.2*(GetDifficultyConstant(TheGame.Settings.Difficulty))));
					if (TheGame.PatentTracker){
						patentOwnerID = doIPayRoyalties(Prod, TheGame.PatentTracker);
						if (patentOwnerID !== -1)
						{
							cashOwed = Math.round(earnings/10);
							earnings -= cashOwed;
							TheGame.Players[patentOwnerID].Money += cashOwed;
						}
					}
					Net+=earnings;
				}
			}
		}
		Net=Net-((BaseCosts.PayDev*Ply.NumDevs)+(BaseCosts.PayQA*Ply.NumQA)+(BaseCosts.PayCreative*Ply.NumCreative));
		Ply.Money=Ply.Money+Net;
	}
	TheGame.CurrentRound=TheGame.CurrentRound+1;
	if (TheGame.CurrentPlayer.Type==="Computer"){
		$("#ControlLock").show();
	}
	else {
		$("#ControlLock").hide();
	}
	RandomEventIterator();
	UpdatePlayerDisplay();
	if(CurrentlySelectedProduct){
		UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	}
}
function DecrementCategoryChanges(){
	for (SubCat in SubCategoryAttributes){
		if (SubCategoryAttributes[SubCat][3] === 0){
			SubCategoryAttributes[SubCat][3] = 0.1;
		}
		else{
			if (SubCategoryAttributes[SubCat][3] > 1){
				SubCategoryAttributes[SubCat][3] -= 0.1;
			}
			else if (SubCategoryAttributes[SubCat][3]*10 < 1){
				SubCategoryAttributes[SubCat][3] += 0.1;
			}
			SubCategoryAttributes[SubCat][3] = Math.round(SubCategoryAttributes[SubCat][3]*10)/10;
		}
		if (SubCategoryAttributes[SubCat][4] > 0){
			SubCategoryAttributes[SubCat][4]--;
		}
	}
	if (Math.round(TotalPayoutRate*10)/10 > 1){
		TotalPayoutRate -= 0.1;
	}
	else if (Math.round(TotalPayoutRate*10)/10 < 1){
		TotalPayoutRate += 0.1;
	}
}
function Appear(){
	$("#MainBoard").show();
	ShowCashAlert=true;
}

function PatentTracker(){
	var newPatentTracker = {};
	newPatentTracker.ClassName = "PATENTTRACKER";
	newPatentTracker.Categories = [];
	newPatentTracker.numPatents = 0;
	
	for(Item in ProductCategories){
		for (SubItem in ProductCategories[Item]){
			newPatentTracker.Categories.push(ProductCategories[Item][SubItem]);
		}
	}
	newPatentTracker.Records = [];
	
	for (Item in newPatentTracker.Categories) {
		newPatentTracker.Records.push([newPatentTracker.Categories[Item], null, null]);
	}
	
	return newPatentTracker;
}

function TryToBuyPatent(product, game)
{
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
		}
		else{
			patentMessage = "Player " + (patentOwner+1).toString() + ": " + game.Players[patentOwner].Name + " already has the patent for " + product.SubCategory + " products!";
		}
	}
	else if (!inPatentableCategory) {
		patentMessage = product.SubCategory + "-type products cannot be patented!";
	}
	else if (!preMaintenance) {
		patentMessage = "This product has already been on the market!";
	}
	else if (!wellBuiltEnough) {
		patentMessage = "Your product isn't impressive enough just yet!";
	}
	else if (!hasTheMoney) {
		patentMessage = "You are $" + (cost - game.CurrentPlayer.Money).toString() + " short!";
	}
	else {
		game.CurrentPlayer.Money -= cost;
		game.PatentTracker.Records[categoryIndex][1] = game.CurrentPlayer.GlobalID;
		game.PatentTracker.Records[categoryIndex][2] = product.GlobalID;
		game.PatentTracker.numPatents++;
		UpdatePlayerDisplay();
		UpdateCurProdDisplay(product.DisplayItemID);
	}
	
	return patentMessage;
}

function isThisCategoryPatented(prod, game){
	return (game.PatentTracker.Records[(game.PatentTracker.Categories.indexOf(prod.SubCategory))][1] !== null);
}
function isThisProductPatented(prod, game){
	return game.PatentTracker.Records[(game.PatentTracker.Categories.indexOf(prod.SubCategory))][2] === prod.GlobalID;
}
function removePatentFromRecords(product, game){
	var categoryIndex = game.PatentTracker.Categories.indexOf(product.SubCategory);
	game.PatentTracker.Records[categoryIndex][1] = null;
	game.PatentTracker.Records[categoryIndex][2] = null;
}

function PatentMessageDisplay(theMessage){
	UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	
	$("#PatentText").text(theMessage);
	var theSound = GameSounds.Event;
	
	if (theMessage.indexOf("successfully") > -1){
		$("#PatentTitle").text("SUCCESS!");
	}
	else{
		$("#PatentTitle").text("FAILURE!");
		theSound = GameSounds.Wrong_BAD;
	}
	
	if (theMessage.indexOf("successfully") > -1){
		$("#PatentTip").text("Now you earn revenue off of other players with the same type of product!");
		$("#PatentTip").show();
	}
	else if (theMessage.indexOf("impressive") > -1){
		$("#PatentTip").text("Try further building the product's Idea, Design, or Build strength. Having a great and well-thought idea is key to a good innovation.");
		$("#PatentTip").show();
	}
	else if (theMessage.indexOf("already") > -1){
		$("#PatentTip").text("Try innovating with a different type of product instead!");
		$("#PatentTip").show();
	}
	else{
		$("#PatentTip").hide();
	}
	playSound(theSound);
}

function doIPayRoyalties(product, patentTracker)
{
	var patentOwnerID = -1;
	var index = patentTracker.Categories.indexOf(product.SubCategory);
	
	if ((product.Owner.GlobalID !== patentTracker.Records[index][1]) && patentTracker.Records[index][1]) {
		patentOwnerID = patentTracker.Records[index][1];
	}
	
	return patentOwnerID;
}

function RandomEventSelector(){
	var IterateThroughThese = [];
	var difficultyOffset = 2;
	if (TheGame.Settings.Difficulty==="EASY"){
		difficultyOffset = 5;
	}
	else if (TheGame.Settings.Difficulty==="HARD"){
		difficultyOffset = -2;
	}
	else if (TheGame.Settings.Difficulty==="LUNATIC"){
		difficultyOffset = -5;
	}
	for (j = 0; j < (Math.log(TheGame.CurrentRound+6)/Math.log(10)); j++)
	{
		var theValue = Math.floor(Math.random()*11-5) + difficultyOffset;
		for (i=0; i < RandomEvents.length; i++){
			if (RandomEvents[i][9] > 0){
				RandomEvents[i][9] = RandomEvents[i][9] - 1;
			}
			if (theValue === RandomEvents[i][3]) {
				if (IterateThroughThese.indexOf(RandomEvents[i]) < 0) {
					if ((RandomEvents[i][9] <= 0) && (RandomEvents[i][7] >= Math.random())){
						IterateThroughThese.push(RandomEvents[i]);
						RandomEvents[i][9] = RandomEvents[i][8];
					}
				}
			}
		}
	}
	RandomEventsToIterate = IterateThroughThese;
}

//This function will iterate through each random event pulled by the game.
//It will be called recursively.

function RandomEventIterator(){
	if (RandomEventsToIterate.length > 0)
	{
		playSound(GameSounds.Event);
		EventFlash();
		var Event=RandomEventsToIterate[0];
		var Msg=Event[0];
		var Desc=Event[1]+" ";
		var AreaOfEffect=Event[2];
		var Action=Event[4];
		var Value=Event[5];
		var Target;
		
		if (AreaOfEffect==="OnePlayer"){
			Target=TheGame.Players[Math.floor(Math.random()*TheGame.Players.length)];
		}
		else{
			Target=TheGame.Players;
		}
		
		if (Action==="CashChange") {
			if (Array.isArray(Target)) {
				Desc+="All players receive $" + Value.toString() + "!";
				for (i = 0; i < Target.length; i++) {
					Target[i].Money+=Value;
				}
			}
			else{
				Desc+="Player " + (Target.Name) + " receives $" + Value.toString() + "!";
				Target.Money+=Value;
			}
		}
		else if (Action.indexOf("PayoutRateChange") > -1) {
			if (Value < 1){
				Desc+="Revenue is reduced to " + Math.round(Value*100) + "%";
			}
			else{
				Desc+="Revenue is " + Math.round((Value-1)*100) + "% more than normal";
			}
			if (Action.indexOf("_All") > -1) {
				Desc+=" all around!";
				TotalPayoutRate = Value;
			}
			else {
				var effectedSubCat = Action.substring(17,Action.length);
				SubCategoryAttributes[effectedSubCat][3] = Value;
				Desc+=" for all " + effectedSubCat + " products!";
			}
		}
		else if (Action.indexOf("CategoryShutdown") > -1) {
			Desc+="All ";
			if (Action.indexOf("SubCategoryShutdown") > -1){
				var effectedSubCat = Action.substring(20,Action.length);
				SubCategoryAttributes[effectedSubCat][4] = Value;
				Desc+=effectedSubCat + " products stop generating revenue for the next ";
			}
			else {
				var effectedCat = Action.substring(17,Action.length);
				for (i = 0; i < ProductCategories[effectedCat].length; i++){
					SubCategoryAttributes[ProductCategories[effectedCat][i]][4] = Value;
				}
				Desc+=effectedCat + " products stop generating revenue for the next ";
			}
			if (Value > 1){
				Desc+=Value.toString() + " turns!";
			}
			else{
				Desc+=" turn!";
			}
		}
		else if (Action === "AssetDestruction") {
			var toBeRemoved = [];
			if (Array.isArray(Target)) {
				for (i = 0; i < Target.length; i++) {
					var numProd = 0;
					var tries = 0;
					if (Target[i].Products.length > 0) {
						for (i = 0; (numProd<Value && numProd<Target.Products.length && (tries<2*Value)); i++) {
							i=(i%(Target.Products.length));
							if (i === 0){
								tries++;
							}
							if ((Math.random()*2*tries)>1.5){
								numProd++;
								toBeRemoved.push(Target.Products[i]);
							}
						}
					}
				}
				Desc+="All players have lost up to " + Value.toString() + " product";
				if (Value !== 1){
					Desc+= "s";
				}
				Desc+="!";
			}
			else {
				var numProd = 0;
				var tries = 0;
				if (Target.Products.length > 0) {
					for (i = 0; (numProd<Value && numProd<Target.Products.length && (tries<2*Value)); i++) {
						i=(i%(Target.Products.length));
						if (i === 0){
							tries++;
						}
						if ((Math.random()*2*tries)>1.5){
							numProd++;
							toBeRemoved.push(Target.Products[i]);
						}
					}
				}
				if (numProd > 1){
					Desc+="Player " + Target.Name + " has lost " + numProd.toString() + " products!";
				}
				else if (numProd > 0){
					Desc+="Player " + Target.Name + " has lost a product!";
				}
				else{
					Desc+="Player " + Target.Name + " luckily did not lose anything!";
				}
			}
			if (toBeRemoved.length > 0){
				removeMultipleProducts(toBeRemoved);
			}
		}
		$("#EventTitle").text(Msg);
		$("#EventDesc").text(Desc);
		$("#EventImage").attr('src',"../images/events/event_" + Event[6] + ".png");
		ShowEventDialog();
		RandomEventsToIterate.splice(0,1);
		UpdatePlayerDisplay();
	}
	else{
		TriggeredEventIterator(TheGame.CurrentPlayer.TriggeredEvents);
	}
}

//Function that determines a product's worth
function getMonetaryValue(prod){
	return Math.ceil(Math.pow(prod.IdeaStrength,2)*Math.pow(prod.DesignStrength,1.1)*Math.pow(prod.BuildStrength,1.1)/1000);
}

//Function that checks if a product "breaks" while in Maintenance mode. Returns an integer indicating how badly it broke.
function DoesItBreak(prod){
	return (prod.Volatility - Math.random())*SubCategoryAttributes[prod.SubCategory][0];
}

//Below is the list of functions that run during each player's turn cycle.
//Warning for product being in same spot for too long
function MoveItSoon(Ply, prod){
	if (prod.turnsInSamePhase >= 6){
		Ply.TriggeredEvents.push(function(){
			TriggeredEventDisplay("Your product " + prod.Name + " has been in the " + prod.Phase + " phase for a while. Consider moving it along.", GameSounds.Message, "longtime");
		});
	}
}
//Reduction of employees due to spending a LONG time on a product
function EmployeeReductionCheck(employeeType, Ply, prod){
	var numLost;
	var messagePart;
	if (prod.turnsInSamePhase >= 8){
		numLost=Math.ceil(Math.random()*3);
		if (employeeType==="des"){
			if (numLost > Ply.NumCreative){
				numLost = Ply.NumCreative;
			}
			Ply.NumCreative-=numLost;
			messagePart = numLost.toString() + " of your designers just quit!";
		}
		else if (employeeType==="dev"){
			if (numLost > Ply.NumDev){
				numLost = Ply.NumDev;
			}
			Ply.NumDev-=numLost;
			messagePart = numLost.toString() + " of your developers just quit!";
		}
		else if (employeeType==="tes"){
			if (numLost > Ply.NumQA){
				numLost = Ply.NumQA;
			}
			Ply.NumQA-=numLost;
			messagePart = numLost.toString() + " of your testers just quit!";
		}
		if (numLost > 0){
			Ply.TriggeredEvents.push(function(){
				EventFlash();
				TriggeredEventDisplay("Your " + prod.Name + " has been in the same phase for too long! " + messagePart, GameSounds.Event, "employeeloss");
				UpdatePlayerDisplay();
			});
		}
		else{
			MoveItSoon(Ply, prod);
		}
	}
	else{
		MoveItSoon(Ply, prod);
	}
}
//Product is so horribly broken that it gets removed from the board
function IsItSoBadItGetsRemoved(Ply, Prod, AmountLost) {
	if ((AmountLost >= 1000) || (AmountLost >= getMonetaryValue(Prod))) {
		Ply.TriggeredEvents.push(function(){
			EventFlash();
			if (Prod){
				removeProduct(Prod);
				TriggeredEventDisplay("Your " + Prod.Name + " was just recalled due to a massive net loss! Try again with something new!", GameSounds.Event, "fail");
			}
			else{
				TriggeredEventDisplay("Your " + Prod.Name + " would have been recalled due to a massive net loss, if it had not been destroyed already!", GameSounds.Event, "fail");
			}
		});
	}
}
//Displays the triggered event.
function TriggeredEventDisplay(message, sound, picture) {
	playSound(sound);
	$("#TriggerDesc").text(message);
	$("#TriggerImage").attr('src',"../images/events/event_" + picture + ".png");
	ShowTriggerDialog();
}
//Iterates through triggered events recursively.
function TriggeredEventIterator(TheTriggeredEvents){
	if (TheTriggeredEvents.length > 0){
		if (TheTriggeredEvents[0] !== null){
			TheTriggeredEvents[0]();
		}
		TheTriggeredEvents.splice(0,1);
	}
}

//Makes a little flash when something important happens
function EventFlash(){
	setTimeout(function(){
		$("#PopupOverlay").css("transition","0ms ease-out");
		$("#PopupOverlay").css("background-color", "rgba(100,100,100,.75)");
		setTimeout(function(){
			$("#PopupOverlay").css("transition","450ms ease-out");
			$("#PopupOverlay").css("background-color", "rgba(0,0,0,.5)");
		},50);
	},2);
}


function FinishGame(){
	TheGame.GameState = "COMPLETE";
	ShowCashAlert=false;
	for(var i=0;i<TheGame.Players.length;i++){
		var Ply=TheGame.Players[i];
		var Net=0;
		if(Ply.NumProducts<1){
			Net=Math.round(BasePayouts.DayJobEachTurn*TotalPayoutRate*(1.4-0.2*(GetDifficultyConstant(TheGame.Settings.Difficulty))));
		}else{
			for(var j=0;j<Ply.Products.length;j++){
				var Prod=Ply.Products[j];
				if(Prod.Phase===ProductPhases.Maintenance && (SubCategoryAttributes[Prod.SubCategory][4] <= 0)){
					var earnings = Math.round(getMonetaryValue(Prod)*SubCategoryAttributes[Prod.SubCategory][3]*TotalPayoutRate*(1.4-0.2*(GetDifficultyConstant(TheGame.Settings.Difficulty))));
					if (TheGame.PatentTracker){
						patentOwnerID = doIPayRoyalties(Prod, TheGame.PatentTracker);
						if (patentOwnerID !== -1)
						{
							cashOwed = Math.round(earnings/10);
							earnings -= cashOwed;
							TheGame.Players[patentOwnerID].Money += cashOwed;
						}
					}
					Net+=earnings;
				}
			}
		}
		Net=Net-((BaseCosts.PayDev*Ply.NumDevs)+(BaseCosts.PayQA*Ply.NumQA)+(BaseCosts.PayCreative*Ply.NumCreative));
		Ply.Money=Ply.Money+Net;
	}
	UpdatePlayerDisplay();
	GameOverDisplay();
}

function GameOverDisplay(){
	playSound(GameSounds.GameOver);
	$("#PopupOverlay").show();
	$("#GameOverTitle").css("top", "200px");
	setTimeout(function(){
		$("#FinishGameButton").show();
		$("#FinishGameButton").attr("disabled",false);
		$("#FinishGameButton").css("transition", "opacity .6s ease-out");
		$("#FinishGameButton").css("opacity","1");
	},900);
}

//Function that ends the game.
function GetFinalResults(){
	var Plyr = {};
	
	for(PlyNum in TheGame.Players){
		var Ply=TheGame.Players[PlyNum];
					
		Plyr[PlyNum]={};
		Plyr[PlyNum].Name=Ply.Name;
		Plyr[PlyNum].Money=Ply.Money;
		Plyr[PlyNum].Color=Ply.Color;
		Plyr[PlyNum].NumProducts=Ply.NumProducts;
		Plyr[PlyNum].NumEmployees=(Ply.NumQA+Ply.NumDevs+Ply.NumCreative);
		
	}
	
	localStorage.setItem("FinalResults",JSON.stringify(Plyr));
}

function SwitchToFinalResults(){
	GetFinalResults();
	$("#Blanket").show();
	setTimeout(function(){
		$("#Blanket").css("transition","500ms ease-out");
		$("#Blanket").css("opacity","1");
		setTimeout(function(){
			window.location="gameover.html";
		},650);
	},50);
}