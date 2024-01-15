(function (App) {
    const DefaultHealBelow = 80
    const DefaultJingliMin = -1
    const DefaultNeiliMin = -1
    const DefaultTihuiMax = -1
    const DefaultPotMax = -1
    const DefaultDazuo = -1
    App.Core.Player = {}
    /**
    App.Data.HP中存放了hp命令中抓取的数据，内容如下
    jing 当前精神
    max_jing 最大精神
    eff_jing 精神受伤百分比
    jingli 当前精力
    max_jingli 最大精力
    qi 当前气血
    max_qi 最大气血
    eff_qi 气血受伤百分比
    neili 当前内力
    max_neili 最大内力
    jiali 当前加力
    food 当前食物
    food_max 最大食物
    pot 潜能
    pot_full 潜能是否已满(true/false)
    water 当前饮水
    max_water 最大饮水
    exp 经验
    th 体会
    **/
    App.Data.HP = {}
    App.Core.Player.InitHP = function () {
        App.Data.HP = {}
    }
    App.Core.Player.InitHP()
    //^┌───个人状态────────────┬───────────────────┐$
    App.Core.Player.OnHpStart = function (name, output, wildcards) {
        App.Core.Player.InitHP()
        App.Core.Cooldown.Update('core.hp')
    }
    //^│\s*【精气】\s*(-{0,1}\d*)\s*/\s*(-{0,1}\d*)\s*\[\s*(\d*)%\](.*)【精力】\s*(-{0,1}\d*)\s*/\s*(-{0,1}\d*)\s*\((.*)\)\s*│$
    App.Core.Player.OnHpLine1 = function (name, output, wildcards) {
        App.Data.HP.jing = wildcards[0] - 0
        App.Data.HP.max_jing = wildcards[1] - 0
        App.Data.HP.eff_jing = wildcards[2] - 0
        App.Data.HP.jingli = wildcards[4] - 0
        App.Data.HP.max_jingli = wildcards[5] - 0
    }
    //^│\s*【气血】\s*(-{0,1}\d*)\s*/\s*(-{0,1}\d*)\s*\[\s*(\d*)%\](.*)【内力】\s*(-{0,1}\d*)\s*/\s*(-{0,1}\d*)\s*\(\+\s*(\S+)\)\s*│$
    App.Core.Player.OnHpLine2 = function (name, output, wildcards) {
        App.Data.HP.qi = wildcards[0] - 0
        App.Data.HP.max_qi = wildcards[1] - 0
        App.Data.HP.eff_qi = wildcards[2] - 0
        App.Data.HP.neili = wildcards[4] - 0
        App.Data.HP.max_neili = wildcards[5] - 0
        App.Data.HP.jiali = wildcards[6] - 0
    }
    //^│【食物】([^/]*)/\s*(\S*).+【潜能】(.*)│$
    App.Core.Player.OnHpLine3 = function (name, output, wildcards) {
        App.Data.HP.food = wildcards[0] - 0
        App.Data.HP.max_food = wildcards[1] - 0
        App.Data.HP.pot = wildcards[2] - 0
        let wordpot = App.CurrentLine.Raw.Words[5]
        App.Data.HP.pot_full = wordpot.Color === "Magenta"

    }
    //^│【饮水】([^/]*)/\s*(\S*).+【经验】(.*)│$
    App.Core.Player.OnHpLine4 = function (name, output, wildcards) {
        App.Data.HP.water = wildcards[0] - 0
        App.Data.HP.max_water = wildcards[1] - 0
        App.Data.HP.exp = wildcards[2] - 0
    }
    //^│\s+│【体会】 (\S+)\s*│$
    App.Core.Player.OnHpLine5 = function (name, output, wildcards) {
        App.Data.HP.th = wildcards[0] - 0
    }

    App.Data.Skills = {}
    App.Core.Player.SkillType = ''
    App.Core.Player.InitSkills = function () {
        App.Data.Skills = {}
        App.Core.Player.SkillType = ''
    }
    App.Core.Player.InitSkills()
    //^(你目前并没有学会任何技能。|你目前所学到的所有技能)$
    App.Core.Player.OnSkillsStart = function (name, output, wildcards) {
        App.Core.Player.InitSkills()
        App.Core.Cooldown.Update('core.skills')
    }
    //^├\S+项(基本功夫|知识技能|其它技能)─*┼─*┼─*┼─*┤$
    App.Core.Player.OnSkillType = function (name, output, wildcards) {
        App.Core.Player.SkillType = wildcards[0]
    }

    //^│(□|  )(\S+)\s*│(\S+)\s*│[^│]+│\s*([^ /]+)\s*/\s*(\S+)\s*│$
    App.Core.Player.OnSkill = function (name, output, wildcards) {
        let skill = {
            ID: wildcards[2],
            Label: wildcards[1],
            Enabled: (wildcards[0] == "□"),
            Level: wildcards[3] - 0,
            Point: wildcards[4] - 0,
            Type: App.Core.Player.SkillType,
            IsBase: App.CurrentLine.Raw.Words[1].Color === 'Cyan',
        }
        App.Data.Skills[skill.ID] = skill
    }
    App.Core.Check.RegisterSend('core.hp', 5000, ['hp'])
    App.Core.Check.RegisterSend('core.hp', 60000, ['cha'])


    App.Core.Player.Settings = {

    }
    App.Core.Player.InitSettings = function () {
        App.Core.Player.Settings = {
            heal_below: DefaultHealBelow,
            jingli_min: DefaultJingliMin,
            neili_min: DefaultNeiliMin,
            pot_max: DefaultPotMax,
            tihui_max: DefaultTihuiMax,
            dazuo: DefaultDazuo,
        }
    }
    App.Core.Player.InitSettings()
    App.Core.Player.Load = function () {
        let actions = App.LoadActions(GetVariable('hp'))
        for (var i = 0; i < actions.length; i++) {
            let action = actions[i]
            switch (action.Command) {
                case 'heal_below':
                    App.Core.Player.Settings['heal_below'] = ToNumber(action.Data, DefaultHealBelow)
                    break
                case 'jingli_min':
                    App.Core.Player.Settings['jingli_min'] = ToNumber(action.Data, DefaultJingliMin)
                    break
                case 'neili_min':
                    App.Core.Player.Settings['neili_min'] = ToNumber(action.Data, DefaultNeiliMin)
                    break
                case 'pot_max':
                    App.Core.Player.Settings['pot_max'] = ToNumber(action.Data, DefaultPotMax)
                    break
                case 'dazuo':
                    App.Core.Player.Settings['dazuo'] = ToNumber(action.Data, DefaultDazuo)
                    break
            }
        }
    }
    App.Core.Player.Load()
    App.Core.Player.GetDazuo=function(){
        if (App.Core.Player.Settings['dazuo']!=-1){
            return App.Core.Player.Settings['dazuo']
        }
        if (App.Data.HP.max_neili<400){
            return 0
        }
        let diff=Math.floor(App.Data.HP.qi*0.8)
        let diff2=(App.Data.HP.max_neili-App.Data.HP.neili)
        if (diff>diff2){
            diff=diff2
        }
        if (diff<10){
            diff=10
        }
        return diff
    }
})(App)