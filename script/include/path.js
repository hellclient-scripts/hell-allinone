(function () {
    let Step = Include("include/step.js")
    let Path = function (commands, target) {
        this.Steps = []
        let self = this
        if (commands) {
            commands.forEach(function (cmd) {
                self.Push(cmd)
            })
            this.Steps[this.Steps.length - 1].SetTarget(target)
        }
    }
    Path.prototype.Pop = function () {
        return this.Steps.pop()
    }
    Path.prototype.Push = function (command, target) {
        this.PushStep(new Step(command, target))
    }
    Path.prototype.PushStep = function (step) {
        if (step.Command){
            this.Steps.push(step)
        }
    }
    Path.prototype.PushCommands = function (commands, target) {
        var self = this
        if (commands.length!=0) {
            commands.forEach(function (cmd) {
                if (cmd.trim()!=""){
                    self.Push(cmd)
                }
            })
            if (this.Steps[this.Steps.length - 1]){
                this.Steps[this.Steps.length - 1].SetTarget(target)
            }
        }
    }
    Path.prototype.Clone = function () {
        let result = new Path()
        this.Steps.forEach(function (step) {
            result.Steps.push(step)
        })
        return result
    }
    Path.prototype.Length = function () {
        return this.Steps.length
    }
    Path.prototype.Shift = function () {
        return this.Steps.shift()
    }
    Path.prototype.Unshift = function (step) {
        this.Steps.unshift(step)
    }
    Path.prototype.First = function () {
        if (this.Steps.length == 0) {
            return null
        }
        return this.Steps[0]
    }
    return Path
})()