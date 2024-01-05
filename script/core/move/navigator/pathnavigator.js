(function(){
    let BaseNavigator=Include('core/move/navigator/basenavigator.js')
    let PathNavigator=function(path){
        BaseNavigator.call(this)
        this.Path=path
    }
    PathNavigator.prototype = Object.create(BaseNavigator.prototype)
    PathNavigator.prototype.Current=function(){
        return this.Path.First()
    }
    //必须继承，当前移动成功后的确认指令
    PathNavigator.prototype.Arrived=function(move){
        this.Path.Shift()
    }

    return PathNavigator
})()