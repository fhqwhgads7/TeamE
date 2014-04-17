/*-----------------------------------------------------------------------------
	PARSE.COM
	email: ajmurill@asu.edu
	password: Reinforcements1!
	username: EntrepreneurshipCST316
	our data: https://www.parse.com/apps/entrepreneurshipgame/collections
		application ID: xjUxyY8bghFGuSnM3ptEZkV3BiWOlD3VhkRLt4kz
		client key: 1EhZ7nrrYMz5BVp58jBXMf07eU8xW2k4LDFFxIVL
		net key: 8XJD3yidSyRUuDwPvT8l7oTKpmwKaHwzgQHjIRaE
		javascript key: iZCS2S7ZuWn9keMoooLaHMlB7HMXpcqD1M60JVjp
		REST API key: C1GSXmeSV6oVWvLjZ3rA1j5Ey4RsmnMHHxlFQTip
		master key: lOqdFFVjQViO7PCp7EtH86i8DXSTrH6SedXny4Rr
-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------
	pubnub.COM
	email: ryan.lane@asu.edu
	password: Reinforcements1!
	our data: 
		subscribe key: sub-c-52dd673e-b2ba-11e3-aab4-02ee2ddab7fe
		publish key: pub-c-d3ce4b6d-4960-4db3-a8be-29709342456b
-----------------------------------------------------------------------------*/
function GlobalInitialize(){
	
	$("#ContentContainer").children().attr("disabled",true);
	setTimeout(function(){
		$("#ContentContainer").children().attr("disabled",false);
	},250);
	setTimeout(function(){
		$("#ContentContainer").css("top","0px");
		$("#ContentContainer").css("opacity","1.0");
	},1);
	if (document.URL.indexOf("game_board.html") < 0)
	{
		setTimeout(function(){
			playSound(GameSounds.PageLoad);
		},3);
		setTimeout(function(){
			playSound(GameSounds.PageDoneLoading);
		},333);
	}
	$(":button.Standard").mouseenter( function(){
		if (!(this.getAttribute("onmouseover"))){
			playSound(GameSounds.ButtonHover);
		}
		else if (((this.getAttribute("onmouseover")).toString().indexOf("playSound") <= -1) && ((this.getAttribute("onmouseover")).toString().indexOf("noSound") <= -1)){
			playSound(GameSounds.ButtonHover);
		}
	});
	$(":button.Standard").click( function(){
		if (!(this.getAttribute("onclick"))){
			playSound(GameSounds.ButtonSelect);
		}
		else if (((this.getAttribute("onclick")).toString().indexOf("playSound") <= -1) && ((this.getAttribute("onclick")).toString().indexOf("noSound") <= -1)){
			playSound(GameSounds.ButtonSelect);
		}
	});
} 
function noSound(){}
function SwitchToPage(page){
	$("#ContentContainer").css("top","100px");
	$("#ContentContainer").css("opacity","0.0");
	setTimeout(function(){
		playSound(GameSounds.PageSwitch);
	},50);
	setTimeout(function(){
		window.location=page;
	},250);
}
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
};
var NumberNameTable={
	1:"One",
	2:"Two",
	3:"Three",
	4:"Four",
	5:"Five",
	6:"Six"
};
var Tips=[
	"Innovation requires taking risks.",
	"The more risks you take, the higher your chances of success will be.",
	"Employees will cost money over time. Produce a profitable product to gain it back!",
	"One way to secure your assets is by patenting a product. Be sure to patent a good product, though!",
	"Pay attention to current events to help you with decision making!",
	"It takes some time to prototype or deploy a product. Patience!",
	"Don't leave a product in the same outer phase for too long. Spending too much time on one thing produces diminishing results!",
	"It takes time to build a prototype or deploy a product; this is why progression from these phases is not immediate.",
	"Try to hold on to your employees; it costs money just to get them started!",
	"If a product fails out on the market, don't panic! Failure is but a learning experience, a path to success.",
	"Don't leave too many products in the same outer phase. Multitasking is not the easiest thing to do.",
	"Different kinds of products have different characteristics. Some are riskier or more expensive than others, but it can be easy to build their idea strength.",
	"A stable product is a successful product. Testing is key! There are three phases for it.",
	"Be sure to keep an eye on the other players and stay ahead of the competition.",
	"The Maintenance phase is your target.",
	"Make a product!",
	"Those arrows below your player window can turn the board for easier readability.",
	"Don't pursue so many ventures you can't click on any of them to view their details!",
	"If you lose your entire investment on a product without taking the time to refine its idea or design, develop, or test it, it's probably your own fault.",
	"Don't drink and drive.",
	"Don't die. That hurts.",
	"Try the salad; it's delicious.",
	"YOU MUST RECOVER",
	"Lisa needs braces!",
	"2 + 2 = Fish!",
	"Nineteen!",
	"Don't fail too hard or else flying monkeys will appear out of nowhere and eat your face.",
	"If you can read this, you have mastered visual recognition and probably don't need glasses. Or are wearing glasses already."
];
var GameSounds={
	ButtonHover: '../sounds/sfx/button_hover.wav',
	ButtonSelect: '../sounds/sfx/button_select.wav',
	PageSwitch: '../sounds/sfx/switchpage.wav',
	PageLoad: '../sounds/sfx/loadpage.wav',
	PageDoneLoading: '../sounds/sfx/pagedoneloading.wav',
	GainMoney: '../sounds/sfx/gainmoney.wav',
	LoseMoney: '../sounds/sfx/losemoney.wav',
	ProductPlacement: '../sounds/sfx/product.wav',
	AdvanceProduct: '../sounds/sfx/advance.wav',
	NextTurn: '../sounds/sfx/nextplayersturn.wav',
	NextRound: '../sounds/sfx/nextround.wav',
	Message: '../sounds/sfx/message.wav',
	Event: '../sounds/sfx/event.wav',
	Wrong_Low: '../sounds/sfx/wrong_1.wav',
	Wrong_Med: '../sounds/sfx/wrong_2.wav',
	Wrong_BAD: '../sounds/sfx/wrong_3.wav',
	GameOver: '../sounds/sfx/gameover.wav',
	MinorFail: '../sounds/sfx/minor_fail.wav'
};
function playSound(sound){
	if (localStorage.getItem("SFXMute")!=="Muted"){
		var SFXVolume = parseInt(localStorage.getItem("SFXVolume"), 10);
		if (isNaN(SFXVolume)){
			SFXVolume = 50;
		}
		var theSound = new Audio(sound);
		theSound.volume = SFXVolume/100;
		theSound.play();
	}
}
function getTimeOfDay(x){
	timeOfDay = "";
    if(x>=5 && x<9) {
        $("#MainBackground").css("background-image", 'url(../images/background_morning_1.jpg)');
		timeOfDay = "Morning";
	}
    else if(x>=9 && x<15) {
        $("#MainBackground").css("background-image", 'url(../images/background_noon_1.jpg)');
		timeOfDay = "Noon";
    }
    else if(x>=15 && x<19) {
        $("#MainBackground").css("background-image", 'url(../images/background_afternoon_1.jpg)');
		timeOfDay = "Afternoon";
    }
    else if(x>=19 && x<22) {
        $("#MainBackground").css("background-image", 'url(../images/background_evening_1.jpg)');
		timeOfDay = "Evening";
    }
    else {
        $("#MainBackground").css("background-image", 'url(../images/background_night_1.jpg)');
		timeOfDay = "Night";
    }                   
	return timeOfDay;
}

