(function (App) {
    let Proposals = Include("include/proposals.js")

    App.ProposalsCurrent = null
    App.Proposals = {}
    App.ProposalGroups = {}
    App.RegisterProposal = function (proposal) {
        if (proposal.ID == "") {
            throw "Proposal id不可为空"
        }
        App.Proposals[proposal.ID] = proposal
    }
    App.RegisterProposalGroup = function (groupid, proposals) {
        App.ProposalGroups[groupid] = proposals
    }

    let try_proposals = function (proposals, context, excluded_map) {
        context = context || {}
        App.Raise('beforeProposal')
        for (var i in proposals) {
            if (excluded_map && excluded_map[proposals[i]]) {
                continue
            }
            let proposal = App.Proposals[proposals[i]]
            if (!proposal) {
                throw "提案 [" + proposals[i] + "] 没找到"
            }
            if (proposal.Submit(context)) {
                Note("提案" + proposal.ID + "被接受")
                return proposal
            }
        }
        return null
    }
    let try_proposalgroup = function (groupid, context, excluded_map) {
        let group = App.ProposalGroups[groupid]
        if (!group) {
            throw "提案组 [" + groupid + "] 没找到"
        }
        return try_proposals(group, context, excluded_map)

    }
    let try_proposalgroups = function (groups, context, excluded_map) {
        for (var i in groups) {
            let group = groups[i]
            let p = try_proposalgroup(group, context, excluded_map)
            if (p) {
                return p
            }
        }
        return null
    }
    App.TryProposalGroups = function (groups, context, excluded_list) {
        return try_proposalgroups(groups, context, excluded_list)
    }
    App.TryProposalGroup = function (groupid, context) {
        return try_proposalgroup(groupid, context)
    }
    App.TryProposals = function (proposals, context, excluded_list) {
        return try_proposals(proposals, context, excluded_list)
    }
    App.Core.Proposal = {}
    App.Core.Proposal.New = function (groups, context, excluded_list) {
        return new Proposals(groups, context, excluded_list)
    }
    App.Core.Proposal.Push = function (proposals) {
        App.ProposalsCurrent = proposals
        App.Raise('beforeProposal')
        App.Core.Proposal.Try()
    }
    App.Core.Proposal.Try = function () {
        App.Commands([
            App.NewCommand('function', function(){App.Core.Check.Start(App.ProposalsCurrent.Context)}),
            App.NewCommand('function', function () {
                let proposal = App.TryProposalGroups(App.ProposalsCurrent.Groups, App.ProposalsCurrent.Context, App.ProposalsCurrent.ExcludedList)
                if (proposal) {
                    App.Commands([
                        App.NewCommand('function', function () { proposal.Execute(App.ProposalsCurrent.Context) }),
                        App.NewCommand('function', App.Core.Proposal.Try),
                    ]).Push()
                }
                App.Next();
            }),
        ]).Push()
        App.Next();
    }
    App.Core.Proposal.Prepare = function () {
        App.Core.Proposal.Push(App.Core.Proposal.New(['prepare']))
    }


    App.Core.Proposal.OnPrepare=function (name, line, wildcards) {
        App.Core.Proposal.Prepare()
    }

    Include("core/proposal/cash.js")
    Include("core/proposal/cun.js")
    Include("core/proposal/food.js")
    Include("core/proposal/water.js")
    Include("core/proposal/repair.js")

    // Include("core/proposal/items.js")
    // Include("core/proposal/neili.js")
    // Include("core/proposal/heal.js")
    // Include("core/proposal/sell.js")
    // Include("core/proposal/cun.js")
    // Include("core/proposal/repair.js")
    // Include("core/proposal/prepare.js")
    // Include("core/proposal/poison.js")
    // Include("core/proposal/lupidai.js")
    // Include("core/proposal/baofu.js")
    // Include("core/proposal/asset.js")
    // Include("core/proposal/throwing.js")
    // Include("core/proposal/coin.js")
    // Include("core/proposal/silver.js")
    // Include("core/proposal/toggle.js")
    // Include("core/proposal/zhenqi.js")
    // Include("core/proposal/shaqi.js")
    // Include("core/proposal/overheat.js")
    // App.RegisterState(new (Include("core/state/prepare/preparecheck.js"))())
    // App.RegisterState(new (Include("core/state/prepare/prepareconfirm.js"))())
    Include("core/proposal/prepare.js")
})(App)