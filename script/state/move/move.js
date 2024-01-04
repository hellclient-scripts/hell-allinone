(function (App) {
    let basicstate = Include("state/basicstate.js")
    let State=function(){
        basicstate.call(this)
        this.ID="move.move"
    }
    State.prototype = Object.create(basicstate.prototype)
    State.prototype.Leave=function(context,oldstatue){
    }
    State.prototype.Enter=function(context,oldstatue){
        let move=App.GetContext("Move")
        move.DoStep()
    }
    return State
})(App)