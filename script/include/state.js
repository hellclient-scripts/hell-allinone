(function(){
    var State=function(){
        this.ID=""
        this.Tags={}
        this.Groups=[]
    }
    State.prototype.Enter=function(context,oldstatue){
    }
    State.prototype.Leave=function(context,newstatue){
    }
    State.prototype.OnEvent=function(context,event,data){
    }
    return State
})()