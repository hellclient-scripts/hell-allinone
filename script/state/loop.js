(function (App) {
    let basicstate = Include("state/basicstate.js")
    let State = function () {
        basicstate.call(this)
        this.ID = "loop"
    }
    State.prototype = Object.create(basicstate.prototype)
    State.prototype.Enter = function (Context, newstatue) {
        App.Next()
    }
    return State
})(App)