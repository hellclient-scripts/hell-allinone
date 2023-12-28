(function(){
    var StateContext=function(){
        this.LastState=null
        this.State=null
    }
    StateContext.prototype.ChangeState=function(newstatue){
        let old=this.State
        if (this.State){
            this.State.Leave(this,newstatue)
            this.State.Groups.forEach(function(group){
                world.EnableTriggerGroup(group,false)
            })
        }
        this.State=newstatue
        this.LastState=old
        this.State.Enter(this,old)
        this.State.Groups.forEach(function(group){
            world.EnableTriggerGroup(group,true)
        })
    }
    StateContext.prototype.RollbackState=function(newstatue){
        if (this.State){
            this.State.Groups.forEach(function(group){
                world.EnableTriggerGroup(group,false)
            })
        }
        this.State=newstatue
        this.State.Groups.forEach(function(group){
            world.EnableTriggerGroup(group,true)
        })
    }

    StateContext.prototype.OnEvent=function(event,data){
        if (this.State){
            this.State.OnEvent(this,event,data)
        }
    }
    
    return StateContext
})()