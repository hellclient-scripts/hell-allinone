(function (App) {
    let proposal=Include("core/proposal/proposal.js")
    let Repair= function(){
        proposal.call(this,"repair")
        this.GetNeedRepair=function(context){
            let min=App.Core.Repair.Settings.DurabilityMin
            if (context['repair_min']){
                min=min>context['repair_min']?min:context['repair_min']
            }
            for (var key in App.Core.Repair.Data){
                if (App.Core.Repair.Data[key]>=0&&App.Core.Repair.Data[key]<min){
                    return key
                }
            }
            return ''
        }
        this.Submit=function(context){
            return (this.GetNeedRepair(context)!="")
        }
        this.Execute=function(context){
            let wpid=this.GetNeedRepair(context);
            App.Commands([
                App.NewCommand('money',App.Core.Repair.Settings.Gold),
                App.NewCommand("to", App.Core.Move.NewMove([App.Info.Rooms.Repair])),
                App.NewCommand("nobusy"),
                App.NewCommand("do","repair "+wpid+";repair "+wpid),
                App.NewCommand("function",function(){
                    App.Core.Repair.DoCheck(wpid)
                })
            ]).Push()
            App.Next();
            App.Core.Item.Buy(App.Core.Item.Food.Key)
        }
    }
    App.RegisterProposal(new Repair())
})(App)