function GlobalInitialize(){
	Background(new Date().getHours());
	playSound(GameSounds.PageLoad);
	setTimeout(function(){
		$("#ContentContainer").css("top","2px")
	},1);
	setTimeout(function(){
		playSound(GameSounds.PageDoneLoading);
	},333);
	$(":button.Standard").mouseenter( function(){playSound(GameSounds.ButtonHover)});
	$(":button.Standard").click( function(){playSound(GameSounds.ButtonSelect)});
}
function GameObject(name){
	this.Name=name;
	this.LoadGame=function(id){
		alert("you selected to load "+id+" game!");
	}
}
function SwitchToPage(page){
	$("#ContentContainer").css("top","600px")
	setTimeout(function(){
		playSound(GameSounds.PageSwitch);
	},50);
	setTimeout(function(){
		window.location=page;
	},400);
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
	Wrong: '../sounds/sfx/wrong.wav',
	GameOver: '../sounds/sfx/gameover.wav',
	MinorFail: '../sounds/sfx/minor_fail.wav'
}
function playSound(sound){
	new Audio(sound).play();
}
function Background(x){
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
	newProduct.Phase="nil";
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