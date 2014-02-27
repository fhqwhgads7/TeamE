var TheGame;
var RotateDir=0;
var Rotation=0;
var CurrentlySelectedProduct;
var ShowCashAlert=false;
function GameInitialize(){
	var GameCreationInfo=JSON.parse(localStorage.getItem("TheBrandNewGame"));
	TheGame=new Game();
	TheGame.GameState="PlayerTurnIdle";
	TransferGameStartupInfo(GameCreationInfo,TheGame);
	TheGame.CurrentPlayer=TheGame.Players[TheGame.CurrentPlayerNum];
	//UpdatePlayerDisplay();
	//PopulateNewProdCategories();
	//document.getElementById("RoundNumberDisplay").innerHTML=TheGame.CurrentRound.toString();
	//setInterval("TipThink();",10);
	//setInterval("RotateThink();",50);
	//setTimeout(DisplayNewRoundEvent,100);
	//document.getElementById("MainBoard").style.visibility="hidden";
	//setTimeout(Appear,750);
}
function TransferGameStartupInfo(from,to){
	for(var i=1;i<=6;i++){
		var Ply=from.Players["Player"+NumberNameTable[i]];
		if(Ply){
			new Player(to,Ply.Name,Ply.Type,Ply.Color);
		}
	}
	to.Settings={}
	to.Settings.Difficulty=from.Settings.Difficulty;
	to.Settings.CPUIntelligence=from.Settings.CPUIntelligence;
	to.Settings.PatentingEnabled=from.Settings.PatentingEnabled;
	to.Settings.NumberOfRounds=from.Settings.NumberOfRounds;
}
/*-
function Appear(){
	document.getElementById("MainBoard").style.visibility="visible";
	ShowCashAlert=true;
}
function PopulateNewProdCategories(){
	var Sel=document.getElementById("NewProductCategory");
	for(Item in ProductCategories){
		var Opt=document.createElement("option");
		Opt.value=Item;
		Opt.innerHTML=Item;
		Sel.appendChild(Opt);
	}
	Sel.options[0].selected="true";
	SelectProductCategory();
}
function SelectProductCategory(){
	var Sel=document.getElementById("NewProductCategory");
	var SubSel=document.getElementById("NewProductSubCategory");
	while(SubSel.options.length>0){
		SubSel.options[0]=null;
	}
	var Cat=Sel.options[Sel.selectedIndex].value;
	for(var i=0;i<ProductCategories[Cat].length;i++){
		var Opt=document.createElement("option");
		Opt.value=ProductCategories[Cat][i];
		Opt.innerHTML=ProductCategories[Cat][i];
		SubSel.appendChild(Opt);
	}
	SubSel.options[0].selected=true;
}
function UpdatePlayerDisplay(){
	var OldCash=parseInt(document.getElementById("CurrentPlayerMoney").innerHTML);
	var OldName=document.getElementById("CurrentPlayerName").innerHTML;
	var Ply=TheGame.ActivePlayer;
	var MainBox=document.getElementById("CurrentPlayerDisplay");
	MainBox.style.borderColor=Ply.Color;
	document.getElementById("CurrentPlayerName").innerHTML=Ply.Name;
	if(Ply.Name.length>15){document.getElementById("CurrentPlayerName").title=Ply.Name;}
	document.getElementById("CurrentPlayerMoney").innerHTML=Ply.Money.toString();
	document.getElementById("CurrentPlayerProdNum").innerHTML=Ply.NumProducts.toString();
	document.getElementById("CurrentPlayerDesigners").innerHTML=Ply.NumCreative.toString();
	document.getElementById("CurrentPlayerDevelopers").innerHTML=Ply.NumDevs.toString();
	document.getElementById("CurrentPlayerTesters").innerHTML=Ply.NumQA.toString();
	setTimeout(VisualCashAlert,100);
}
function CycleTurn(){
	if(TheGame.NumPlayers>1){
		var WillGo=false;
		var NewPlyNum=TheGame.ActivePlayerNum+1;
		if(NewPlyNum>(TheGame.NumPlayers-1)){
			NewPlyNum=0;
			var WillGo=true;
		}
		TheGame.ActivePlayerNum=NewPlyNum;
		TheGame.ActivePlayer=TheGame.Players[TheGame.ActivePlayerNum];
		document.getElementById("CurProdAdvanceButton").disabled=true;
		document.getElementById("ProductWindow").style.visibility="hidden";
		if(CurrentlySelectedProduct!=null){
			UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayElemID);
		}
		TheGame.State=GameStates.PlayerTurnIdle;
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
					Net=Net+(Prod.IdeaStrength^2)*(Prod.DesignStrength^1.1)*(Prod.BuildStrength^1.1)*4;
				}
			}
		}
		Net=Net-((BaseCosts.PayDev*Ply.NumDevs)+(BaseCosts.PayQA*Ply.NumQA)+(BaseCosts.PayCreative*Ply.NumCreative));
		Ply.Money=Ply.Money+Net;
	}
	TheGame.CurrentRound=TheGame.CurrentRound+1;
	document.getElementById("RoundNumberDisplay").innerHTML=TheGame.CurrentRound.toString();
	if(Math.random()<EVENT_CHANCE){RandomEvent();}
	UpdatePlayerDisplay();
	if(CurrentlySelectedProduct!=null){
		UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	}
}
function RandomEvent(){
	playSound(GameSounds.Event);
	var Event=RandomEvents[Math.floor(Math.random()*RandomEvents.length)];
	var Msg=Event[0];
	var AoE=Event[1];
	var Action=Event[2];
	var Num=Event[3];
	var Desc="";
	if(AoE=="AllPlayers"){
		Desc="Everyone";
		if(Action=="CashChange"){
			if(Num>0){
				Desc=Desc+"'s cash increases by ";
			}
			Desc=Desc+Num.toString();
			Desc=Desc+" dollars.";
			for(PlyNum in TheGame.Players){
				var Ply=TheGame.Players[PlyNum];
				Ply.Money=Ply.Money+Num;
			}
		}
	}
	document.getElementById("RandomEventTitle").innerHTML=Msg;
	document.getElementById("RandomEventDesc").innerHTML=Desc;
	document.getElementById("ModalOverlay").style.visibility="visible";
	document.getElementById("RandomEventModal").style.visibility="visible";
}
function CloseEventModal(){
	document.getElementById("RandomEventModal").style.visibility="hidden";
	document.getElementById("ModalOverlay").style.visibility="hidden";
}
function DisplayNewRoundEvent(){
	var Num=TheGame.CurrentRound+1;
	if(Num>TheGame.MaxRounds){
		FinishGame();
		return;
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
			setTimeout(function(){
				var Elem=document.getElementById("MainBoard");
				Elem.style.transition="none";
				Elem=document.getElementById("RoundAnnouncer");
				Elem.style.transition="none";
				Elem.style.top="-600px";
				NewRoundCalc();
			},650);
		},750);
	},650);
}
function FinishGame(){
	OpenScoreboard(true);
}
function OpenNewProductModal(){
	TheGame.State=GameStates.PlayerCreatingProduct;
	document.getElementById("NewProductModalPlayerName").innerHTML=TheGame.ActivePlayer.Name;
	document.getElementById("NewProductName").value="";
	document.getElementById("ModalOverlay").style.visibility="visible";
	document.getElementById("NewProductModal").style.visibility="visible";
}
function OpenEmployeeModal(){
	TheGame.State=GameStates.PlayerManagingEmployees;
	document.getElementById("EmployeeModalPlayerName").innerHTML=TheGame.ActivePlayer.Name;
	UpdateEmployeeModalDisplay()
	document.getElementById("ModalOverlay").style.visibility="visible";
	document.getElementById("EmployeeModal").style.visibility="visible";
}
function TryToCreateNewProduct(){
	var Name=document.getElementById("NewProductName").value;
	var CatElem=document.getElementById("NewProductCategory");
	var Cat=CatElem.options[CatElem.selectedIndex].value;
	var SubCatElem=document.getElementById("NewProductSubCategory");
	var SubCat=SubCatElem.options[SubCatElem.selectedIndex].value;
	if((Name)&&(Cat)&&(SubCat)){
		var NewProd=new Product(TheGame.ActivePlayer,Name,Cat,SubCat,TheGame.ActivePlayer.Color)
		NewProd.Phase=ProductPhases.Idea;
		playSound(GameSounds.ProductPlacement);
		document.getElementById("ModalOverlay").style.visibility="hidden";
		document.getElementById("NewProductModal").style.visibility="hidden";
		CreateProductDisplay(NewProd);
		TheGame.State=GameStates.PlayerTurnIdle;
	}else{
		ModalFailure(document.getElementById("NewProductModal"));
	}
}
function ModalFailure(elem){
	elem.style.borderColor="red";
	setTimeout(function(){elem.style.borderColor="gray";},100);
	setTimeout(function(){elem.style.borderColor="red";},200);
	setTimeout(function(){elem.style.borderColor="gray";},300);
	setTimeout(function(){elem.style.borderColor="red";},400);
	setTimeout(function(){elem.style.borderColor="gray";},500);
	playSound(GameSounds.Wrong);
}
function CreateProductDisplay(prod){
	var GameBoard=document.getElementById("GameBoardCircle");
	var ProdElem=document.createElement("div");
	ProdElem.id="ProductDisplayItem_"+prod.OwnerNumber+"_"+prod.Number;
	prod.DisplayItemID=ProdElem.id;
	ProdElem.addEventListener("click",function(){UpdateCurProdDisplay(ProdElem.id);});
	ProdElem.className="ProductDisplayItem";
	ProdElem.style.backgroundImage="url('product_icons/"+prod.Category.toLowerCase()+"_"+prod.SubCategory.toLowerCase()+".png')";
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
function GetPlyAndProdFromDispElemID(id){
	var NewID=id.replace("ProductDisplayItem_","");
	var IDNums=NewID.split("_");
	var PlayerID=parseInt(IDNums[0]);
	var ProductID=parseInt(IDNums[1]);
	var Ply=TheGame.Players[PlayerID]
	var Prod=Ply.Products[ProductID]
	return [Ply,Prod];
}
function UpdateCurProdDisplay(id){
	if(id){
		var PlyProd=GetPlyAndProdFromDispElemID(id);
		CurrentlySelectedProduct=PlyProd[1];
		if(PlyProd[1].OwnerNumber==TheGame.ActivePlayerNum){
			document.getElementById("CurProdAdvanceButton").disabled=false;
			document.getElementById("ProductWindow").style.visibility="visible";
		}else{
			document.getElementById("CurProdAdvanceButton").disabled=true;
			document.getElementById("ProductWindow").style.visibility="hidden";
		}
		document.getElementById("ProdDisplayName").innerHTML=PlyProd[1].Name;
		document.getElementById("ProdOwnerDisplayName").innerHTML=PlyProd[0].Name;
		document.getElementById("DisplayCAT").innerHTML=PlyProd[1].Category;
		document.getElementById("DisplaySUBCAT").innerHTML=PlyProd[1].SubCategory;
		document.getElementById("DisplayPIS").innerHTML=PlyProd[1].IdeaStrength.toString();
		document.getElementById("DisplayPDS").innerHTML=PlyProd[1].DesignStrength.toString();
		document.getElementById("DisplayPBS").innerHTML=PlyProd[1].BuildStrength.toString();
		document.getElementById("DisplayPPhase").innerHTML=PlyProd[1].Phase;
		document.getElementById("DisplayPFID").innerHTML=PlyProd[1].Number.toString();
	}
}
function UpdateProductDisplayPosition(prod){
	var AlreadyThere=-2;
	for(Biz in TheGame.Players){
		for(Prod in TheGame.Players[Biz].Products){
			if(TheGame.Players[Biz].Products[Prod].Phase==prod.Phase){
				AlreadyThere=AlreadyThere+1;
			}
		}
	}
	var Add=15*AlreadyThere;
	var ProdElem=document.getElementById("ProductDisplayItem_"+prod.OwnerNumber+"_"+prod.Number);
	setTimeout(function(){
		ProdElem.style.left=(PhasePositions[prod.Phase][0]+Add).toString()+"px";
		ProdElem.style.top=(PhasePositions[prod.Phase][1]+Add).toString()+"px";
	},1);
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
		TheGame.ActivePlayer.Money=TheGame.ActivePlayer.Money-BaseCosts.Prototype;
		UpdatePlayerDisplay();
		CurrentlySelectedProduct.Phase=ProductPhases.PrototypeTesting;
	}else if(CurPhase==ProductPhases.PrototypeTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Development;
	}else if(CurPhase==ProductPhases.Development){
		CurrentlySelectedProduct.Phase=ProductPhases.PreDepTesting;
	}else if(CurPhase==ProductPhases.PreDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Deployment;
	}else if(CurPhase==ProductPhases.Deployment){
		TheGame.ActivePlayer.Money=TheGame.ActivePlayer.Money-BaseCosts.Deployment;
		UpdatePlayerDisplay();
		CurrentlySelectedProduct.Phase=ProductPhases.PostDepTesting;
	}else if(CurPhase==ProductPhases.PostDepTesting){
		CurrentlySelectedProduct.Phase=ProductPhases.Maintenance;
	}else if(CurPhase==ProductPhases.Maintenance){
		playSound(GameSounds.Wrong);
	}
	UpdateProductDisplayPosition(CurrentlySelectedProduct);
	UpdateCurProdDisplay(CurrentlySelectedProduct.DisplayItemID);
	UpdatePlayerDisplay();
}
function CancelNewProduct(){
	document.getElementById("ModalOverlay").style.visibility="hidden";
	document.getElementById("NewProductModal").style.visibility="hidden";
}
function CloseEmployeeModal(){
	UpdatePlayerDisplay()
	document.getElementById("ModalOverlay").style.visibility="hidden";
	document.getElementById("EmployeeModal").style.visibility="hidden";
	TheGame.State=GameStates.PlayerTurnIdle;
}
function VisualCashAlert(){
	var Ply=TheGame.ActivePlayer;
	var Amt=Ply.Money-Ply.LastDisplayedMoney;
	if(Amt==0){return;}
	var Elem=document.getElementById("CashAlert");
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
	ResetCashDisplayPos();
	Elem.innerHTML=Str;
	Elem.style.color=Col;
	Elem.style.transition="top 2.2s ease-in,left 2.2s ease-in,opacity 2s ease-in";
	Elem.style.top="5%";
	Elem.style.left="40%";
	Elem.style.opacity="0";
	if(ShowCashAlert){Elem.style.visibility="visible";}
	setTimeout(ResetCashDisplayPos,2200);
	Ply.LastDisplayedMoney=Ply.Money;
}
function ResetCashDisplayPos(){
	var Elem=document.getElementById("CashAlert");
	Elem.style.transition="none";
	Elem.style.top="9%";
	Elem.style.left="20%";
	Elem.style.opacity="1";
	Elem.style.visibility="hidden";
}
function RotateBegin(dir){
	RotateDir=dir*5;
}
function RotateEnd(){
	RotateDir=0;
}
function RotateThink(){
	if(RotateDir!=0){
		Rotation=Rotation+RotateDir;
		if((RotateDir>=360)||(RotateDir<=-360)){RotateDir=0;}
		document.getElementById("GameBoardCircle").style.webkitTransform="rotate("+Rotation.toString()+"deg)";
		document.getElementById("GameBoardCircle").style.MozTransform="rotate("+Rotation.toString()+"deg)";
		var Prods=document.getElementsByClassName("ProductDisplayItem");
		if(Prods.length>0){
			for(Key in Prods){
				if(Prods[Key].style){
					Prods[Key].style.webkitTransform="rotate("+(-Rotation).toString()+"deg)";
					Prods[Key].style.MozTransform="rotate("+(-Rotation).toString()+"deg)";
				}
			}
		}
	}
}
function ChangeEmployee(type,num){
	TheGame.ActivePlayer[type]=TheGame.ActivePlayer[type]+num;
	if(num>0){
		var Val=0;
		if(type=="NumDevs"){
			Val=BaseCosts.HireDev;
		}else if(type=="NumQA"){
			Val=BaseCosts.HireQA;
		}else{
			Val=BaseCosts.HireCreative;
		}
		TheGame.ActivePlayer.Money=TheGame.ActivePlayer.Money-num*Val;
	}
	if(TheGame.ActivePlayer[type]<0){
		TheGame.ActivePlayer[type]=0;
	}
	UpdateEmployeeModalDisplay();
}
function UpdateEmployeeModalDisplay(){
	document.getElementById("EmployeeModalCreativeNum").innerHTML=TheGame.ActivePlayer.NumCreative.toString();
	document.getElementById("EmployeeModalDevNum").innerHTML=TheGame.ActivePlayer.NumDevs.toString();
	document.getElementById("EmployeeModalQANum").innerHTML=TheGame.ActivePlayer.NumQA.toString();
	document.getElementById("EmployeeModalQANum").innerHTML=TheGame.ActivePlayer.NumQA.toString();
}
function OpenScoreboard(end){
	TheGame.State=GameStates.PlayerWatchingScoreboard;
	if(end){
		document.getElementById("ScoreboardTitle").innerHTML="Game Over";
		document.getElementById("ScoreboardClose").innerHTML="Quit";
	}else{
		document.getElementById("ScoreboardTitle").innerHTML="Competitors";
		document.getElementById("ScoreboardClose").innerHTML="Done";
	}
	for(PlyNum in TheGame.Players){
		var Ply=TheGame.Players[PlyNum];
		var Str="";
		if(PlyNum==0){Str="PlyOne";}else if(PlyNum==1){Str="PlyTwo";}else if(PlyNum==2){Str="PlyThree";}else if(PlyNum==3){Str="PlyFour";}else if(PlyNum==4){Str="PlyFive";}else if(PlyNum==5){Str="PlySix";}
		if((TheGame.ActivePlayerNum!=PlyNum)||(end)){
			document.getElementById(Str+"ScbdBox").style.visibility="visible";
			document.getElementById(Str+"ScbdBox").style.borderColor=Ply.Color;
			document.getElementById(Str+"ScbdName").innerHTML=Ply.Name;
			document.getElementById(Str+"ScbdMoney").innerHTML=Ply.Money;
			document.getElementById(Str+"ScbdProds").innerHTML=Ply.NumProducts;
			document.getElementById(Str+"ScbdEmps").innerHTML=Ply.NumQA+Ply.NumDevs+Ply.NumCreative;
		}
	}
	document.getElementById("ModalOverlay").style.visibility="visible";
	document.getElementById("Scoreboard").style.visibility="visible";
}
function CloseScoreboard(){
	TheGame.State=GameStates.PlayerTurnIdle;
	if(document.getElementById("ScoreboardClose").innerHTML=="Quit"){
		window.location="MainMenu.html";
	}else{
		document.getElementById("ModalOverlay").style.visibility="hidden";
		document.getElementById("Scoreboard").style.visibility="hidden";
		document.getElementById("PlyOneScbdBox").style.visibility="hidden";
		document.getElementById("PlyTwoScbdBox").style.visibility="hidden";
		document.getElementById("PlyThreeScbdBox").style.visibility="hidden";
		document.getElementById("PlyFourScbdBox").style.visibility="hidden";
		document.getElementById("PlyFiveScbdBox").style.visibility="hidden";
		document.getElementById("PlySixScbdBox").style.visibility="hidden";
	}
}
function QuitGame(){
	SetGame("nil");
	window.location="MainMenu.html";
}
-*/