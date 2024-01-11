(function (App) {
    let Command = Include("include/command.js")
    let Money = function (data) {
        Command.call(this, data)
    }
    Money.prototype = Object.create(Command.prototype)
    Money.prototype.CommandID = "money"
    Money.prototype.Push = function () {
        let data = this.Data
        App.NewCommand('function', function () {
            App.Core.PrepareMoney(data - 0)
        }).Push()
    }
    return Money
}(App))