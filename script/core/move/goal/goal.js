//移动目标的接口
//用于在每一次成功的移动后接管控制权
(function(){
    //目标接口
    let Goal=function(target){
        this.Found=false
        this.Target=target
    }
    //必须继承，
    Goal.prototype.OnArrive=function(move){
        throw 'Goal OnArrive 方法未实现'
    }
    return Goal
})()