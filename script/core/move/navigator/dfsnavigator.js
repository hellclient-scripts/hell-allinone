(function(){
    let Step = Include("include/step.js")
    let BaseNavigator=Include('core/move/navigator/basenavigator.js')
    let DFS = Include("include/dfs.js")

    let DfsNavigator=function(depth){
        BaseNavigator.call(this)
        this.NeedLook=true
        this.DFS=new DFS(depth?depth:10).New()
        this.CurrentStep=null
    }
    DfsNavigator.prototype = Object.create(BaseNavigator.prototype)
    DfsNavigator.prototype.Current=function(){
        return this.CurrentStep
    }
    DfsNavigator.prototype.ArrivedOrLooked=function(){
        let exits=App.Core.Room.Current.Exits
        let level=this.DFS.Arrive(exits)
        let next=level.Next()
        if (next){
            this.CurrentStep=new Step(next.Command)
            this.DFS=next
        }else{
            this.CurrentStep=null
            return true
        }
    }

    return DfsNavigator
})()