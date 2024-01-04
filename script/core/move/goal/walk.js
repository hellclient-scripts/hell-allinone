(function(){
    let Goal=Include('core/move/goal/goal.js')
    let Walk=function(target){
        Goal.call(this,target)
        this.NeedLook=false
    }
    Walk.prototype = Object.create(Goal.prototype)
    Walk.prototype.OnArrive=function(move){
        move.Next()
    }
    return Walk
})()