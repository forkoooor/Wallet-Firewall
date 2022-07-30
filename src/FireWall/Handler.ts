import { parseRequest } from "./Tx";

function getTargetName(target: Function) {
  return target.name.replace("bound ", "");
}

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
        // console.log(log);
        // consumer.process(log);
        try {
          const parsed = context.parseLog(log);
          if (parsed) {
            consumer.process(parsed);
          }
          // else {
          //   consumer.process(log);
          // }
        } catch (e) {
          console.error("error", e);
        }
      },
    };
    const proxyHandler = {
      get: function (target: any, key: any, receiver: any) {
        // pageActions.push({
        //   type: "get",
        //   key,
        // });
        if (target[key] instanceof Object) {
          return new Proxy(target[key], {
            get: function (a: any, b: any, c: any) {
              // pageActions.push({
              //   type: "get",
              //   key: [key, b].join("."),
              // });
              return a[b];
            },
            set: function (a: any, b: any, c: any, d: any) {
              // pageActions.push({
              //   type: "set",
              //   key: [key, b].join("."),
              // });
              try {
                a[b] = c;
                return true;
              } catch (e) {
                return false;
              }
            },
            apply: function (target: any, thisArg: any, argumentsList: any) {
              const functionName = getTargetName(target);
              pageActions.push({
                type: "call",
                key: [getTargetName(target)].join("."),
                args: argumentsList,
              });
              const needBlock = context.executeHandler(
                functionName,
                argumentsList,
                consumer
              );
              if (needBlock) {
                return new Promise((resolve, reject) => {
                  (async () => {
                    const blocked = await needBlock();
                    if (blocked) {
                      resolve(null);
                    } else {
                      resolve(target.apply(thisArg, argumentsList));
                    }
                  })();
                });
              } else {
                return target.apply(thisArg, argumentsList);
              }
            },
          });
        }
        return target[key];
      },
      set: function (target: any, key: any, value: any, receiver: any) {
        // pageActions.push({
        //   type: "set",
        //   key,
        // });
        try {
          target[key] = value;
          return true;
        } catch (e) {
          return false;
        }
      },
      apply: function (target: any, thisArg: any, argumentsList: any) {
        // pageActions.push({
        //   type: "call",
        //   key: [getTargetName(target)].join("."),
        //   args: argumentsList,
        // });
        return target.apply(thisArg, argumentsList);
      },
    };
    return proxyHandler;
  }
}
