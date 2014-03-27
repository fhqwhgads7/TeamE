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
//Format is: Name, Decision AreaOfEffect, Scale, Type, Value
//Name is a self-explanatory string
//Decision is a boolean that determines whether the player has to make a choice between two options for that kind of event
//AreaOfEffect is a string that determines whether to display to all players or one random player
//Scale is an integer rating between -10 and 10, -10 being the most negative and 10 being the most positive
//Type is a string that labels what kind of event it is
//Value is the parameter necessary for that type of event to execute properly
//Picture is a string for the suffix of the picture file name to be used. Ex. "cash" for event_cash.png Pics themselves should be 250*250 pngs.
var RandomEvents=[
	["Tax break!",false,"AllPlayers",2,"CashChange",750,"cash"],
	["Catastrophe!",true,"OnePlayer",-5,"AssetDestruction",2,"disaster"], //Picks two products, and you either pay to save them or lose them
	["Stock Market Plummets!",false,"AllPlayers",-3,"PayoutRateChange_All",0.5,"stockcrash"],
	["Video Game craze!",false,"AllPlayers",3,"PayoutRateChange_Video Game",1.5,"controller"],
	["Cyber-security Attack!",true,"AllPlayers",-5,"CategoryShutdown_Software",2,"cyberattack"],
	["All airlines grounded!",false,"AllPlayers",-4,"SubcategoryShutdown_Air",1,"airport"],
	["Alternative Energy",false,"AllPlayers",1,"PayoutRateChange_Solar",1.1,"solarpanel"],
	["Recession!",false,"AllPlayers",-9,"PayoutRateChange_All",0.1,"recession"],
	["Going green!",false,"AllPlayers",-1,"PayoutRateChange_Printer",0.7,"tree"],
	["Grant!",true,"OnePlayer",10,"CashChange",100000,"cash"]
]
var ProductCategories={
	Energy:["Hydroelectric","Solar","Fossil Fuel","Wind"],
	Transportation:["Space","Air","Land","Sea"],
	Hardware:["Desktop","Laptop","Peripheral","Printer"],
	Software:["Communication","Office Program","Video Game","Web Application"],
	Houseware:["Cleaning","Furniture","Kitchen","Barbecue"],
	Other:["School","Shoes","Musical","Key Holder"]
}
//The attributes are, in order: Volatility multiplier (Index 0), Prototype Cost multiplier (Index 1), and Idea Strength increase multiplier (Index 2)
var SubCategoryAttributes={
	"Hydroelectric":[1,1,1],
	"Solar":[1,0.8,0.8],
	"Fossil Fuel":[1.1,0.9,1.1],
	"Wind":[0.7,0.8,0.6],
	"Space":[3,2,2],
	"Air":[2.5,1.5,2],
	"Land":[1.6,1.5,1.5],
	"Sea":[1.8,1.7,1.7],
	"Desktop":[0.5,0.7,0.3],
	"Laptop":[1,0.5,0.3],
	"Peripheral":[1.3,0.7,1],
	"Printer":[0.4,0.8,0.7],
	"Communication":[0.6,0.4,0.8],
	"Office Program":[0.3,0.1,0.3],
	"Video Game":[0.8,0.3,1.2],
	"Web Application":[0.5,0.2,0.8],
	"Cleaning":[1.2,0.9,1.3],
	"Furniture":[0.4,0.7,0.5],
	"Kitchen":[1.2,0.9,0.3],
	"Barbecue":[1.1,0.5,0.6],
	"School":[0.5,0.6,1],
	"Shoes":[0.3,0.9,0.4],
	"Musical":[0.2,0.4,0.6],
	"Key Holder":[0.1,0.2,0.2]
};
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
		$("#new-product-button").attr("disabled",true);
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
	ProdElem.style.zIndex="2";
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
//Takes in the product's GlobalID and removes that product
function removeProduct(prod){
	$("#ProductWindow").hide();
	$("div").remove("#ProductDisplayItem_"+prod.GlobalID);
	if (prod.justStarted)
		$("#new-product-button").attr("disabled",false);
	CurrentlySelectedProduct.Owner.Products.splice(prod.Number, 1);
	TheGame.Players[TheGame.CurrentPlayerNum].NumProducts--;
	CurrentlySelectedProduct = null;
	UpdatePlayerDisplay();
	playSound(GameSounds.LoseMoney);
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
			$("#CurProdDetailsButton").prop("disabled",false);
			$("#CurProdRevertButton").prop("disabled",false);
			var CurPhase=CurrentlySelectedProduct.Phase;
			if ((CurPhase == ProductPhases.Maintenance) || ((CurPhase == ProductPhases.Prototype && !(Prod.hasPrototype))||(CurPhase == ProductPhases.Deployment && !(Prod.readyToDeploy)))){
				$("#CurProdAdvanceButton").prop("disabled",true);
			}
			else{
				$("#CurProdAdvanceButton").prop("disabled",false);
			}
			if (CurPhase == ProductPhases.Idea){
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
		var productScore = getMonetaryValue(Prod);
		var rating = productScore.toString();

		/* A series of statements to later put a product's strength into words.
		if (productScore >= 8000)
			rating = "Excellent!";
		else if (productScore >= 3000)
			rating = "Exceptional";
		else if (productScore >= 1000)
			rating = "Strong";
		else if (productScore >= 500)
			rating = "Subpar";
		else
			rating = "Developing";
		*/
		
		document.getElementById("DisplayOVLS").innerHTML=rating;
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
		$("#DetailsTSS").text(Prod.TestingStrength.toString());
		$("#DetailsCOS").text(Math.ceil((1-Prod.Volatility)*100).toString()+"%");
		if (Prod.hasPrototype)
			$("#DetailsHPT").text("Yes");
		else
			$("#DetailsHPT").text("No");
		if (Prod.readyToDeploy)
			$("#DetailsDPR").text("Yes");
		else
			$("#DetailsDPR").text("No");
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
		TheGame.CurrentPlayer.Money=TheGame.CurrentPlayer.Money-BaseCosts.Prototype*SubCategoryAttributes[CurrentlySelectedProduct.SubCategory][1];;
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
	var removeCheck = false;
	if(CurPhase!=ProductPhases.Idea){playSound(GameSounds.MinorFail);}
	if(CurPhase==ProductPhases.Idea){
		ShowRemoveDialog();//playSound(GameSounds.Wrong_Low);
		removeCheck = true;
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
	if (!removeCheck){
		UpdateProductDisplayPosition(CurrentlySelectedProduct);
		UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
		UpdatePlayerDisplay();
	}
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
	$("#new-product-button").attr("disabled",false);
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
		$('.Standard').attr("disabled", TheGame.CurrentPlayer.Type=="Computer");
		for (i=0; i<TheGame.CurrentPlayer.Products.length; i++){
			$("#ProductDisplayItem_" + TheGame.CurrentPlayer.Products[i].GlobalID).css("z-index",2);
		}
		$("#CurProdAdvanceButton").prop("disabled",true);
		$("#CurProdRevertButton").prop("disabled",true);
		if(CurrentlySelectedProduct!=null){
			UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayElemID);
		}
		if(WillGo){
			DisplayNewRoundEvent();
		}else{
			playSound(GameSounds.NextTurn);
			$("#ProductWindow").hide();
			UpdatePlayerDisplay();
		}
	}else{
		DisplayNewRoundEvent();
	}
	setTimeout(function(){
		TheGame.CurrentPlayer.TurnInit();
	},1250)
}
function DisplayNewRoundEvent(){
	var Num=TheGame.CurrentRound+1;
	$('.Standard').attr("disabled", true);
	if(Num<=TheGame.Settings.NumberOfRounds){
		if (TheGame.Settings.NumberOfRounds-Num <= 5)
			changeCurrentBGM("TimeRunningOut");
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
				$("#ProductWindow").hide();
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
	for(var i=0;i<TheGame.Players.length;i++){
		var Ply=TheGame.Players[i];
		if(Ply.NumProducts>0){
			for(var j=0;j<Ply.Products.length;j++){
				var Prod=Ply.Products[j];
				if (Prod.Phase != Prod.PhaseAtStartOfTurn){
					Prod.turnsInSamePhase=0;
				}
				Prod.PhaseAtStartOfTurn = Prod.Phase;
				Prod.turnsInSamePhase++;
				if(Prod.justStarted){
					Prod.justStarted = false;
				}
				var numOnSameSpot = 0;
				for (k = 0; k<Ply.Products.length; k++){
					if (Prod.Phase == Ply.Products[k].Phase){
						numOnSameSpot++;
					}
				}
				if(Prod.Phase==ProductPhases.Idea){
					Prod.IdeaStrength=Prod.IdeaStrength+Math.ceil(SubCategoryAttributes[Prod.SubCategory][2]*6.0/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase==ProductPhases.Design){
					Prod.DesignStrength=Prod.DesignStrength+Math.ceil(2*Ply.NumCreative/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase==ProductPhases.Prototype){
					Prod.hasPrototype=true;
				}else if(Prod.Phase==ProductPhases.PrototypeTesting){
					Prod.DesignStrength=Prod.DesignStrength+Math.ceil(Ply.NumQA*1.2/(numOnSameSpot+Prod.turnsInSamePhase));
					Prod.TestingStrength+=(Prod.DesignStrength*Ply.NumQA/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase==ProductPhases.Development){
					Prod.BuildStrength=Prod.BuildStrength+Math.ceil(2*Ply.NumDevs/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase==ProductPhases.PreDepTesting){
					Prod.BuildStrength=Prod.BuildStrength+Math.ceil(Ply.NumQA*1.2/(numOnSameSpot+Prod.turnsInSamePhase));
					Prod.TestingStrength+=(Prod.BuildStrength*Ply.NumQA/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase==ProductPhases.Deployment){
					Prod.readyToDeploy=true;
				}else if(Prod.Phase==ProductPhases.PostDepTesting){
					Prod.TestingStrength+=Math.ceil(0.5*(Prod.DesignStrength+Prod.BuildStrength)*Ply.NumQA/(numOnSameSpot+Prod.turnsInSamePhase));
				}else if(Prod.Phase==ProductPhases.Maintenance){
					var Broken = DoesItBreak(Prod);
					if (Broken>0){
						Ply.Money=Ply.Money-Math.ceil(2*Broken*getMonetaryValue(Prod));
						Prod.TestingStrength+=(Prod.DesignStrength+Prod.BuildStrength);
					}
				}
				Prod.Volatility = 1/(1+.3*Prod.TestingStrength);
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
					var earnings = getMonetaryValue(Prod);
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
	var wellBuiltEnough = getMonetaryValue(product) >= 1000;
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

//Function that ends the game.
function FinishGame(){
	var Plyr = new Object();
	
	for(PlyNum in TheGame.Players){
		var Ply=TheGame.Players[PlyNum];
					
		Plyr[PlyNum]=new Object();
		Plyr[PlyNum].Name=Ply.Name;
		Plyr[PlyNum].Money=Ply.Money;
		Plyr[PlyNum].Color=Ply.Color;
		Plyr[PlyNum].NumProducts=Ply.NumProducts;
		Plyr[PlyNum].NumEmployees=(Ply.NumQA+Ply.NumDevs+Ply.NumCreative);
		
	}
	
	localStorage.setItem("FinalResults",JSON.stringify(Plyr));
	//Maybe a more fancy transition can go in here later.
	SwitchToPage("gameover.html");
}

//Function that determines a product's worth
function getMonetaryValue(prod){
	return ((prod.IdeaStrength^2)*(prod.DesignStrength^1.1)*(prod.BuildStrength^1.1)*4);
}

//Function that checks if a product "breaks" while in Maintenance mode. Returns an integer indicating how badly it broke.
function DoesItBreak(prod){
	return (prod.Volatility - Math.random())*SubCategoryAttributes[prod.SubCategory][0];
}

//Below is the list of functions that run during each player's turn cycle.