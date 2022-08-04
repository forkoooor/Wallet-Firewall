import * as address from "./SecurityCheck/address";
import * as contract from "./SecurityCheck/contract";
import * as domain from "./SecurityCheck/domain";
import * as malicious from "./SecurityCheck/malicious-code";
import * as simulation from "./SecurityCheck/simulation";
import * as allowlist from "./SecurityCheck/allowlist";
import * as sign from "./SecurityCheck/sign";

const checkList = [domain, sign, contract, allowlist, simulation, address, malicious];

export async function checkTransaction(tx: any, env: any) {
  const start = Date.now();
  const result = await Promise.all(
    checkList.map((_: any) => {
      return _.checkTransaction(tx, env);
    })
  );
  const spend = Date.now() - start;
  return result.filter(_ => _);
}

async function test() {
    checkTransaction(
      {
        name: "setApprovalForAll",
        isRead: false,
        signature: "setApprovalForAll(address,bool)",
        args: ["0xB240F81Bf1A12D085C84B2422134bf18fd80e6Ba", true],
        to: "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
        raw: {
          from: "0xafd2c82d0768a13d125ca5da0695263840e68807",
          to: "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
          data: "0xa22cb465000000000000000000000000b240f81bf1a12d085c84b2422134bf18fd80e6ba0000000000000000000000000000000000000000000000000000000000000001",
        },
      },
      {
        host: "localhost:3000",
        url: "http://localhost:3000/",
        windowKeys: {
          keys: [
            {
              key: "_",
              code: "",
            },
            {
              key: "webpackHotUpdate",
              code: "function webpackHotUpdateCallback(chunkId, moreModules) {\n/******/ \t\thotAddUpdateChunk(chunkId, more",
            },
            {
              key: "testFunc",
              code: 'function testFunc() {\n  console.log("testFunc for api");\n  var poster = {\n    version: "0.0.2",\n  };',
            },
          ],
        },
      }
    );
}

// test();