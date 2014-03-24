var TheGame;
var RotateDir=0;
var Rotation=0;
var CurrentlySelectedProduct;
var ShowCashAlert=false;
var EVENT_CHANCE=0.5;
var BOARD_WIDTH=800; //used until we can dynamically grab the main background's width

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
var ProductCategories={
	Energy:["Hydroelectric","Solar","Fossil Fuel","Wind"],
	Transportation:["Space","Air","Land","Sea"],
	Hardware:["Desktop","Laptop","Peripheral","Printer"],
	Software:["Communication","Office Program","Video Game","Web Application"],
	Houseware:["Cleaning","Furniture","Kitchen","Barbecue"],
	Other:["School","Shoes","Musical","Key Holder"]
}
function GameInitialize(){
	var GameCreationInfo=JSON.parse(localStorage.getItem("TheBrandNewGame"));
	TheGame=new Game("2947");
	TransferGameStartupInfo(GameCreationInfo,TheGame);
	TheGame.CurrentPlayer=TheGame.Players[TheGame.CurrentPlayerNum];
	TheGame.CurrentPlayerNum=TheGame.CurrentPlayer.Number;
	if (TheGame.Settings.PatentingEnabled=="On"){
		TheGame.PatentTracker = new PatentTracker();
	}
	UpdatePlayerDisplay();
	PopulateNewProdCategories();
	setInterval("TipThink();",10);
	setTimeout(DisplayNewRoundEvent,1);
	$("#MainBoard").hide();
	setTimeout(Appear,750);
}
function TipThink(){
	var Elem=document.getElementById("TipSpan");
	var Pos=parseInt(Elem.style.left.replace("px",""),10);
	var NewPos=Pos-1;
	if(NewPos<=-Elem.innerHTML.length*15){
		NewPos=BOARD_WIDTH+1;
		Elem.innerHTML=Tips[Math.floor((Math.random()*Tips.length))];
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
	to.Settings={}
	to.Settings.Difficulty=from.Options.Difficulty;
	to.Settings.CPUIntelligence=from.Options.CPUIntelligence;
	to.Settings.PatentingEnabled=from.Options.PatentingEnabled;
	to.Settings.NumberOfRounds=from.Options.NumberOfRounds;
}
function UpdatePlayerDisplay(){
	var OldCash=parseInt($("#CurPlyMoney").html());
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
		SubSel.append('<option>'+ProductCategories[Cat][i]+'</option>')
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
	}
	else {
		$("#NewProdName").css("background-color", "red");
		setTimeout(function(){
			$("#NewProdName").css("background-color", "white");
		},100);
		playSound(GameSounds.Wrong_Med);
	}
}
function CreateProductDisplay(prod){
	var GameBoard=document.getElementById("GameBoardCircle");
	var ProdElem=document.createElement("div");
	ProdElem.id="ProductDisplayItem_"+prod.GlobalID;
	prod.DisplayItemID=ProdElem.id;
	ProdElem.addEventListener("click",function(){UpdateCurProdDisplay(ProdElem.id);});
	ProdElem.className="ProductDisplayItem";
	ProdElem.style.backgroundImage="url('../images/ProductIcons/"+prod.Category.toLowerCase()+"_"+prod.SubCategory.toLowerCase()+".png')";
	ProdElem.style.left="0px";
	ProdElem.style.top="0px";
	ProdElem.style.borderStyle="outset";
	ProdElem.style.borderColor=PlayerColors[prod.Color];
	ProdElem.style.backgroundColor=prod.Color;
	ProdElem.style.webkitTransform="rotate("+(-Rotation).toString()+"deg)";
	ProdElem.style.MozTransform="rotate("+(-Rotation).toString()+"deg)";
	GameBoard.appendChild(ProdElem);
	UpdateProductDisplayPosition(prod);
	UpdatePlayerDisplay();
	UpdateCurProdDisplay(ProdElem.id);
}
function UpdateProductDisplayPosition(prod){
	var AlreadyThere=-2;
	for(Biz in TheGame.Players){
		var Ply=TheGame.Players[Biz]
		for(Prod in Ply.Products){
			if(TheGame.Players[Biz].Products[Prod].Phase==prod.Phase){
				AlreadyThere=AlreadyThere+1;
			}
		}
	}
	var Add=15*AlreadyThere;
	var ProdElem=$("#"+"ProductDisplayItem_"+prod.GlobalID);
	setTimeout(function(){
		ProdElem.css("left",(PhasePositions[prod.Phase][0]+Add).toString()+"px");
		ProdElem.css("top",(PhasePositions[prod.Phase][1]+Add).toString()+"px");
	},1);	
}
function EmployeeChange(type,num){
	var ply=TheGame.CurrentPlayer;
	if(type=="des"){
		if((ply.NumCreative==0)&&(num<0)){return;}
		ply.NumCreative=ply.NumCreative+num;
	}else if(type=="dev"){
		if((ply.NumDevs==0)&&(num<0)){return;}
		ply.NumDevs=ply.NumDevs+num;
	}else if(type=="tes"){
		if((ply.NumQA==0)&&(num<0)){return;}
		ply.NumQA=ply.NumQA+num;
	}
	UpdateEmpPopupDisplays();
	UpdatePlayerDisplay();
}
function UpdateCurProdDisplay(id){
	if(id){
		var Prod=GetProdFromDispElemID(id);
		CurrentlySelectedProduct=Prod;
		$("#ProductWindow").show();
		$("#ProductWindow").css("border-color",Prod.Owner.Color);
		if(Prod.OwnerNumber==TheGame.CurrentPlayerNum){
			var CurPhase=CurrentlySelectedProduct.Phase;
			if (CurPhase == ProductPhases.Maintenance){
				$("#CurProdAdvanceButton").prop("disabled",true);
			}
			else{
				$("#CurProdAdvanceButton").prop("disabled",false);
			}
			if (CurPhase == ProductPhases.Idea){
				$("#CurProdRevertButton").prop("disabled",true);
			}
			else{
				$("#CurProdRevertButton").prop("disabled",false);
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
			$("#CurProdPatentButton").prop("disabled",true);
		}
		document.getElementById("ProdDisplayName").innerHTML=Prod.Name;
		document.getElementById("ProdOwnerDisplayName").innerHTML=Prod.Owner.Name;
		document.getElementById("DisplayCAT").innerHTML=Prod.Category;
		document.getElementById("DisplaySUBCAT").innerHTML=Prod.SubCategory;
		document.getElementById("DisplayPIS").innerHTML=Prod.IdeaStrength.toString();
		document.getElementById("DisplayPDS").innerHTML=Prod.DesignStrength.toString();
		document.getElementById("DisplayPBS").innerHTML=Prod.BuildStrength.toString();
		document.getElementById("DisplayPPhase").innerHTML=Prod.Phase;
		document.getElementById("DisplayPFID").innerHTML=Prod.Number.toString();
	}
}
function GetProdFromDispElemID(id){
	var NewID=id.replace("ProductDisplayItem_","");
	NewID=parseInt(NewID);
	var Prod=TheGame.PlayerProducts[NewID];
	return Prod;
}
function TryToAdvanceProduct(){
	var CurPhase=CurrentlySelectedProduct.Phase;
	if(CurPhase!=ProductPhases.Maintenance)
		playSound(GameSounds.AdvanceProduct);
	if(CurPhase==ProductPhases.Idea){
		CurrentlySelectedProduct.Phase=ProductPhases.Design;
	}else if(CurPhase==ProductPhases.Design){
		CurrentlySelectedProduct.Phase=ProductPhases.Prototype;
	}else if(CurPhase==ProductPhases.Prototype){
		TheGame.CurrentPlayer.Money=TheGame.CurrentPlayer.Money-BaseCosts.Prototype;
		CurrentlySelectedProduct.Phase=ProductPhases.PrototypeTesting;
	}else if(CurPhase==ProductPhases.PrototypeTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Development;
	}else if(CurPhase==ProductPhases.Development){
		CurrentlySelectedProduct.Phase=ProductPhases.PreDepTesting;
	}else if(CurPhase==ProductPhases.PreDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Deployment;
	}else if(CurPhase==ProductPhases.Deployment){
		TheGame.CurrentPlayer.Money=TheGame.CurrentPlayer.Money-BaseCosts.Deployment;
		CurrentlySelectedProduct.Phase=ProductPhases.PostDepTesting;
	}else if(CurPhase==ProductPhases.PostDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Maintenance;
	}else if(CurPhase==ProductPhases.Maintenance){
		playSound(GameSounds.Wrong_Low);
	}
	
	//This if-block is for patenting reasons.
	if (CurrentlySelectedProduct.isANewProduct && CurrentlySelectedProduct.Phase==ProductPhases.Maintenance){
		CurrentlySelectedProduct.isANewProduct = false;
	}
	
	UpdateProductDisplayPosition(CurrentlySelectedProduct);
	UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	UpdatePlayerDisplay();
}
function TryToRevertProduct(){
	var CurPhase=CurrentlySelectedProduct.Phase;
	if(CurPhase!=ProductPhases.Idea){playSound(GameSounds.MinorFail);}
	if(CurPhase==ProductPhases.Idea){
		playSound(GameSounds.Wrong_Low);
	}else if(CurPhase==ProductPhases.Design){
		CurrentlySelectedProduct.Phase=ProductPhases.Idea;
		CurrentlySelectedProduct.DesignStrength=0;
	}else if(CurPhase==ProductPhases.Prototype){
		CurrentlySelectedProduct.Phase=ProductPhases.Design;
	}else if(CurPhase==ProductPhases.PrototypeTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Prototype;
	}else if(CurPhase==ProductPhases.Development){
		CurrentlySelectedProduct.Phase=ProductPhases.PrototypeTesting;
		CurrentlySelectedProduct.BuildStrength=0;
	}else if(CurPhase==ProductPhases.PreDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Development;
	}else if(CurPhase==ProductPhases.Deployment){
		CurrentlySelectedProduct.Phase=ProductPhases.PreDepTesting;
		TheGame.CurrentPlayer.Money=TheGame.CurrentPlayer.Money-BaseCosts.Deployment/2;
	}else if(CurPhase==ProductPhases.PostDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Deployment;
		TheGame.CurrentPlayer.Money=TheGame.CurrentPlayer.Money-BaseCosts.Deployment/2;
	}else if(CurPhase==ProductPhases.Maintenance){
		CurrentlySelectedProduct.Phase=ProductPhases.PostDepTesting;
	}
	UpdateProductDisplayPosition(CurrentlySelectedProduct);
	UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	UpdatePlayerDisplay();
}
function VisualCashAlert(){
	var Ply=TheGame.CurrentPlayer;
	var Amt=Ply.Money-Ply.LastDisplayedMoney;
	var theNumber = NumberNameTable[TheGame.CurrentPlayerNum+1];
	if(!ShowCashAlert){return;}
	if(Amt==0){return;}
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
		if(PlyNum==0){Str="PlyOne";}else if(PlyNum==1){Str="PlyTwo";}else if(PlyNum==2){Str="PlyThree";}else if(PlyNum==3){Str="PlyFour";}else if(PlyNum==4){Str="PlyFive";}else if(PlyNum==5){Str="PlySix";}
		$("#"+Str+"ScbdBox").show();
		$("#"+Str+"ScbdBox").css("border-color",Ply.Color);
		$("#"+Str+"ScbdName").html(Ply.Name);
		$("#"+Str+"ScbdMoney").html(Ply.Money);
		$("#"+Str+"ScbdProds").html(Ply.NumProducts);
		$("#"+Str+"ScbdEmps").html(Ply.NumQA+Ply.NumDevs+Ply.NumCreative);
	}
}
function CycleTurn(){
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
		$("#ProductWindow").hide();
		if(CurrentlySelectedProduct!=null){
			UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayElemID);
		}
		if(WillGo){
			DisplayNewRoundEvent();
		}else{
			playSound(GameSounds.NextTurn);
			UpdatePlayerDisplay();
		}
	}else{
		DisplayNewRoundEvent();
	}
}
function DisplayNewRoundEvent(){
	var Num=TheGame.CurrentRound+1;
	$('.Standard').attr("disabled", true);
	if(Num<=TheGame.Settings.NumberOfRounds){
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
	for(var i=0;i<TheGame.Players.length;i++){
		var Ply=TheGame.Players[i];
		if(Ply.NumProducts>0){
			for(var j=0;j<Ply.Products.length;j++){
				var Prod=Ply.Products[j];
				if(Prod.Phase==ProductPhases.Idea){
					Prod.IdeaStrength=Prod.IdeaStrength+1;
				}else if(Prod.Phase==ProductPhases.Design){
					Prod.DesignStrength=Prod.DesignStrength+Ply.NumCreative;
				}else if(Prod.Phase==ProductPhases.Prototype){
					//derp
				}else if(Prod.Phase==ProductPhases.PrototypeTesting){
					Prod.DesignStrength=Prod.DesignStrength+Math.ceil(Ply.NumQA*.6);
				}else if(Prod.Phase==ProductPhases.Development){
					Prod.BuildStrength=Prod.BuildStrength+Ply.NumDevs;
				}else if(Prod.Phase==ProductPhases.PreDepTesting){
					Prod.BuildStrength=Prod.BuildStrength+Math.ceil(Ply.NumQA*.6);
				}else if(Prod.Phase==ProductPhases.Deployment){
					//derp
				}else if(Prod.Phase==ProductPhases.PostDepTesting){
					//derp
				}else if(Prod.Phase==ProductPhases.Maintenance){
					//derp
				}
			}
		}
	}
	for(var i=0;i<TheGame.Players.length;i++){
		var Ply=TheGame.Players[i];
		var Net=0;
		if(Ply.NumProducts<1){
			Net=BasePayouts.DayJobEachTurn;
		}else{
			for(var j=0;j<Ply.Products.length;j++){
				var Prod=Ply.Products[j];
				if(Prod.Phase==ProductPhases.Maintenance){
					var earnings = (Prod.IdeaStrength^2)*(Prod.DesignStrength^1.1)*(Prod.BuildStrength^1.1)*4;
					if (TheGame.PatentTracker){
						patentOwnerID = doIPayRoyalties(Prod, TheGame.PatentTracker);
						if (patentOwnerID != -1)
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
	//document.getElementById("RoundNumberDisplay").innerHTML=TheGame.CurrentRound.toString();
	//if(Math.random()<EVENT_CHANCE){RandomEvent();}
	UpdatePlayerDisplay();
	if(CurrentlySelectedProduct!=null){
		UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	}
}
function Appear(){
	$("#MainBoard").show();
	ShowCashAlert=true;
}

//A function for a game to create a tracker of Patents.
function PatentTracker()
{
	//Creates a PatentTracker object and declares variables for it.
	var PatentTracker = new Object();
	PatentTracker.ClassName = "PATENTTRACKER";
	PatentTracker.Categories = new Array();
	PatentTracker.numPatents = 0;
	
	//Creates a 1D array out of the 2D Array of the Product categories.
	for(Item in ProductCategories){
		for (SubItem in ProductCategories[Item]){
			PatentTracker.Categories.push(ProductCategories[Item][SubItem]);
		}
	}
	//Declares a record-keeping array using the 1D Array of the Product categories.
	PatentTracker.Records = new Array();
	
	//The idea is this:
	//For each element in the records array, element 0 is the category,
	//and element 1 is the player who holds the patent for that category.
	//Initially, element 1 is null, because no one /starts/ with a patent.
	for (Item in PatentTracker.Categories)
	{
		PatentTracker.Records.push([PatentTracker.Categories[Item], null, null]);
	}
	
	return PatentTracker;
}

//A function that aids in buying a patent for a particular product subcategory
function TryToBuyPatent(product, game)
{
	//The amount needed to buy a patent is hardcoded for now.
	//Other factors will determine how much the product patent is worth, such as the category and the product's overall strength.
	
	var cost = 2000;
	//The default message. Changes if the patent purchase fails.
	var patentMessage = "Product " + product.Name + " was successfully patented!"
	
	//This variable has two purposes:
	//First to help determine if a product subcategory is patented already
	//Second to help add a player to the patent records if the purchase succeeds
	var categoryIndex = game.PatentTracker.Categories.indexOf(product.SubCategory);
	
	var isPatentedAlready = isThisCategoryPatented(product, game);
	//Product subcategory cannot be patented already.
	var inPatentableCategory = true
	//Patent must be statutory, or the type of product must be able to be patented. Currently, it holds true for all categories.
	var preMaintenance = product.isANewProduct;
	//Product can't already be on the market.
	var wellBuiltEnough = ((product.IdeaStrength^2)*(product.DesignStrength^1.1)*(product.BuildStrength^1.1)*4) >= 1000;
	//It has to be a well developed product.
	var hasTheMoney = (game.CurrentPlayer.Money >= cost);
	//Player needs the money for the patent.
	
	//Series of if-statements to either determine the failure message or purchase the patent.
	if (isPatentedAlready)
	{
		patentOwner = game.PatentTracker.Records[categoryIndex][1];
		
		if (patentOwner == game.CurrentPlayer.GlobalID)
			patentMessage = "You've already purchased a patent for this type of product!";
		else
			patentMessage = "Player " + (patentOwner+1).toString() + ": " + game.Players[patentOwner].Name + " already has the patent for " + product.SubCategory + " products!";
	}
	else if (!inPatentableCategory)
	{
		patentMessage = product.SubCategory + "-type products cannot be patented!";
	}
	else if (!preMaintenance)
	{
		patentMessage = "This product has already been on the market!";
	}
	else if (!wellBuiltEnough)
	{
		patentMessage = "Your product isn't impressive enough just yet!";
	}
	else if (!hasTheMoney)
	{
		patentMessage = "You are $" + (cost - game.CurrentPlayer.Money).toString() + " short!";
	}
	else
	{
		game.CurrentPlayer.Money -= cost;
		game.PatentTracker.Records[categoryIndex][1] = game.CurrentPlayer.GlobalID;
		game.PatentTracker.Records[categoryIndex][2] = product.GlobalID;
		game.PatentTracker.numPatents++;
		UpdatePlayerDisplay();
		UpdateCurProdDisplay(product.DisplayItemID);
	}
	
	//Returns the function completion message.
	return patentMessage;
}

//A function to check if a product's been patented already
function isThisCategoryPatented(prod, game)
{
	return game.PatentTracker.Records[(game.PatentTracker.Categories.indexOf(prod.SubCategory))][1] != null;
}
//A function to check if this particular product is patented
function isThisProductPatented(prod, game)
{
	return game.PatentTracker.Records[(game.PatentTracker.Categories.indexOf(prod.SubCategory))][2] == prod.GlobalID;
}

//A function to help with message displaying regarding patents.
//It sets the message title, the message, and sometimes a helpful tip depending on the failure.
function PatentMessageDisplay(theMessage)
{
	UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	
	//Sets the main message.
	$("#PatentText").text(theMessage);
	var theSound = GameSounds.Event;
	
	//Sets the type of message.
	if (theMessage.indexOf("successfully") > -1){
		$("#PatentTitle").text("SUCCESS!");
	}
	else{
		$("#PatentTitle").text("FAILURE!");
		theSound = GameSounds.Wrong_BAD;
	}
	
	//Sets and reveals a tip if applicable.
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

//A function that helps handle the payment of royalties to players who own patents
//It takes in a product and checks if that type of product has been patented by someone besides the owner of said product
//It returns -1 if no royalties need to be paid

function doIPayRoyalties(product, patentTracker)
{
	//Initializes a return value variable and an index variable.
	var patentOwnerID = -1;
	var index = patentTracker.Categories.indexOf(product.SubCategory);
	
	//If another player owns that patent, set the return value to their ID
	if ((product.Owner.GlobalID != patentTracker.Records[index][1]) && patentTracker.Records[index][1] != null)
	{
		patentOwnerID = patentTracker.Records[index][1];
	}
	
	return patentOwnerID;
}

//This function didn't exist apparently.
function FinishGame(){
	SwitchToPage("gameover.html");
}