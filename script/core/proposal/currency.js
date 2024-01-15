(function (App) {
    let proposal=Include("core/proposal/proposal.js")
    let Cash= function(){
        proposal.call(this,"currency")
        this.Submit=function(context){
            let currency=App.Core.Inv.Settings.currency
            if (context['currency']){
                currency=currency>context['currency']?currency:context['currency']
            }
            return App.Core.Inv.Items.Gold<currency
        }
        this.Execute=function(context){
            let currency=App.Core.Inv.Settings.currency
            if (context['currency']){
                currency=currency>context['currency']?currency:context['currency']
            }

            let cmd="qu "+currency+" gold;i"

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