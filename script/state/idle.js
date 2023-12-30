(function (App) {
    let basicstate = Include("state/basicstate.js")
    let State=function(){
        basicstate.call(this)
        this.ID="idle"
        this.SN=""
    }
    State.prototype = Object.create(basicstate.prototype)
    State.prototype.OnEvent=function(context,event,data){
        switch(event){
            case "core.state.wait.after":
                if (this.SN==data){
                    App.Next()
                }
            break
            case "stop":
                App.Next()
                break
            default:
                basicstate.prototype.OnEvent.call(this,context,event,data)
        }
    }
    State.prototype.Leave=function(context,oldstatue){
        DeleteTemporaryTimers()
    }
    State.prototype.Enter=function(context,oldstatue){
        basicstate.prototype.Enter.call(this,context,oldstatue)
        let delay=App.GetContext("Delay")
        let sn=world.GetUniqueID()
        this.SN=sn
        world.DoAfterSpecial(delay, 'App.RaiseStateEvent("core.state.wait.after","'+sn+'")', 12);
    }
    return State
})(App)