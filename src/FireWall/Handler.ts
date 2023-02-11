import { parseRequest } from "./Tx";
import { getConfig, watchConfig, updateFirewallConfig } from "../config/index";

export default class Handler {
  handlers: any;
  constructor() {
    this.handlers = {};
  }

  registerHandler(name: any, callback: any) {
    this.handlers[name] = callback;
  }

  executeHandler(name: any, args: any, consumer: any) {
    try {
      if (this.handlers[name]) {
        const result = this.handlers[name](args, consumer);
        return result;
      }
    } catch (e) {
      // console.error(`executeHandler ${name} error`, e);
    }
    return null;
  }

  parseLog(log: any) {
    const { type, key } = log;
    if (type === "call" && key === "request") {
      const parsedAction = parseRequest(log.args[0]);
      if (parsedAction) {
        return {
          isParsed: true,
          type: parsedAction.isRead ? "read" : "write",
          method: log.args[0].method,
          name: parsedAction.name,
          args: parsedAction.args,
          raw: log.args[0].params,
          timestamp: Date.now(),
        };
      } else {
        return {
          type: "call",
          method: log.args[0].method,
          name: "",
          args: log.args[0].params,
          timestamp: Date.now(),
        };
      }
    }
  }

  inject(consumer: any) {
    const context = this;
    const pageActions = {
      push(log: any) {
        log.timestamp = Date.now();
        try {
          const parsed = context.parseLog(log);
          if (parsed) {
            consumer.process(parsed);
          }
        } catch (e) {
          console.error("error", e);
        }
      },
    };

    const proxyMethods = ['request', 'send', 'sendAsync']
    const proxyHandler = {
      get: function (target: any, key: any, receiver: any) {
        if (key === 'isScamSniffer') {
          return true;
        }
        try {
          const config = getConfig();
          if (!proxyMethods.includes(key) || config.isDisabled) {
            return Reflect.get(target, key, receiver);
          }
          const functionName = key;
          const originalRef = Reflect.get(target, key, receiver);
          return async (...args: any) => {
            const needBlock = context.executeHandler(
              functionName,
              args,
              consumer
            );
            if (needBlock) {
              const blocked = await needBlock();
                if (blocked) {
                  return null
                } else {
                  return originalRef(...args); 
                }
            } else {
              return originalRef(...args);
            }
          }
        } catch(e) {}
        return Reflect.get(target, key, receiver);
      }
    };
    return proxyHandler;
  }
}
