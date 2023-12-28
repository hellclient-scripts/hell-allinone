(function () {
    let Action = Include("include/action.js")
    let Combat = function (strategylist) {
        this.Disarmed = false
        this.Recovery = -1
        this.After = null
        this.Yield = false
        this.Online = null
        this.KillCmd = ""
        this.KillAgainCmd=""
        this.Target = ""
        //战斗跳开自动判断，使用自定义结束行
        this.FinishLine = ""
        this.FirstAid = false
        this.OnNpcFlee = null
        this.OnRestInterrupted = null

        this.StartAt = Now()
        this.HaltWound = 0
        this.Wimpy = -1
        this.HaltCurrent = 0
        this.HaltAfter = 0
        this.StrategyList = strategylist || []
        this.Strategy = ""
        this.LastWeapon=""
        this.Weapon=""
        this.WeaponCooldown=0
        this.Actions = []
        this.StartAt = Now()
        this.JingWound=0
        this.QiWound=0
        this.QiDamage=0
        this.JingDamage=0
        this.LastTarget=""
        this.PendingCmd=""
    }
    Combat.prototype.LoadActions = function (data) {
        let lines = data.split("\n")
        let defaultresult = []
        let result = []
        result[this.Strategy] = []
        for (var i = 0; i < lines.length; i++) {
            let line = lines[i].trim()
            if (line) {
                let action = new Action(line)
                if (this.Strategy == action.Strategy) {
                    result.push(action)
                }
                if (this.Strategy == "") {
                    defaultresult.push(action)
                }
            }
        }
        this.Actions = result.length > 0 ? result : defaultresult
    }
    Combat.prototype.SetHaltAfter = function (data) {
        this.HaltAfter = data
    }
    Combat.prototype.SetHaltCurrent = function (data) {
        this.HaltCurrent = data
    }
    Combat.prototype.SetHaltWound = function (data) {
        this.HaltWound = data
    }
    Combat.prototype.SetOnline = function (Online) {
        this.Online = Online
    }
    Combat.prototype.SetOnNpcFlee = function (OnNpcFlee) {
        this.OnNpcFlee = OnNpcFlee
    }
    Combat.prototype.SetOnRestInterrupted = function (OnRestInterrupted) {
        this.OnRestInterrupted = OnRestInterrupted
    }
    Combat.prototype.SetWimpy = function (wimpy) {
        this.Wimpy = wimpy
    }
    Combat.prototype.GetWimpy = function () {
        return this.Wimpy < 0 ? App.Core.CombatMode.Current().GetWimpy() : this.Wimpy
    }
    Combat.prototype.SetYield = function (y) {
        this.Yield = y
    }
    Combat.prototype.SetAfter = function (cmd) {
        this.After = cmd
    }
    Combat.prototype.SetTarget = function (id) {
        this.Target = id
    }
    Combat.prototype.SetKillCmd = function (cmd) {
        this.KillCmd = cmd
    }
    Combat.prototype.SetFirstAid = function (firstaid) {
        this.FirstAid = firstaid
    }
    Combat.prototype.SetFinishLine = function (FinishLine) {
        this.FinishLine = finishline
    }
    Combat.prototype.SetCounter = function (counter) {
        this.Counter = counter
    }
    Combat.prototype.SetLastTarget=function(target){
        this.LastTarget=target
    }
    Combat.prototype.Duration = function () {
        return (Now() - this.StartAt) / 1000
    }
    return Combat
})()