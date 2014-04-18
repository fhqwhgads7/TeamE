// this is a somewhat awkward system to make delayed real-time simulation of a player (virtual intelligence) WITHOUT blocking the rest of the program. JS doesn't have multithreading :/
var self;
var ActionQue=[];
var NAEMS=["Win","The Awesome Auger","The Big City Slider Station","DC Snowboards","The Ding King","The DualSaw","Engrave-It","ESPN360","The EZ Bundler","The EZ Crunch Bowl","Files Away","The Gopher","The Grabit","The Grater Plater","Green Now!","The Grip Wrench","The Handy Switch","The Hercules Hook","iCan Health Insurance","Impact Gel","The iTie","The Jupiter Jack","Kaboom!","Mighty Mendit","Mighty Shine","Mighty Putty","Mighty Tape","Orange Glo","OxiClean","The Quick Chop","The Samurai Shark","Tool Band-It","The Turbo Tiger","The Ultimate Chopper","The WashMatik","What odor?","Zorbeez","The Slap Chop","ShamWow","The Schticky"]; // R.I.P. Mays
var VI_WAIT_TIME=1000; // milliseconds before beginning turn actions
var Vi_diff_mult;
var VISpeed;
var VI_DIFFICULTY_MULT_TABLE={
	"BEGINNER":0.75,
	"STANDARD":1,
	"EXPERT":1.25
};
function VI_Begin(ply){
	self=ply;
	Vi_diff_mult=VI_DIFFICULTY_MULT_TABLE[TheGame.Settings.CPUIntelligence];
	self.VIMemory.Money=parseInt($("#CurPlyMoney").text(),10);
	self.VIMemory.NumCreative=parseInt($("#CurPlyDsgns").text(),10);
	self.VIMemory.NumDevs=parseInt($("#CurPlyDevs").text(),10);
	self.VIMemory.NumQA=parseInt($("#CurPlyTsts").text(),10);
	VISpeed = 0.5*Vi_diff_mult;
	setTimeout(function(){
		if (TheGame.GameState === "ACTIVE") {
			VI_CloseThePopUps();
		}
	},50+VI_WAIT_TIME*Number(TheGame.Players.indexOf(self)<=0));
}
function VI_CloseThePopUps(){
	if ($("#QuitDialog").is(":visible")){
		setTimeout(function(){
			VI_CloseThePopUps();
		},VI_WAIT_TIME);
	}
	else{
		if ($("#PopupOverlay").is(":visible")){
			setTimeout(function(){
				if (!ProductsBeingRemoved){
					if ($("#EventDialog").is(":visible")){
						$("#EventButton").trigger("click");
					}
					else if ($("#TriggerDialog").is(":visible")){
						$("#TriggerButton").trigger("click");
					}
				}
			VI_CloseThePopUps();
			},1500);
		}
		else{
			setTimeout(function(){
				VI_Logic();
			},500);
		}
	}
}
function VI_Logic(){
	//ToDo: CPU intelligence is currently more of an aggressiveness multiplier, rather than actual intelligence. Fix this
	if (!ProductsBeingRemoved) {
		var MadeProd=false;
		if(self.VIMemory.NumQA==0){
			VI_Support_MoreEmployees();
		}
		if(self.Products.length<=0){
			VI_Support_NewProduct();
			MadeProd=true;
		}else{
			self.Products.forEach(function(prod){
				var Id;
				$(".ProductDisplayItem").each(function(ind,val){
					if($(this).attr("id").substring(19)==prod.GlobalID){
						$(this).trigger("click");
						Id=$(this).attr("id");
					}
				});
				if (Id){
					ActionQue.push([Id,null,200]);
				}
				// now for product logic;
				if(Math.random()<(0.33*Vi_diff_mult)){
					ActionQue.push(["CurProdAdvanceButton",null,200]);
				}
			});
		}
		if(!MadeProd && (self.Products.length < 9)){
			if(Math.random()<(0.15*Vi_diff_mult)){
				VI_Support_NewProduct();
			}
		}
		if(Math.random()<(0.1*Vi_diff_mult)){
			VI_Support_MoreEmployees();
		}
		setTimeout(function(){
			VI_Execute();
		},VI_WAIT_TIME);
	}
	else {
		setTimeout(function(){
			VI_Logic();
		},500);
	}
}
function VI_PerformAction(TheAction){
	if(TheAction[0]==="FUNC_CALL"){
		TheAction[1]();
	}else{
		if(TheAction[1]){
			$("#"+TheAction[0]).val(TheAction[1]);
		}else if (!($("#"+TheAction[0]).is(":disabled"))){
			$("#"+TheAction[0]).trigger("click");
		}
	}
}
function VI_Execute(){
	if ($("#QuitDialog").is(":visible")){
		setTimeout(function(){
			VI_Execute();
		},VI_WAIT_TIME);
	}
	else {
		if (ActionQue.length > 1){
			setTimeout(function(){
				VI_PerformAction(ActionQue[0]);
				ActionQue.splice(0, 1);
				VI_Execute();
			},ActionQue[0][2]/VISpeed);
		}
		else {
			setTimeout(function(){
				VI_PerformAction(ActionQue[0]);
				ActionQue=[];
				VI_End();
			},ActionQue[0][2]/VISpeed);
		}
	}
}
function VI_End(){
	if ($("#QuitDialog").is(":visible")){
		setTimeout(function(){
			VI_End();
		},VI_WAIT_TIME);
	}
	else {
		setTimeout(function(){
			$("#EndTurnBtn").click();
		},500/VISpeed);
	}
}
function VI_Support_NewProduct(){
	var Naem = NAEMS[Math.round(Math.random()*NAEMS.length)];
	ActionQue.push(["new-product-button",null,200]);
	ActionQue.push(["NewProdName",Naem,750]);
	ActionQue.push(["FUNC_CALL",VI_Support_SetCat,150]);
	ActionQue.push(["FUNC_CALL",VI_Support_SetSubCat,150]);
	ActionQue.push(["CreateNewProdConfirm",null,500]);
}
function VI_Support_MoreEmployees(){
	var NewQA=Math.round(Math.random()*Math.random()*10*Vi_diff_mult);
	var NewCreative=Math.round(Math.random()*Math.random()*10*Vi_diff_mult);
	var NewDevs=Math.round(Math.random()*Math.random()*10*Vi_diff_mult);
	ActionQue.push(["employee_button",null,300]);
	for(var i=0;i<NewQA;i++){
		ActionQue.push(["TesPlus",null,100]);
	}
	for(var i=0;i<NewCreative;i++){
		ActionQue.push(["DesPlus",null,100]);
	}
	for(var i=0;i<NewDevs;i++){
		ActionQue.push(["DevPlus",null,100]);
	}
	ActionQue.push(["EmployeeDoneButton",null,400]);
}
function VI_Support_SetCat(){
	document.getElementById("NewProductCategory").selectedIndex=Math.floor(Math.random()*5);
	$("#NewProductCategory").trigger("change");
}
function VI_Support_SetSubCat(){
	document.getElementById("NewProductSubCategory").selectedIndex=Math.floor(Math.random()*3);
}