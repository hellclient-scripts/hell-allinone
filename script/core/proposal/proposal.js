//提案接口
(function (App) {
    let Proposal=function(id){
        if (!id) {
            throw "Proposal的id不能为空"
        }
        this.ID=id
        //必须实现，具体实现提案的代码
        this.Execute=function(context){
        }
        //必须实现，返回true/false
        //为true的话去实现提案
        this.Submit=function(context){
            return false
        }
    }
    return Proposal
})(App)