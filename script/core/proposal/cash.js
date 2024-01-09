(function (App) {
    let proposal=Include("core/proposal/proposal.js")
    let Cash= function(){
        proposal.call(this,"cash")
        this.Submit=function(context){
            let goldmin=App.Core.Inv.Settings.gold_min
            if (context['gold_min']){
                goldmin=goldmin>context['gold_min']?goldmin:context['gold_min']
            }
            return App.Core.Inv.Items.Money<goldmin
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
                App.NewCommand("nobusy"),
            ]).Push()
            App.Next()
        }
    }
    App.RegisterProposal(new Cash())
})(App)