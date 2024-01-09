(function (App) {
    const DefaultFoodMin = 10
    const DefaultFoodMax = 50
    const DefaultWaterMin = 5
    const DefaultWaterMax = 10
    const DefaultGoldMin = 0
    const DefaultGoldMax = 2000
    const DefaultGoldNormal = 20
    const DefaultSilverMax = 200
    const DefaultSilverNormal = 10
    const DefaultCoinMax = 2000
    let Action = Include("include/action.js")
    App.Core.Inv = {}
    App.Core.Inv.Items = {
        Weight: 0,
        Count: 0,
        Money: 0,
        Gold: 0,
        Cash: 0,
        Food: 0,
        Water: 0,
        Silver: 0,
        Coin: 0,
        List: [],
        Listing: false,
    }
    App.Core.Inv.InitItems = function () {
        App.Core.Inv.Items = {
            Weight: 0,
            Count: 0,
            Money: 0,
            Gold: 0,
            Cash: 0,
            Food: 0,
            Water: 0,
            Silver: 0,
            Coin: 0,    
            List: [],
            Listing: false,
        }
    }
    App.Core.Inv.InitItems()
    //^你身上带著下列这些东西\(负重\s*(\S+)%\)：$
    App.Core.Inv.OnItemsStart = function (name, output, wildcards) {
        App.Core.Cooldown.Update('core.i')
        App.Core.Inv.InitItems()
        App.Core.Inv.Items.Listing = true
        App.Core.Inv.Items.Weight = wildcards[0] - 0
        App.Raise('core.itemstart')
    }
    //^目前携带了(.+)件物品。$
    App.Core.Inv.OnItemsEnd = function (name, output, wildcards) {
        App.Core.Inv.Items.Listing = false
        App.Core.Inv.Items.Count = CNumber.Convert(wildcards[0])
    }
    //^目前你身上没有任何东西。$
    App.Core.Inv.OnItemsEmpty = function (name, output, wildcards) {
        App.Core.Cooldown.Update('core.i')
        App.Core.Inv.InitItems()
        App.Raise('core.itemstart')
    }
    //^(□|○|  )([^ (]+)\(([^)]+)\)$
    App.Core.Inv.OnItem = function (name, output, wildcards) {
        if (App.Core.Inv.Items.Listing) {
            let item = {
                Equiped: wildcards[0] === "□",
                Handed: wildcards[0] === "○",
                Label: wildcards[1],
                ID: wildcards[2],
            }
            switch (item.ID) {
                case App.Core.Item.Food.Name:
                    var food = CNumber.Split(item.Label)
                    App.Core.Inv.Items.Food += food.Count
                    break
                case App.Core.Item.Water.Name:
                    var water = CNumber.Split(item.Label)
                    App.Core.Inv.Items.Water += water.Count
                    break
                case 'Gold':
                    if (item.Label.endsWith('两黄金')) {
                        let gold = CNumber.Convert(item.Label.slice(0, -3))
                        if (gold) {
                            App.Core.Inv.Items.Money += gold
                            App.Core.Inv.Items.Gold += gold
                        }
                    }
                    break;
                case 'Cash':
                    if (item.Label.endsWith('张一千两银票')) {
                        let cash = CNumber.Convert(item.Label.slice(0, -6))
                        if (cash) {
                            App.Core.Inv.Items.Money += cash * 10
                            App.Core.Inv.Items.Cash += cash
                        }
                    }
                    break;
                case 'Silver':
                    if (item.Label.endsWith('两白银')) {
                        let silver = CNumber.Convert(item.Label.slice(0, -3))
                        if (silver) {
                            App.Core.Inv.Items.Silver += silver
                        }
                    }
                    break;
                case 'Coin':
                    if (item.Label.endsWith('文铜钱')) {
                        let coin = CNumber.Convert(item.Label.slice(0, -3))
                        if (coin) {
                            App.Core.Inv.Items.Coin += coin
                        }
                    }
                    break;

            }
            App.Raise('core.item', item)
            App.Core.Inv.Items.List.push(item)
        }
    }
    App.Core.Check.RegisterSend('core.i', 5000, ['i'])
    App.Core.Inv.Settings = {}
    App.Core.Inv.LoadActions = function (data) {
        let lines = data.split("\n")
        let result = []
        for (var i = 0; i < lines.length; i++) {
            let line = lines[i].trim()
            if (line) {
                let action = new Action(line)
                if (action.Command) {
                    result.push(action)
                }
            }
        }
        return result
    }
    App.Core.Inv.Load = function () {
        let actions = App.Core.Inv.LoadActions(GetVariable('inv'))
        App.Core.Inv.Settings = {
            'gold_min': DefaultGoldMin,
            'gold_max': DefaultGoldMax,
            'gold_normal': DefaultGoldNormal,
            'silver_max': DefaultSilverMax,
            'silver_normal': DefaultSilverNormal,
            'coin_max': DefaultCoinMax,
            'food_min': DefaultFoodMin,
            'food_max': DefaultFoodMax,
            'water_min': DefaultWaterMin,
            'water_max': DefaultWaterMax,
            'items': [],
        }
        for (var i = 0; i < actions.length; i++) {
            let action = actions[i]
            switch (action.Command) {
                case '#gold_min':
                    App.Core.Inv.Settings['gold_min'] = ToNumber(action.Data, DefaultGoldMin)
                    break
                case '#gold_max':
                    App.Core.Inv.Settings['gold_max'] = ToNumber(action.Data, DefaultGoldMax)
                    break
                case '#gold_normal':
                    App.Core.Inv.Settings['gold_normal'] = ToNumber(action.Data, DefaultGoldNormal)
                    break
                case '#silver_max':
                    App.Core.Inv.Settings['silver_max'] = ToNumber(action.Data, DefaultSilverMax)
                    break
                case '#silver_normal':
                    App.Core.Inv.Settings['silver_normal'] = ToNumber(action.Data, DefaultSilverMax)
                    break
                case '#coin_max':
                    App.Core.Inv.Settings['coin_max'] = ToNumber(action.Data, DefaultCoinMax)
                    break
                case '#food_max':
                    App.Core.Inv.Settings['food_max'] = ToNumber(action.Data, DefaultFoodMax)
                    break
                case '#food_min':
                    App.Core.Inv.Settings['food_min'] = ToNumber(action.Data, DefaultFoodMin)
                    break
                case '#water_max':
                    App.Core.Inv.Settings['water_max'] = ToNumber(action.Data, DefaultWaterMax)
                    break
                case '#water_min':
                    App.Core.Inv.Settings['water_min'] = ToNumber(action.Data, DefaultWaterMin)
                    break
                case '':
                    if (action.Data) {
                        var data = action.Data.split("::")
                        let id = data[0]
                        let min = data.length > 1 ? (data[1] - 0) : 1
                        if (!id || isNaN(min)) {
                            Note('无效的道具格式：' + action.Data);
                            break
                        }
                        App.Core.Inv.Settings.Items.push({ ID: id, Min: min })
                    }
                    break
            }
        }
    }
    App.GetItemObj = function (id, lowercase) {
        if (lowercase) {
            id = id.toLowerCase()
        }
        for (var key in App.Core.Inv.Items.List) {
            let itemid = App.Core.Inv.Items.List[key].ID
            if (lowercase) {
                itemid = itemid.toLowerCase()
            }
            if (itemid == id) {
                return App.Core.Inv.Items.List[key]
            }
        }
        return null
    }
    App.GetItemObjs = function (id, lowercase) {
        if (lowercase) {
            id = id.toLowerCase()
        }
        let result = []
        for (var key in App.Core.Inv.Items.List) {
            let itemid = App.Core.Inv.Items.List[key].ID
            if (lowercase) {
                itemid = itemid.toLowerCase()
            }
            if (itemid == id) {
                result.push(App.Core.Inv.Items.List[key])
            }
        }
        return result
    }
    App.GetItemByName = function (name, convert) {
        for (var key in App.Core.Inv.Items.List) {
            let itemname = App.Core.Inv.Items.List[key].Label
            if (convert) {
                let i = CNumber.Split(itemname)
                itemname = i.Item
                App.Core.Inv.Items.List[key].Count = i.Count == 0 ? 1 : i.Count
            }
            if (name == itemname) {
                return App.Core.Inv.Items.List[key]
            }
        }
        return null
    }
    App.HasAnyItemObj = function (idlist, lowercase) {
        for (var index in idlist) {
            var item = App.GetItemObj(idlist[index], lowercase)
            if (item) {
                return item.Label
            }
        }
        return false
    }
    App.GetItemNumber = function (id, lowercase) {
        let items = App.GetItemObjs(id, lowercase)
        if (!items.length) {
            return 0
        }
        let sum = 0
        for (var i = 0; i < items.length; i++) {
            sum += CNumber.Split(items[i].Label).Count
        }
        return sum
    }
    App.Bind('beforeProposal', 'App.Core.Inv.Load')
})(App)