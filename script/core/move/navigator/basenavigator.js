//默认移动导航接口
//用于实现移动中的移动路径指令部分
(function(){
    //基本导航接口，用来继承给各种移动
    let BaseNavigator=function(){
    }
    //可选继承，用于第一次移动前进行初始化
    BaseNavigator.prototype.Init=function(){

    }
    //必须继承，当前移动的指令
    //返回null代表结束
    BaseNavigator.prototype.Current=function(){
        return null
    }
    //必须继承，当前移动成功后的确认指令
    BaseNavigator.prototype.Arrived=function(){
    }
    //可选继承，被拒绝后的处理.默认为标记当前移动为失败
    BaseNavigator.prototype.Rejected=function(){
        App.Fail()
    }
    //可选继承，表示当前房间是否跳过目标检查
    BaseNavigator.prototype.Ignored=function(){
        return false
    }
})()