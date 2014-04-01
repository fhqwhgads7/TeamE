// this is a somewhat awkward system to make delayed real-time simulation of a player (virtual intelligence) WITHOUT blocking the rest of the program. JS doesn't have multithreading :/
var self;
var ActionQue=[];
var VISpeed=0.5
function VI_Begin(ply){
	self=ply;
	self.VIMemory.Money=parseInt($("#CurPlyMoney").text());
	self.VIMemory.NumCreative=parseInt($("#CurPlyDsgns").text());
	self.VIMemory.NumDevs=parseInt($("#CurPlyDevs").text());
	self.VIMemory.NumQA=parseInt($("#CurPlyTsts").text());
	VI_Logic();
}
function VI_Logic(){
	if(self.VIMemory.Products.length==0){
		ActionQue.push(["new-product-button",null,200]);
		ActionQue.push(["NewProdName","Win-o-Tron 9000",750]);
		ActionQue.push(["CreateNewProdConfirm",null,500]);
		self.VIMemory.Products.push(["Win-o-Tron 9000"]);
	}else{
		self.VIMemory.CurProdNum=0;
		self.VIMemory.Products.forEach(function(prod){
			alert(prod);
		});
	}
	VI_End();
}
function VI_End(){
	var Time=0;
	ActionQue.forEach(function(action){
		Time=Time+action[2]/VISpeed;
		console.log("scheduling "+action[0]+" to be clicked after "+Time.toString()+" ms");
		setTimeout(function(){
			console.log("clicking "+action[0]);
			if(action[1]){
				$("#"+action[0]).val(action[1]);
			}else{
				$("#"+action[0]).trigger("click");
			}
		},Time);
	});
	setTimeout(function(){
		$("#EndTurnBtn").click();
		$("#ControlLock").hide();
	},Time+500/VISpeed);
}