(function (App) {
    let proposal=Include("core/proposal/proposal.js")
    let Food= function(){
        proposal.call(this,"food")
        this.Submit=function(context){
            let food_min=App.Core.Inv.Settings.food_min
            if (context['food_min']){
                food_min=food_min>context['food_min']?food_min:context['food_min']
            }
            return App.GetItemNumber('shui dai',true)<food_min
        }
        this.Execute=function(context){
            let goldmin=App.Core.Inv.Settings.gold_min
            if (context['gold_min']){
                goldmin=goldmin>context['gold_min']?goldmin:context['gold_min']
            }

            let cmd="qu "+goldmin+" gold;i"

            App.Commands([
                App.NewCommand("to",App.Core.Move.NewMove([App.Info.Rooms.Bank])),
                App.NewCommand("nobusy"),
                App.NewCommand("do",cmd),
                App.NewCommand("delay",1),
                App.NewCommand("nobusy"),
            ]).Push()
            App.Next()
        }
    }
    App.RegisterProposal(new Food())
})(App)