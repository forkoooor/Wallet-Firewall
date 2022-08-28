import * as address from "./SecurityCheck/address";
import * as contract from "./SecurityCheck/contract";
import * as domain from "./SecurityCheck/domain";
import * as malicious from "./SecurityCheck/malicious-code";
import * as simulation from "./SecurityCheck/simulation";
import * as allowlist from "./SecurityCheck/allowlist";
import * as sign from "./SecurityCheck/sign-check/sign";
import * as fakeWallet from "./SecurityCheck/page-check/fake-wallet";
import * as siteStatus from "./SecurityCheck/page-check/site-status";
import * as highlightAction from "./SecurityCheck/highlight-action";
import * as nftHoneypot from "./SecurityCheck/nft-honeypot";

const commonCheckList: any[] = [
  domain,
  sign,
  malicious,
  highlightAction,
];

const checkList: any[] = [
  contract,
  allowlist,
  simulation, 
  address,
  nftHoneypot
];

const pageCheckList = [fakeWallet];
const pageCheckListOnce = [siteStatus];

function addLog(data: any) {
  const div = document.createElement('div');
  div.innerText = JSON.stringify(data, null, 2);
  document.body.appendChild(div);
}

export async function checkTransaction(tx: any, env: any) {
  const start = Date.now();
  const toCheckList = env.chainId === '0x1' ? commonCheckList.concat(checkList) : commonCheckList;
  try {
    const result = await Promise.all(
      toCheckList.map(async (_: any) => {
        try {
          return await _.checkTransaction(tx, env);
        } catch(e) {}
        return null;
      })
    );
    const spend = Date.now() - start;
    return result.filter((_) => _);
  } catch(error: any) {
    console.log('checkTransaction.error', error)
  }
  return []
}

export async function checkPage(isOnce = false) {
  const start = Date.now();
  const useList = isOnce ? pageCheckListOnce : pageCheckList;
  try {
    const result = await Promise.all(
      useList.map((_: any) => {
        return _.checkPage();
      })
    );
    const spend = Date.now() - start;
    return result.filter((_) => _);
  } catch(e) {}
  return [];
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
        from: '0x67fa9c3613b8b8c8c15b41023895ca3a6b09fb62',   
        to: '0xcc39ebea634483cd19f2dc30133aa9a237d61903',
        data: '0x9fb17e340000000000000000000000000000000000000000000000000000000000000002',
        value: '1000000'
        // from: "0xafd2c82d0768a13d125ca5da0695263840e68807",
        // to: "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
        // data: "0xa22cb465000000000000000000000000b240f81bf1a12d085c84b2422134bf18fd80e6ba0000000000000000000000000000000000000000000000000000000000000001",
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
