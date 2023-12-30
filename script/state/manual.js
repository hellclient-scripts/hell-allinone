(function (App) {
    let basicstate = Include("state/basicstate.js")
    let StateManual = function () {
        basicstate.call(this)
        this.ID = "manual"
    }
    StateManual.prototype = Object.create(basicstate.prototype)
    StateManual.prototype.Enter = function (Context, newstatue) {
        App.Raise("manual")
        world.Note("进入手动模式")
        Userinput.Popup("", "进入手动模式", "可以点击输入框左侧的小人图标选择下一步的动作", "info")
        let cmd = GetVariable("manual_mode_cmd")
        if (cmd) {
            App.Send(cmd)
        }
    }
    StateManual.prototype.OnEvent = function (context, event, data) {
        switch (event) {
            case "combat.fighting":
                Note("被叫杀，自动反击")
                App.Core.Combat.NewCounterCombat()
                break
            case "move.wrongway":
                App.Data.Room.ID = ""
                break
        }
    }
    return StateManual
})(App)