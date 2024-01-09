(function (App) {
    let proposal=Include("core/proposal/proposal.js")
    let Cash= function(){
        proposal.call(this,"cash")
        this.Submit=function(context){
            let goldmin=App.Core.Inv.Settings.goldmin
            if (context['gold_min']){
                goldmin=goldmin>context['gold_min']?goldmin:context['gold_min']
            }
            return App.Core.Inv.Items.Money()<goldmin
        }
        this.Execute=function(context){
            let goldmin=App.Core.Inv.Settings.goldmin
            if (context['gold_min']){
                goldmin=goldmin>context['gold_min']?goldmin:context['gold_min']
            }

            let cmd="qu "+goldmin+" gold;i2"

            App.Commands([
                App.NewCommand("to",App.Options.NewWalk(App.Info.RoomBank)),
                App.NewCommand("nobusy"),
                App.NewCommand("do",cmd),
                App.NewCommand("nobusy"),
            ]).Push()
            App.Next()
        }
    }
    App.RegisterProposal(new Cash())
})(App)