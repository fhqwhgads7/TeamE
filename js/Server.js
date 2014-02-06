function GameServer(name){
	this.Clients=[];
	this.Name=name;
	this.ReceiveFromClient=function(name,msg,args){
		if(msg=="INITIALIZATION_REQUEST"){
			this.SendToClient(name,"LOAD_PAGE_COMMAND",["TitlePage.html"]);
		}
	}
	this.SendToClient=function(name,msg,args){
		for(var i=0;i<this.Clients.length;i++){
			if(this.Clients[i].Name==name){
				this.Clients[i].ReceiveFromHost(msg,args);
			}
		}
	}
	this.SaveSelfToCloud=function(){
		var SavedServer=Parse.Object.extend("SavedServer");
		var savedServer=new SavedServer();
		savedServer.save({Name:this.Name,ClientNum:this.Clients.length});
		ServerParseID=savedServer.id;
	}
}