(function (App) {
    let proposal=Include("core/proposal/proposal.js")
    let Repair= function(){
        proposal.call(this,"food")
        this.GetNeedRepair=function(){
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
            return (this.GetNeedRepair()!="")
        }
        this.Execute=function(context){
            let wpid=this.GetNeedRepair()!="";
            App.Core.Item.Buy(App.Core.Item.Food.Key)
        }
    }
    App.RegisterProposal(new Repair())
})(App)