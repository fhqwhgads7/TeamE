function Server(){
	this.Clients=[];
	this.ReceiveFromClient=function ReceiveFromClient(name,msg,args){
		if(msg=="INITIALIZATION_REQUEST"){
			this.SendToClient(name,"LOAD_PAGE_COMMAND",["TitlePage.html"]);
		}
	}
	this.SendToClient=function SendToClient(name,msg,args){
		for(var i=0;i<this.Clients.length;i++){
			if(this.Clients[i].Name==name){
				this.Clients[i].ReceiveFromHost(msg,args);
			}
		}
	}
}