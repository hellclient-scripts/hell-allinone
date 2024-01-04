(function(){
    let Goal=Include('core/move/goal/goal.js')
    let Find=function(target,finder){
        Goal.call(this,target)
        this.finder=finder
    }
    Find.prototype = Object.create(Goal.prototype)
    Find.prototype.OnArrive=function(move){
        if (!move.Navigator.Ignored()&&this.finder(this.target)){
            this.Found=true
            move.OnFinish()
            return
        }
        move.Next()
    }
    return Find
})()