(function(){
    var Step=function(command,target){
        this.Target=target?target:""
        let data= SplitN(command,"//",2)
        this.Command=data[0]
        this.Comment=null
        if (data.length>1){
            this.Comment=data[1]
        }
        
    }
    Step.prototype.SetTarget=function(target){
        this.Target=target?target:""
    }
    return Step
})()