(function (App) {
    let proposal=Include("core/proposal/proposal.js")
    let Water= function(){
        proposal.call(this,"water")
        this.Submit=function(context){
            let water_min=App.Core.Inv.Settings.water_min
            if (context['water_min']){
                water_min=food_min>context['water_min']?food_min:context['water_min']
            }
            return App.Core.Inv.Items.Water<water_min
        }
        this.Execute=function(context){
            App.Core.Item.Buy(App.Core.Item.Water.Key)
        }
    }
    App.RegisterProposal(new Water())
})(App)