function GlobalInitialize(){
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
function checkOptions(){
	//Checks if 'GameDifficulty' is 'EASY', 'NORMAL', 'HARD', or 'LUNATIC'. Sets to 'NORMAL' if otherwise.
	if (!((localStorage.getItem('GameDifficulty') == 'EASY') || (localStorage.getItem('GameDifficulty') == 'NORMAL') || (localStorage.getItem('GameDifficulty') == 'HARD') || (localStorage.getItem('GameDifficulty') == 'LUNATIC')))
		localStorage.setItem('GameDifficulty','NORMAL');
	//Checks if 'CPUIntelligence' is 'BEGINNER', 'STANDARD', or 'EXPERT'. Sets to 'STANDARD' if otherwise.
	if (!((localStorage.getItem('CPUIntelligence') == 'BEGINNER') || (localStorage.getItem('CPUIntelligence') == 'STANDARD') || (localStorage.getItem('CPUIntelligence') == 'EXPERT')))
		localStorage.setItem('CPUIntelligence','STANDARD');
	//Checks if 'NumberOfRounds' is 40, 45, 50, 55, or 60. Sets to '40' if otherwise.
	if (!((parseInt(localStorage.getItem('NumberOfRounds'))/5 >= 8)&&(parseInt(localStorage.getItem('NumberOfRounds'))/5 <= 12)) || localStorage.getItem('NumberOfRounds')==null)
		localStorage.setItem('NumberOfRounds','40');
	//Checks if 'PatentingEnabled' is 'true' or 'false'. Sets to 'true' if otherwise.
	if (!((localStorage.getItem('PatentingEnabled') == 'true') || (localStorage.getItem('PatentingEnabled') == 'false')))
		localStorage.setItem('PatentingEnabled','true');
	//Dummied out: Checks if 'RetirementMinimum' is 401000, 500000, 600000, 700000, 800000, 900000, 1000000, or 999999999. Sets to '401000' if otherwise.
	//if (!((localStorage.getItem('RetirementMinimum') == '401000') || ((parseInt(localStorage.getItem('RetirementMinimum'))/100000 >= 5) && (parseInt(localStorage.getItem('RetirementMinimum'))/100000 <= 10)) || (localStorage.getItem('RetirementMinimum') == '999999999')))
	//	localStorage.setItem('RetirementMinimum','401000');
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
function Product(player,name,category,sub,color){
	this.Name=name;
	this.Category=category;
	this.SubCategory=sub;
	this.Color=color;
	this.IdeaStrength=0;
	this.DesignStrength=0;
	this.BuildStrength=0;
	this.Phase="nil";
	if(player != null){
		player.Products.push(this);
		this.Number=player.Products.length-1;
		this.OwnerNumber=player.Number;
		player.NumProducts=player.Products.length;
	}
	this.DisplayItemID="nil";
	this.toString = function () {
		return this.Name + ', ' + this.Category + ', ' + this.SubCategory + ', ' + this.Color;
	}
	return this;
}
function Back(){
    day=new Date()
    x=day.getHours()
    if(x>=0 && x<8) {
             var body = document.getElementsByTagName('body')[0];
                               body.style.backgroundImage = 'url(background_morning_1.jpg)';
                           
	                       }
                           else if(x>=8 && x<11) {
                               var body = document.getElementsByTagName('body')[0];
                               body.style.backgroundImage = 'url(background_noon_1.jpg)';
                           }
                           else if(x>=11 && x<18) {
                               var body = document.getElementsByTagName('body')[0];
                               body.style.backgroundImage = 'url(background_afternoon_1.jpg)';
                           }
                           else if(x>=18 && x<24) {
                               var body = document.getElementsByTagName('body')[0];
                               body.style.backgroundImage = 'url(background_night_1.jpg)';
                           }
	                   
			}