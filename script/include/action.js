(function () {
    let Condition = Include("include/condition.js")

    let Action = function (line) {
        this.Strategy = ""
        this.Conditions = []
        this.ConditionsLine=""
        this.Command = ""
        this.Param = ""
        this.Data = ""
        this.Line = line
        let data = SplitN(line, ":", 2)
        let param
        if (data.length == 1) {
            param = line
        } else {
            this.Strategy = data[0]
            param = data[1]
        }
        data = SplitN(param, ">", 2)
        let cmd = ""
        if (data.length == 1) {
            cmd = param
        } else {
            this.ConditionsLine=data[0].trim()
            let conditions = this.ConditionsLine.split(",")
            for (var i = 0; i < conditions.length; i++) {
                let c = conditions[i].trim()
                if (c) {
                    this.Conditions.push(new Condition(c))
                }
            }
            cmd = data[1]
        }
        if (cmd) {
            if (cmd[0] == "#") {
                data = SplitN(cmd, " ", 2)
                let command = SplitN(data[0], ".", 2)
                this.Command = command[0]
                if (command.length > 1) {
                    this.Param = command[1]
                }
                if (data.length > 1) {
                    this.Data = data[1]
                }
            } else {
                this.Data = cmd
            }
        }
    }
    return Action
})()