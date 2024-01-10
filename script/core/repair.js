(function (App) {
    const DefaultDurabilityMin = 25
    const DefaultGold = 150
    App.Core.Repair = {}
    App.Core.Repair.Data = {
    }
    App.Core.Repair.Settings = {}
    App.Core.Repair.InitSettings = function () {
        App.Core.Repair.Settings = {
            DurabilityMin: DefaultDurabilityMin,
            Gold:DefaultGold,
            ToRepair: [],
        }
    }
    App.Core.Repair.InitSettings()
    App.Core.Repair.CurrentDurability = -1
    //^耐 久 值 : (\d+)/(\d+)$
    App.Core.Repair.OnDurability = function (name, line, wildcards) {
        App.Core.Repair.CurrentDurability = (wildcards[0] - 0) * 100 / (wildcards[1] - 0)
    }
    App.Core.Repair.Check = function (wpid) {
        App.Core.Repair.CurrentDurability = -1
        App.Send('l ' + wpid)
        App.Response('core', 'durability', wpid)
    }
    App.Core.Repair.DoCheck = function (wpid) {
        App.Commands([
            App.NewCommand('function', function () {
                App.Core.Repair.Check(wpid)
                App.Next()
            }),
            App.NewCommand('nobusy')
        ]).Push()
        App.Next()
    }
    App.Core.Repair.OnResponse = function (data) {
        if (data) {
            App.Core.Repair.Data[data] = App.Core.Repair.CurrentDurability
        }
        App.Core.Repair.CurrentDurability = -1
    }
    App.Core.Repair.CheckAll=function(){
        App.Core.Cooldown.Update('core.durability')
        App.Core.Repair.Data = {}
        App.Core.Repair.Load()
        if (App.Core.Repair.Settings.ToRepair.length) {
            App.Response('core', 'durability', '')
            for (var i = 0; i < App.Core.Repair.Settings.ToRepair.length; i++) {
                let wpid = App.Core.Repair.Settings.ToRepair[i]
                App.Core.Repair.Data[wpid] = -1
                App.Send('l ' + wpid)
                App.Response('core', 'durability', wpid)
            }
        }
    }
    App.Core.Repair.DoCheckAll = function () {
        App.Commands([
            App.NewCommand('function', function () {
                App.Core.Repair.CheckAll()
                App.Next()
            }),
            App.NewCommand('nobusy'),
        ]).Push()
        App.Next()
    }
    App.Bind('Response.core.durability', 'App.Core.Repair.OnResponse')
    App.Core.Repair.Load = function () {
        let actions = App.LoadActions(GetVariable('repair'))
        App.Core.Repair.InitSettings()
        for (var i = 0; i < actions.length; i++) {
            let action = actions[i]
            switch (action.Command) {
                case '#min':
                    let min = action.Data - 0
                    if (!isNaN(min)) {
                        App.Core.Repair.Settings.DurabilityMin = min
                    }
                    break
                case '#gold':
                    let gold = action.Data - 0
                    if (!isNaN(gold)) {
                        App.Core.Repair.Settings.Gold = gold
                    }
                    break
                case '':
                    if (action.Data) {
                        App.Core.Repair.Settings.ToRepair.push(action.Data)
                    }
                    break
            }
        }
    }
    App.Core.Check.RegisterCallback('core.durability',60000,'App.Core.Repair.CheckAll')
})(App)