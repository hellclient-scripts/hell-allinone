(function (App) {
    App.Core.Item = {}
    App.Core.Item.Food = { Name: "Gan liang", ID: "gan liang", Key: "gan liang" }
    App.Core.Item.Water = { Name: "shui dai", ID: "shui dai", Key: "shui dai" }
    App.Eat = function () {
        App.Core.Cooldown.Update('core.eat')
        App.Send('eat ' + App.Core.Item.Food.ID)
        App.Send('drink ' + App.Core.Item.Water.ID)
    }
    App.Core.Item.Buy = function (key) {
        let item = App.Info.Items[key]
        if (!item) {
            throw '道具 ' + key + '未注册'
        }
        let cmds = []
        cmds.push(App.NewCommand('money',item.Gold))
        switch (item.Type) {
            case 'buy':
                cmds.push(App.NewCommand("to", App.Core.Move.NewMove([item.Location])))
                cmds.push(App.NewCommand("nobusy"))
                cmds.push(App.NewCommand("do", item.Data))
                cmds.push(App.NewCommand("do", "i"))
                cmds.push(App.NewCommand("nobusy"))

                break
            default:
                throw '未知的道具类型' + item.Type
        }
        App.Commands(cmds).Push()
        App.Next()
    }
    App.RegisterAlias("eat",'App.Eat')
    App.Core.Check.RegisterSend('core.eat',10000,['#eat'])

})(App)