//Backgrounds are "MainMenu", "InGame", "TimeRunningOut", and "FinalScores"
function changeCurrentBGM(theSong){
	localStorage.setItem("CurrentBGM", theSong);
}

//-- CLASS DEFINITIONS --//
function Product(player,name,category,sub,color){
	var newProduct={};
	newProduct.ClassName="PRODUCT";
	newProduct.Name=name;
	newProduct.Category=category;
	newProduct.SubCategory=sub;
	newProduct.Color=color;
	newProduct.IdeaStrength=0;
	newProduct.DesignStrength=0;
	newProduct.BuildStrength=0;
	newProduct.TestingStrength=0;
	newProduct.Volatility=1; //The chance of the product breaking (1=100%)
	newProduct.Phase="nil";
	newProduct.turnsInSamePhase=0;
	newProduct.PhaseAtStartOfTurn="nil";
	newProduct.justStarted=true;
	newProduct.hasPrototype=false;
	newProduct.readyToDeploy=false;
	newProduct.isANewProduct=true; //This is for patenting-related reasons.
	if(player){
		player.Products.push(newProduct);
		newProduct.Number=player.Products.length-1;
		newProduct.OwnerNumber=player.Number;
		newProduct.Owner=player;
		player.NumProducts=player.Products.length;
		player.ParentGame.PlayerProducts.push(newProduct);
		newProduct.GlobalID=player.ParentGame.PlayerProducts.length-1;
	}else{
		alert("Created product without an owner!");
	}
	newProduct.DisplayItemID="nil";
	newProduct.toString = function () {
		return newProduct.ClassName+" "+this.GlobalID+": "+this.Name+", "+this.Owner.Name+", "+this.Category+", "+this.SubCategory+", "+this.Color;
	};
	return newProduct;
}
function Player(game,name,type,color){
	var newPlayer={};
	newPlayer.ClassName="PLAYER";
	newPlayer.Name=name;
	newPlayer.Color=color;
	newPlayer.Type=type;
	newPlayer.Products=[];
	newPlayer.NumProducts=0;
	newPlayer.NumDevs=0;
	newPlayer.NumQA=0;
	newPlayer.NumCreative=0;
	newPlayer.Money=2000;
	newPlayer.LastDisplayedMoney=newPlayer.Money;
	newPlayer.TriggeredEvents=[];
	newPlayer.isHost=false;
	newPlayer.hasMadeProductThisTurn = false;
	if(game){
		newPlayer.ParentGame=game;
		game.Players.push(newPlayer);
		game.NumPlayers=game.Players.length;
		newPlayer.Number=game.NumPlayers-1;
		newPlayer.GlobalID=newPlayer.Number;
	}
	else{
		alert("Created player without a parent game!");
	}
	newPlayer.toString = function () {
		return newPlayer.ClassName+" "+newPlayer.GlobalID+": "+newPlayer.Name+", "+newPlayer.Type+", "+newPlayer.Color;
	};
	if(newPlayer.Type==="Computer"){
		newPlayer.VIMemory={};
		newPlayer.VIMemory.Money=2000;
		newPlayer.VIMemory.Name=name;
		newPlayer.VIMemory.Color=color;
		newPlayer.VIMemory.NumDevs=0;
		newPlayer.VIMemory.NumQA=0;
		newPlayer.VIMemory.NumCreative=0;
	}
	newPlayer.TurnInit=function(){
		if(newPlayer.Type==="Computer"){
			VI_Begin(newPlayer);
		}
	};
	return newPlayer;
}
function Game(id){
	var newGame={};
	newGame.ClassName="GAME_OBJECT";
	newGame.ID=id;
	newGame.Players=[];
	newGame.NumPlayers=0;
	newGame.PlayerProducts=[];
	newGame.CurrentPlayer=null;
	newGame.CurrentPlayerNum=0;
	newGame.CurrentRound=0;
	newGame.PatentTracker=null;
	newGame.GameType="nil";
	newGame.RandomEvents=[];
	newGame.Settings={
		Difficulty:null,
		CPUIntelligence:null,
		PatentingEnabled:null,
		NumberOfRounds:null
	};
	newGame.GameState="UNINITIALIZED"; // this game-state is going to become very important when we start the networking
	newGame.toString=function(){
		return newGame.ClassName+" "+this.ID.toString();
	};
	return newGame;
}