(function (App) {
    let basicstate = Include("state/basicstate.js")
    let State=function(){
        basicstate.call(this)
        this.ID="core.state.command.commands"
    }
    State.prototype = Object.create(basicstate.prototype)
    State.prototype.Enter=function(context,oldstatue){
        let cmds=App.GetContext("Commands")
        for (var i=cmds.length-1;i>=0;i--){
            cmds[i].Push()
        }
        App.Next()
    }
    return State
})(App)