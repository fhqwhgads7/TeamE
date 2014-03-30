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
		if (this.getAttribute("onmouseover") == null)
			playSound(GameSounds.ButtonHover);
		else if (((this.getAttribute("onmouseover")).toString().indexOf("playSound") <= -1) && ((this.getAttribute("onmouseover")).toString().indexOf("noSound") <= -1))
			playSound(GameSounds.ButtonHover);
	});
	$(":button.Standard").click( function(){
		if (this.getAttribute("onclick") == null)
			playSound(GameSounds.ButtonSelect);
		else if (((this.getAttribute("onclick")).toString().indexOf("playSound") <= -1) && ((this.getAttribute("onclick")).toString().indexOf("noSound") <= -1))
			playSound(GameSounds.ButtonSelect);
	});
} 
function noSound(){}
function GameObject(name){
	this.Name=name;
	this.LoadGame=function(id){
		alert("you selected to load "+id+" game!");
	}
}
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
}
var NumberNameTable={
	1:"One",
	2:"Two",
	3:"Three",
	4:"Four",
	5:"Five",
	6:"Six"
}
var theTips=[
	"Don't drink and drive &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Don't fail too hard or else flying monkeys will appear out of nowhere and eat your face. &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Try the salad; it's delicious. &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp If you lose your entire investment on a product with no designers, testers, or developers, it's probably your own fault. &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Lisa needs braces.&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspYOU MUST RECOVER &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Innovation requires taking risks. &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp The more risks you take, the higher your chances of success will be. &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Make a product!&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Don't die! &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspNineteen!                                                                  2+2 = Fish!&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 		&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspEmployees will cost money over time. Produce a profitable product to gain it back!"
]
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
}
function playSound(sound){
	var theSound = new Audio(sound);
	theSound.volume = 0.5;
	theSound.play();
}
function getTimeOfDay(x){
	timeOfDay = "";
    if(x>=5 && x<9)
	{
        $("#MainBackground").css("background-image", 'url(../images/background_morning_1.jpg)');
		timeOfDay = "Morning";
	}
    else if(x>=9 && x<15)
	{
        $("#MainBackground").css("background-image", 'url(../images/background_noon_1.jpg)');
		timeOfDay = "Noon";
    }
    else if(x>=15 && x<19)
	{
        $("#MainBackground").css("background-image", 'url(../images/background_afternoon_1.jpg)');
		timeOfDay = "Afternoon";
    }
    else if(x>=19 && x<22)
	{
        $("#MainBackground").css("background-image", 'url(../images/background_evening_1.jpg)');
		timeOfDay = "Evening";
    }
    else
	{
        $("#MainBackground").css("background-image", 'url(../images/background_night_1.jpg)');
		timeOfDay = "Night";
    }                   
	return timeOfDay;
}
function MakeBGM(){	
	var audioArray = document.getElementsByClassName('playsong');
		
	//document.write(audioArray.length);
		var i = 0;
		var nowPlaying = audioArray[i];
		nowPlaying.load();
		nowPlaying.play();
		//alert("hi");
		/*$('.play').on('click', function() {
			nowPlaying.play();
		});
		
		$('.stop').on('click', function() {
			nowPlaying.pause();
		});
		
		$('.next').on('click', function() {*/
		//alert(audioArray.length);
		$('#player').on('ended', function(){
    // done playing
			//alert("Player stopped");
			//alert(i);
			/*$.each($('audio.playsong'), function(){
				this.pause();
			});
			
			if(i>=audioArray.length-1){
				i=0;
			}
			else{
				i++;
			}*/
			
			//document.write(audioArray.length);
			nowPlaying = audioArray[1];
			nowPlaying.load();
			nowPlaying.play();
			
			$('#player2').on('ended', function(){
			
				nowPlaying = audioArray[2];
				nowPlaying.load();
				nowPlaying.play();
			});
			//nowPlaying.pause();
		});	
}

//Backgrounds are "Menu", "InGame", "TimeRunningOut", and "GameOver"
function changeCurrentBGM(theSong){
	localStorage.setItem("CurrentBGM", theSong);
}

//-- CLASS DEFINITIONS --//
function Product(player,name,category,sub,color){
	var newProduct=new Object();
	newProduct.ClassName="PRODUCT";
	newProduct.Name=name;
	newProduct.Category=category;
	newProduct.SubCategory=sub;
	newProduct.Color=color;
	newProduct.IdeaStrength=0;
	newProduct.DesignStrength=0;
	newProduct.BuildStrength=0;
	newProduct.TestingStrength=0
	newProduct.Volatility=1; //The chance of the product breaking (1=100%)
	newProduct.Phase="nil";
	newProduct.turnsInSamePhase=0;
	newProduct.PhaseAtStartOfTurn="nil";
	newProduct.justStarted=true;
	newProduct.hasPrototype=false;
	newProduct.readyToDeploy=false;
	newProduct.isANewProduct=true; //This is for patenting-related reasons.
	if(player != null){
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
	}
	return newProduct;
}
function Player(game,name,type,color){
	var newPlayer=new Object();
	newPlayer.ClassName="PLAYER";
	newPlayer.Name=name;
	newPlayer.Color=color;
	newPlayer.Type=type;
	newPlayer.Products=new Array();
	newPlayer.NumProducts=0;
	newPlayer.NumDevs=0;
	newPlayer.NumQA=0;
	newPlayer.NumCreative=0;
	newPlayer.Money=2000;
	newPlayer.LastDisplayedMoney=newPlayer.Money;
	newPlayer.TriggeredEvents=new Array();
	if(game != null){
		newPlayer.ParentGame=game;
		game.Players.push(newPlayer);
		game.NumPlayers=game.Players.length;
		newPlayer.Number=game.NumPlayers-1;
		newPlayer.GlobalID=newPlayer.Number;
	}else{
		alert("Created player without a parent game!");
	}
	newPlayer.toString = function () {
		return newPlayer.ClassName+" "+newPlayer.GlobalID+": "+newPlayer.Name+", "+newPlayer.Type+", "+newPlayer.Color;
	}
	if(newPlayer.Type=="Computer"){
		newPlayer.VIMemory=new Object();
		newPlayer.VIMemory.Products=new Array();
		newPlayer.VIMemory.Money=2000;
		newPlayer.VIMemory.Name=name;
		newPlayer.VIMemory.Color=color;
		newPlayer.VIMemory.NumDevs=0;
		newPlayer.VIMemory.NumQA=0;
		newPlayer.VIMemory.NumCreative=0;
	}
	newPlayer.TurnInit=function(){
		if(newPlayer.Type=="Player"){return;}
		VI_Begin(newPlayer);
	}
	return newPlayer;
}
function Game(id){
	var newGame=new Object();
	newGame.ClassName="GAME_OBJECT";
	newGame.ID=id;
	newGame.Players=new Array();
	newGame.NumPlayers=0;
	newGame.PlayerProducts=new Array();
	newGame.CurrentPlayer=null;
	newGame.CurrentPlayerNum=0;
	newGame.CurrentRound=0;
	newGame.PatentTracker=null;
	newGame.Settings={
		Difficulty:null,
		CPUIntelligence:null,
		PatentingEnabled:null,
		NumberOfRounds:null
	}
	newGame.GameState="Uninitialized"; // this game-state is going to become very important when we start the networking
	newGame.toString=function(){
		return newGame.ClassName+" "+this.ID.toString();
	}
	return newGame;
}
//$(document).on('mousemove',function(e){
//	$("#ContentContainer").css({
//	   left:-e.pageX/100+3,
//	   top:-e.pageY/100+2
//	});
//});