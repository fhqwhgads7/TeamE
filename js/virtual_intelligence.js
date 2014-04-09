// this is a somewhat awkward system to make delayed real-time simulation of a player (virtual intelligence) WITHOUT blocking the rest of the program. JS doesn't have multithreading :/
var self;
var ActionQue=[];
var VISpeed=0.5
var NAEMS=["Win","The Awesome Auger","The Big City Slider Station","DC Snowboards","The Ding King","The DualSaw","Engrave-It","ESPN360","The EZ Bundler","The EZ Crunch Bowl","Files Away","The Gopher","The Grabit","The Grater Plater","Green Now!","The Grip Wrench","The Handy Switch","The Hercules Hook","iCan Health Insurance","Impact Gel","The iTie","The Jupiter Jack","Kaboom!","Mighty Mendit","Mighty Shine","Mighty Putty","Mighty Tape","Orange Glo","OxiClean","The Quick Chop","The Samurai Shark","Tool Band-It","The Turbo Tiger","The Ultimate Chopper","The WashMatik","What odor?","Zorbeez","The Slap Chop","ShamWow","The Schticky"]; // R.I.P. Mays
function VI_Begin(ply){
	self=ply;
	self.VIMemory.Money=parseInt($("#CurPlyMoney").text());
	self.VIMemory.NumCreative=parseInt($("#CurPlyDsgns").text());
	self.VIMemory.NumDevs=parseInt($("#CurPlyDevs").text());
	self.VIMemory.NumQA=parseInt($("#CurPlyTsts").text());
	VI_Logic();
}
function VI_Logic(){
	if(self.VIMemory.NumQA==0){
		VI_Support_MoreEmployees();
	}
	if(self.VIMemory.Products.length==0){
		VI_Support_NewProduct();
	}else{
		self.VIMemory.Products.forEach(function(prod){
			var Id;
			$(".ProductDisplayItem").each(function(ind,val){
				$(this).trigger("click");
				if($("#ProdDisplayName").text()==prod){
					Id=$(this).attr("id");
				}
			});
			ActionQue.push([Id,null,200]);
			// now for product logic;
			if(Math.random()<0.33){
				ActionQue.push(["CurProdAdvanceButton",null,200]);
			}
		});
	}
	if(Math.random()<0.2){
		VI_Support_NewProduct();
	}
	if(Math.random()<0.2){
		VI_Support_MoreEmployees();
	}
	VI_End();
}
function VI_End(){
	var Time=0;
	setTimeout(function(){
		$("#EventButton").trigger("click");
		$("#TriggerButton").trigger(":click");
	},100);
	ActionQue.forEach(function(action){
		Time=Time+action[2]/VISpeed;
		setTimeout(function(){
			if(typeof(action[0]=="string")){
				if(action[1]){
					$("#"+action[0]).val(action[1]);
				}else{
					$("#"+action[0]).trigger("click");
				}
			}else if(typeof(action[0])=="number"){
				if(action[0]==1){
					VI_Support_SetCat();
				}else if(action[0]==2){
					VI_Support_SetSubCat();
				}
			}else{
				alert(typeof(action[0]));
			}
		},Time);
	});
	setTimeout(function(){
		ActionQue=[]; // wipe the action que
		$("#EndTurnBtn").click();
		$("#ControlLock").hide();
	},Time+500/VISpeed);
}
function VI_Support_NewProduct(){
	var Naem=NAEMS[Math.round(Math.random()*NAEMS.length-1)];
	ActionQue.push(["new-product-button",null,200]);
	ActionQue.push(["NewProdName",Naem,750]);
	ActionQue.push([1,null,150]);
	ActionQue.push([2,null,150]);
	ActionQue.push(["CreateNewProdConfirm",null,500]);
	self.VIMemory.Products.push([Naem,new Date().getTime()]);
}
function VI_Support_MoreEmployees(){
	var NewQA=Math.round(Math.random()*Math.random()*10);
	var NewCreative=Math.round(Math.random()*Math.random()*10);
	var NewDevs=Math.round(Math.random()*Math.random()*10);
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
	alert("WHY DOESN'T THIS WORK");
	document.getElementById("NewProductCategory").selectedIndex=Math.round(Math.random(0,5));
}
function VI_Support_SetSubCat(){
	alert("DAMNIT");
	document.getElementById("NewProductSubCategory").selectedIndex=Math.round(Math.random(0,3));
}