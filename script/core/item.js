(function (App) {
    App.Core.Item = {}
    App.Core.Item.Food = { Name: "Gan liang", ID: "gan liang", Key: "gan liang" }
    App.Core.Item.Water = { Name: "shui dai", ID: "shui dai", Key: "shui dai" }
    App.Eat = function () {
        App.Send('eat ' + App.Core.Item.Food.ID)
        App.Send('drink ' + App.Core.Item.Water.ID)
    }
    App.Core.Item.Buy = function (key) {
        let item = App.Info.Items[key]
        if (!item) {
            throw '道具 ' + key + '未注册'
        }
        let cmds = []
        if (App.Core.Inv.Items.Money < item.Gold) {
            let diff = item.Gold - App.Core.Inv.Items.Money
            let cash = Math.floor(diff / 10)
            cmds.push(App.NewCommand("to", App.Core.Move.NewMove([App.Info.Rooms.Bank])))
            cmds.push(App.NewCommand("nobusy"))
            if (cash) {
                cmds.push(App.NewCommand("do", "qu " + cash + " cash"))
                cmds.push(App.NewCommand("nobusy"))
                cmds.push(App.NewCommand("delay", 1))
            }
            if (diff > (cash * 10)) {
                cmds.push(App.NewCommand("do", "qu " + (diff - (cash * 10)) + " gold"))
                cmds.push(App.NewCommand("nobusy"))
                cmds.push(App.NewCommand("delay", 1))
            }
        }
        switch (item.Type) {
            case 'buy':
                cmds.push(App.NewCommand("to", App.Core.Move.NewMove([item.Location])))
                cmds.push(App.NewCommand("nobusy"))
                cmds.push(App.NewCommand("do", item.Data))
                cmds.push(App.NewCommand("do", "i"))
                cmds.push(App.NewCommand("nobusy"))
                cmds.push(App.NewCommand("delay", 1))

                break
            default:
                throw '未知的道具类型' + item.Type
        }
        App.Commands(cmds).Push()
        App.Next()
    }
})(App)