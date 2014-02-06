function Client(name){
	this.Name=name;
	this.ConnectTo=function ConnectTo(serv){
		//this.Host=serv;
		serv.Clients.push(this);
	}
	this.SendToHost=function SendToHost(msg,args){
		
	}
	this.ReceiveFromHost=function ReceiveFromHost(msg,args){
		if(msg=="LOAD_PAGE_COMMAND"){
			this.LoadPage(args[0]);
		}
	}
	this.LoadPage=function LoadPage(name){
		window.location=name;
	}
}