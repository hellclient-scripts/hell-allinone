(function (App) {
    let basicstate = Include("state/basicstate.js")
    let State=function(){
        basicstate.call(this)
        this.ID="init"
    }
    State.prototype = Object.create(basicstate.prototype)
    State.prototype.Enter=function(context,oldstatue){
        basicstate.prototype.Enter.call(this,context,oldstatue)
        world.Note("初始化状态")
        App.ChangeState("manual")
    }
    State.prototype.OnEvent=function(context,event,data){
    }
    return State
})(App)