(function(){
    let Step = Include("include/step.js")

    let Move=function(navigator,goal){
        this.Navigator=navigator
        this.Goal=goal
        this.Looked=false
        this.StateStep='move.step'
        this.StateMove='move.move'
    }
    Move.prototype.Start=function(){
        this.Navigator.Init(this)
        App.Push([this.StateMove]).WithData('Move',this)
        App.Next();
    }
    Move.prototype.Next=function(){
        App.ChangeState(this.StateMove)
    }
    Move.prototype.OnArrive=function(){
        if ((this.Goal.NeedLook||this.Navigator.NeedLook)&&!this.Looked){
            this.Looked=true;
            App.Raise('core.move.arrive',null)
            if (this.Navigator.ArrivedOrLooked(this)){
                App.Fail()
                return
            }
        }else{
            App.Raise('core.move.arrive',this.Navigator.Current())
            if (this.Navigator.ArrivedOrLooked(this)){
                App.Fail()
                return
            }
            if (this.Navigator.Arrived(this)){
                App.Fail()
                return
            }
        }
        this.Goal.OnArrive(this)
    }
    Move.prototype.DoStep=function(){
        App.ChangeState(this.StateStep)
    }
    Move.prototype.OnFinish=function(){
        App.Next()
    }
    Move.prototype.CurrentStep=function(){
        if ((this.Goal.NeedLook||this.Navigator.NeedLook)&&!this.Looked){
            return new Step('l',App.Core.Room.Current.ID)
        }
        return this.Navigator.Current()
    }
    Move.prototype.OnFail=function(){
        App.Fail()
    }
    return Move
})()