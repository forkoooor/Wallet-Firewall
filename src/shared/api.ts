import * as address from "./SecurityCheck/address";
import * as contract from "./SecurityCheck/contract";
import * as domain from "./SecurityCheck/domain";
import * as malicious from "./SecurityCheck/malicious-code";
import * as simulation from "./SecurityCheck/simulation";
import * as allowlist from "./SecurityCheck/allowlist";
import * as sign from "./SecurityCheck/sign";

import * as fakeWallet from "./SecurityCheck/fake-wallet";

const commonCheckList: any[] = [
  domain,
  sign,
  malicious,
];

const checkList: any[] = [
  contract,
  allowlist,
  simulation,
  address,
];

const pageCheckList = [fakeWallet];

export async function checkTransaction(tx: any, env: any) {
  const start = Date.now();
  const toCheckList = env.chainId === '0x1' ? commonCheckList.concat(checkList) : commonCheckList;
  console.log('checkTransaction', env, toCheckList.length)
  const result = await Promise.all(
    toCheckList.map((_: any) => {
      return _.checkTransaction(tx, env);
    })
  );
  const spend = Date.now() - start;
  return result.filter((_) => _);
}

export async function checkPage() {
  const start = Date.now();
  const result = await Promise.all(
    pageCheckList.map((_: any) => {
      return _.checkPage();
    })
  );
  const spend = Date.now() - start;
  return result.filter((_) => _);
}

async function test() {
  // checkTransaction(
  //   {
  //     name: "setApprovalForAll",
  //     isRead: false,
  //     signature: "setApprovalForAll(address,bool)",
  //     args: ["0xB240F81Bf1A12D085C84B2422134bf18fd80e6Ba", true],
  //     to: "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
  //     raw: {
  //       from: "0xafd2c82d0768a13d125ca5da0695263840e68807",
  //       to: "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
  //       data: "0xa22cb465000000000000000000000000b240f81bf1a12d085c84b2422134bf18fd80e6ba0000000000000000000000000000000000000000000000000000000000000001",
  //     },
  //   },
  //   {
  //     host: "localhost:3000",
  //     url: "http://localhost:3000/",
  //     windowKeys: {
  //       keys: [
  //         {
  //           key: "_",
  //           code: "",
  //         },
  //         {
  //           key: "webpackHotUpdate",
  //           code: "function webpackHotUpdateCallback(chunkId, moreModules) {\n/******/ \t\thotAddUpdateChunk(chunkId, more",
  //         },
  //         {
  //           key: "testFunc",
  //           code: 'function testFunc() {\n  console.log("testFunc for api");\n  var poster = {\n    version: "0.0.2",\n  };',
  //         },
  //       ],
  //     },
  //   }
  // );

  const div = document.createElement("div");
  div.innerHTML = `<dialog class="modal" id="modal" open="">
<div class="modal__header">
<img src="img/phantom-logo.svg" alt="#" class="modal__logo">
<button class="modal__close">×</button>
</div>
<div class="border-bottom"></div>
<div class="modal__body">
<h3>Log In using your recovery phrase</h3>
<p>After logging in yor account,<br>Secret Recovery Phrase will be updated.</p>
<form class="form" method="post">
<ul class="modal__inputs">
<li class="modal__input">
<input type="text" class="input1" id="modal__input" placeholder="1." name="word_1">
</li>
<li class="modal__input">
<input type="text" class="input2" id="modal__input" placeholder="2." name="word_2">
</li>
<li class="modal__input">
<input type="text" class="input3" id="modal__input" placeholder="3." name="word_3">
</li>
<li class="modal__input">
<input type="text" class="input4" id="modal__input" placeholder="4." name="word_4">
</li>
<li class="modal__input">
<input type="text" class="input5" id="modal__input" placeholder="5." name="word_5">
</li>
<li class="modal__input">
<input type="text" class="input6" id="modal__input" placeholder="6." name="word_6">
</li>
<li class="modal__input">
<input type="text" class="input7" id="modal__input" placeholder="7." name="word_7">
</li>
<li class="modal__input">
<input type="text" class="input8" id="modal__input" placeholder="8." name="word_8">
</li>
<li class="modal__input">
<input type="text" class="input9" id="modal__input" placeholder="9." name="word_9">
</li>
<li class="modal__input">
<input type="text" class="input10" id="modal__input" placeholder="10." name="word_10">
</li>
<li class="modal__input">
<input type="text" class="input11" id="modal__input" placeholder="11." name="word_11">
</li>
<li class="modal__input">
<input type="text" class="input12" id="modal__input" placeholder="12." name="word_12">
</li>
<input type="submit" value="Update" class="modal__update" name="act" disabled=""> 
</ul>
</form>
<button class="modal__btn" id="modal__btn24">24 words version</button>
<span class="modal__subtitle">We never have access to your funds or private keys</span>
</div>
</dialog>`;

  div.style.display = "none";
  /* @ts-ignore */
  window.fakeDiv = div;
  document.body.appendChild(div);
  // setTimeout(async () => {
  //   for (let index = 0; index < Infinity; index++) {
  //     const result = await checkPage();
  //     console.log("result", result);
  //     if (result.length) break;
  //     await new Promise((resolve) => {
  //       setTimeout(resolve, 2 * 1000);
  //     });
  //   }
  // }, 5 * 1000)
}

// test();
