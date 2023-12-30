(function (App) {
    let basicstate = Include("state/basicstate.js")
    let State=function(){
        basicstate.call(this)
        this.ID="move.step"
    }
    State.prototype = Object.create(basicstate.prototype)
    State.prototype.OnEvent=function(context,event,data){
        switch(event){
            case "core.room.onRoomEnd":
                break
            case "move.retry":
                break
            case "move.wrongway":
                // if (App.Vehicle&&App.Vehicle.OnWrongway){
                //     App.Vehicle.OnWrongway()
                //     return
                // }
                // if (App.Data.Room.MoveRetried>10){
                //     App.Data.Room.ID=""
                //     App.Core.MoveWrongWay(App.GetContext("Move"))
                // }else{
                //     App.Data.Room.MoveRetried++
                //     App.RaiseStateEvent("move.retry")
                // }
            break
            case "move.notallowed":
                Note("无法通过")
                App.Fail()
                break
        }
    }
    State.prototype.Leave=function(context,oldstatue){
        DeleteTemporaryTimers()
    }
    State.prototype.Enter=function(context,oldstatue){
        basicstate.prototype.Enter.call(this,context,oldstatue)
    }
    return State
})(App)