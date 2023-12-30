(function (App) {
    let state = Include("include/state.js")
    let BasicState=function(){
        state.call(this)
    }
    BasicState.prototype = Object.create(state.prototype)
    BasicState.prototype.OnEvent=function(context,event,data){

    }
    return BasicState
})(App)