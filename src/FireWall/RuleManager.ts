export default class RuleManager {
  rules: any[];
  matchArgs: any;
  rulesByType: any;

  constructor(rules: any[], matchArgs: any) {
    this.rules = rules;
    this.matchArgs = matchArgs;
    this.rulesByType = {
      passRules: this.rules.filter((_) => _.type === "pass"),
      blockRules: this.rules.filter((_) => _.type === "block"),
      askRules: this.rules.filter((_) => _.type === "ask"),
    };
  }

  checkByCondition(matchItem: any, action: any) {
    const { values, kind } = matchItem;
    let isMatch = false;
    if (kind === "siteDomain") {
      isMatch = values.includes(this.matchArgs.siteDomain);
    } else if (kind === "action" && action) {
      isMatch = values.includes(action.name);
    }
    return isMatch;
  }

  checkRules(rules: any, action: any) {
    return rules.find((rule: any) => {
      return this.checkByCondition(rule, action);;
    });
  }

  process(action: any) {
    let state = "pass";
    const { passRules, blockRules, askRules } = this.rulesByType;
    const matchPass = this.checkRules(passRules, action);
    if (!matchPass) {
      const matchInBlock = this.checkRules(blockRules, action);
      if (matchInBlock) {
        state = "block";
      } else {
        const matchAsk = this.checkRules(askRules, action);
        if (matchAsk) {
          state = "ask";
        }
      }
    }
    return state;
  }
}
