(function(){
    let Move=function(navigator,goal){
        this.Navigator=navigator
        this.Goal=goal
    }
    Move.prototype.OnArrive=function(){
        this.Goal.OnArrive(this)
    }
    Move.prototype.DoStep=function(){
        let cmd=this.Navigator.Current
        if (cmd==null){
            this.OnFinish()
            return
        }
        App.Send(cmd)
    }
    Move.prototype.OnFinish=function(){
        App.Next()
    }
    Move.prototype.OnFail=function(){
        App.Fail()
    }
    return Move
})()