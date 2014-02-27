function GlobalInitialize(){
	Background();
	$(document).on('mousemove',function(e){
		$("#ContentContainer").css({
		   left:-e.pageX/100+3,
		   top:-e.pageY/100+2
		});
	});
	$(document.body).append('<div id="PageFadeIn"></div>')
	setTimeout(function(){
		$("#PageFadeIn").css("background-color","rgba(128,128,128,0)");
	},1);
	setTimeout(function(){
		$("#PageFadeIn").remove();
	},174);
}
function GameObject(name){
	this.Name=name;
	this.LoadGame=function(id){
		alert("you selected to load "+id+" game!");
	}
}
function SwitchToPage(page){
	$(document.body).append('<div id="PageFadeOut"></div>')
	setTimeout(function(){
		$("#PageFadeOut").css("background-color","rgba(128,128,128,1)");
	},1);
	setTimeout(function(){
		window.location=page;
	},149);
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
function Background(){
    day=new Date()
    x=day.getHours()
    if(x>=5 && x<9)
	{
        $("#MainBackground").css("background-image", 'url(../images/background_morning_1.jpg)')
	}
    else if(x>=9 && x<15)
	{
        $("#MainBackground").css("background-image", 'url(../images/background_noon_1.jpg)')
    }
    else if(x>=15 && x<19)
	{
        $("#MainBackground").css("background-image", 'url(../images/background_afternoon_1.jpg)')
    }
    else
	{
        $("#MainBackground").css("background-image", 'url(../images/background_night_1.jpg)')
    }                   
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
	var newProduct = new Object();
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
		player.Products.push(this);
		newProduct.Number=player.Products.length-1;
		newProduct.OwnerNumber=player.Number;
		newProduct.Owner=player;
		player.NumProducts=player.Products.length;
		player.ParentGame.PlayerProducts.push(this);
		newProduct.GlobalID=player.ParentGame.PlayerProducts.length;
	}else{
		alert("Created product without an owner!");
	}
	newProduct.DisplayItemID="nil";
	newProduct.toString = function () {
		return newProduct.ClassName+" "+this.GlobalID+": "+this.Owner.Name+", "+this.Category+", "+this.SubCategory+", "+this.Color;
	}
	return newProduct;
}
function Player(game,name,type,color){
	var newPlayer = new Object();
	newPlayer.ClassName="PLAYER";
	newPlayer.Name=name;
	newPlayer.Color=color;
	newPlayer.Type=type;
	if(game != null){
		game.Players.push(newPlayer);
		game.NumPlayers=game.Players.length;
		this.Number=game.NumPlayers;
		this.GlobalID=this.Number;
	}else{
		alert("Created player without a parent game!");
	}
	newPlayer.toString = function () {
		return newPlayer.ClassName+" "+newPlayer.GlobalID+": "+newPlayer.Name+", "+newPlayer.Type+", "+newPlayer.Color;
	}
	return newPlayer;
}
function Game(id){
	var newGame = new Object();
	newGame.ClassName="GAME_OBJECT";
	newGame.ID=id;
	newGame.Players={};
	newGame.NumPlayers=0;
	newGame.PlayerProducts={};
	newGame.CurrentPlayer=null;
	newGame.CurrentPlayerNum=0;
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