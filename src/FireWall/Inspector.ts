import { parseRequest } from "./Tx";
import Handler from "./Handler";
import RuleManager from "./RuleManager";
import allRules from '../config/rules.json'

type CallBack = (args: any) => void;

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
    this.logs.push(log);
    for (let index = 0; index < this.subscribers.length; index++) {
      const subscriber = this.subscribers[index];
      subscriber && subscriber(log);
    }
  }

  proxy() {
    const context = this;
    this.handler.registerHandler("request", (args: any, consumer: any) => {
      const parsedAction = parseRequest(args[0]);
      // call rule manager
      const state = context.ruleManager.process(parsedAction);
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
          const isApprove = state === 'pass';
          return isApprove;
        };
      }
    });
  }

  listenRequest(cb: any) {
    if (!this.approver) this.approver = cb;
  }

  async listen() {
    for (let index = 0; index < 500; index++) {
      let allInjected = this.tryInject();
      if (allInjected) break;
      await new Promise((resolve) => {
        setTimeout(resolve, 2 * 1000);
      });
    }
  }

  tryInject() {
    const namespaces = ["ethereum"];
    const context = this;

    if (namespaces.length === this.injected.size) {
      return true;
    }

    const existsNamespaces = namespaces
      .filter(
        (namespace: any) =>
          typeof window[namespace] !== "undefined" &&
          !context.injected.has(namespace)
      )
      .map((namespace: any) => ({
        namespace,
        instance: window[namespace],
      }));
    if (existsNamespaces.length) {
      existsNamespaces.forEach(({ namespace, instance }) => {
        const proxyHandler = this.handler.inject({
          process(log: any) {
            context.broadcast(log);
          },
        });
        const proxy = new Proxy(window[namespace], proxyHandler);
        window[namespace] = proxy;
        context.injected.add(namespace);
      });
    }

    return false;
  }
}
