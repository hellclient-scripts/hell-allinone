(function (App) {
    let basicstate = Include("state/basicstate.js")
    let State=function(){
        basicstate.call(this)
        this.ID="ready"
        this.Handler=null
    }
    State.prototype = Object.create(basicstate.prototype)
    State.prototype.Enter=function(context,newstatue){
        basicstate.prototype.Enter.call(this,context,newstatue)
        if (App.Core.Inited){
            this.Handler()
            return
        }
        App.Core.Init()
    }
    State.prototype.OnEvent=function(context,event,data){
        switch(event){
            case "inited":
                this.Handler()
            break
            default:
                basicstate.prototype.OnEvent.call(this,context,event,data)
        }
    }
    return State
})(App)