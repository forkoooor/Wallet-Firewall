import { parseRequest } from "./Tx";
import Handler from "./Handler";
import RuleManager from "./RuleManager";
import allRules from '../config/rules.json'

type CallBack = (args: any) => void;

function hookInstance(obj: any, name: any, handler: any ) {
  let instance: any = obj[name], changed = true, proxyInstance: any;
  Object.defineProperty(obj, name, {
    get() {
      if (changed && instance) {
        proxyInstance = new Proxy(instance, handler);
      }
      return proxyInstance;
    },
    set(instance_: any) {
      instance = instance_;
      changed = true;
    },
    configurable: true,
  });
}

export default class Inspector {
  approver: null | CallBack;
  handler: Handler;
  ruleManager: RuleManager;
  subscribers: any[];
  logs: any[];
  injected: Set<string>;

  constructor() {
    this.approver = null;
    this.handler = new Handler();
    this.subscribers = [];
    this.logs = [];
    this.injected = new Set();
    this.ruleManager = new RuleManager(allRules, {
      siteDomain: window.location.host,
    });
  }

  init() {
    this.proxy();
    this.listen();
  }

  isDebug() {
    return typeof window != 'undefined' && window.location.hash === '#debug'
  }

  getLogs() {
    return JSON.parse(JSON.stringify(this.logs));
  }

  subscribe(subscriber: any) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: any) {
    const exists = [];
    for (let index = 0; index < this.subscribers.length; index++) {
      if (this.subscribers[index] != subscriber) {
        exists.push(this.subscribers[index]);
      }
    }
    this.subscribers = exists;
  }

  broadcast(log: any) {
    log.id = this.logs.length + 1;
    // this.logs.push(log);
    for (let index = 0; index < this.subscribers.length; index++) {
      const subscriber = this.subscribers[index];
      subscriber && subscriber(log);
    }
  }

  proxy() {
    const context = this;

    const handler = (args: any, consumer: any) => {
      const parsedAction = parseRequest(args[0]);
      /* @ts-ignore */
      const chainId = window.ethereum.chainId;
      const state = context.ruleManager.process(parsedAction, {
        chainId
      });
      if (this.isDebug()) console.log("WalletFirewall", "request", parsedAction, args);
      if (state === 'ask') {
        // notify ui and wait result
        if (context.approver && parsedAction) {
          return async () => {
            const isApprove = context.approver
              ? await context.approver(parsedAction)
              : false;
            return isApprove;
          };
        }
      } else {
        return async () => {
          const rejected = state === 'pass' ? false : true;
          return rejected;
        };
      }
    };

    this.handler.registerHandler("sendAsync", handler)
    this.handler.registerHandler("send", handler)
    this.handler.registerHandler("request", handler);
  }

  listenRequest(cb: any) {
    if (!this.approver) this.approver = cb;
  }

  async listen() {
    for (let index = 0; index < 10000; index++) {
      this.tryInject();
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  }

  tryInject() {
    if (typeof window['ethereum'] === 'undefined') {
      return;
    }

    if (window.ethereum.isScamSniffer) {
      return;
    }

    const context = this;
    if (this.isDebug()) {
      console.log('tryInject', new Date())
    }

    const proxyHandler = this.handler.inject({
      process(log: any) {
        context.broadcast(log);
      },
    });

    hookInstance(window, 'ethereum', proxyHandler)

    if (
      /* @ts-ignore */
      typeof window.web3 !== "undefined" ) {
      /* @ts-ignore */
      hookInstance(window.web3, 'currentProvider', proxyHandler);
    }
    
    return false;
  }
}
