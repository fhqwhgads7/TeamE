function VirtualIntelligenceThink(self){
	$("#ControlLock").show();
	self.VIMemory.Money=parseInt($("#CurPlyMoney"));
	self.VIMemory.NumCreative=parseInt($("#CurPlyDsgns"));
	self.VIMemory.NumDevs=parseInt($("#CurPlyDevs"));
	self.VIMemory.NumQA=parseInt($("#CurPlyTsts"));
	if(self.VIMemory.Products.length==0){
		$("#new-product-button").click();
		setTimeout(function(){
			$("#NewProdName").val("Win-o-tron 9000");
			setTimeout(function(){
				$("#CreateNewProdConfirm").click();
				setTimeout(function(){
					$("#EndTurnBtn").click();
					$("#ControlLock").hide();
				},300);
			},300);
		},300);
	}
}