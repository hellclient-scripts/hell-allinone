(function (App) {
    App.Core.Inv = {}
    App.Core.Inv.Items = {
        Weight: 0,
        Count: 0,
        Money:0,
        Gold:0,
        Cash:0,
        List: [],
        Listing: false,
    }
    App.Core.Inv.ListingItems = false
    App.Core.Inv.InitItems = function () {
        App.Core.Inv.Items = {
            Weight: 0,
            Count: 0,
            Money:0,
            Gold:0,
            Cash:0,
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
            switch(item.ID){
                case 'Gold':
                    if(item.Label.endsWith('两黄金')){
                        let gold=CNumber.Convert(item.Label.slice(0,-3))
                        if (gold){
                            App.Core.Inv.Items.Money+=gold  
                            App.Core.Inv.Items.Gold+=gold  
                        }
                    }
                break;
                case 'Cash':
                    if(item.Label.endsWith('张一千两银票')){
                        let cash=CNumber.Convert(item.Label.slice(0,-6))
                        if (cash){
                            App.Core.Inv.Items.Money+=cash*10
                            App.Core.Inv.Items.Cash+=cash  
                        }
                    }
                break;
            }
            App.Raise('core.item',item)
            App.Core.Inv.Items.List.push(item)
        }
    }

})(App)