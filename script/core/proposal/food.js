(function (App) {
    let proposal=Include("core/proposal/proposal.js")
    let Food= function(){
        proposal.call(this,"food")
        this.Submit=function(context){
            let food_min=App.Core.Inv.Settings.food_min
            if (context['food_min']){
                food_min=food_min>context['food_min']?food_min:context['food_min']
            }
            return App.Core.Inv.Items.Food<food_min
        }
        this.Execute=function(context){
            App.Core.Item.Buy(App.Core.Item.Food.Key)
        }
    }
    App.RegisterProposal(new Food())
})(App)