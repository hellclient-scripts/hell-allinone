(function (App) {
    let proposal=Include("core/proposal/proposal.js")
    let Cun= function(){
        proposal.call(this,"cun")
        this.Submit=function(context){
            let goldmax=App.Core.Inv.Settings.gold_max
            if (context['gold_max']){
                goldmax=goldmax<context['gold_max']?goldmax:context['gold_max']
            }
            return App.Core.Inv.Items.Money>goldmax
        }
        this.Execute=function(context){
            let goldnormal=App.Core.Inv.Settings.gold_normal
            if (context['gold_normal']){
                goldnormal=context['gold_normal']?context['gold_normal']:goldnormal
            }
            let diff=App.Core.Inv.Items.Money-goldnormal
            let cash=Math.floor(diff/10)
            if (cash>App.Core.Inv.Items.Cash){
                cash=App.Core.Inv.Items.Cash
            }
            let gold=diff-(cash*10)
            let cmds=[
                App.NewCommand("to",App.Core.Move.NewMove([App.Info.Rooms.Bank])),
                App.NewCommand("nobusy"),
            ]
            if (cash){
                cmds.push(App.NewCommand("do",'cun '+cash +' cash'))
                cmds.push(App.NewCommand("nobusy"))
            }
            if (gold){
                cmds.push(App.NewCommand("do",'cun '+gold +' gold'))
                cmds.push(App.NewCommand("nobusy"))
            }
            cmds.push(App.NewCommand('do','i'))
            cmds.push(App.NewCommand("nobusy"))
            App.Commands(cmds).Push()
            App.Next()
        }
    }
    App.RegisterProposal(new Cun())
})(App)