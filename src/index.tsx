import Inspector from "./FireWall/Inspector";
import App from "./App";
import {
  setupPortalShadowRoot,
  createReactRootShadowedPartial,
} from "./ShadowRoot";

import "./i18n";
import "./shared/api";

const firewall = new Inspector();
firewall.init();

function mountApp() {
  const createReactRootShadowed = createReactRootShadowedPartial({
    preventEventPropagationList: [],
  });
  const shadow = setupPortalShadowRoot({ mode: "closed" });
  createReactRootShadowed(shadow, { key: "app" }).render(
    <App firewall={firewall} />
  );
}

document.addEventListener("DOMContentLoaded", () => {
  console.log('mount interface')
  mountApp();
});


//  test
setTimeout(() => {
  /* @ts-ignore */
  if (window.location.host !== "localhost:3000") return;
  let count = 0;
  setInterval(() => {
    if (count > 10) return;
    /* @ts-ignore */
    // console.log(window.ethereum.isMetamask);
    count++;
  }, 1000);
  (async () => {
    try {
      /* @ts-ignore */
      const res = await Promise.all([
        /* @ts-ignore */
        window.ethereum.request({
          method: "eth_call",
          params: [
            {
              to: "0xfd43d1da000558473822302e1d44d81da2e4cc0d",
              data: "0x4e1273f4000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000ef0d8f546880d1d41e7f35c5ba06a43c7f42ff2f000000000000000000000000ef0d8f546880d1d41e7f35c5ba06a43c7f42ff2f000000000000000000000000ef0d8f546880d1d41e7f35c5ba06a43c7f42ff2f0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000009",
            },
            "latest",
          ],
        }),
        /* @ts-ignore */
        // window.ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [
        //     {
        //       from: "0xafd2c82d0768a13d125ca5da0695263840e68807",
        //       to: "0x24435375b29f83b9b3e7e868df963543e6b4892a",
        //       data: "0xf1ee997b0000000000000000000000000000000000000000000000000000000000000002",
        //     },
        //   ],
        // }),
        // window.ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [
        //     {
        //       from: "0xafd2c82d0768a13d125ca5da0695263840e68807",
        //       to: "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
        //       data: "0xa22cb465000000000000000000000000c5602b6d8f56a145779495d0e21685d5d99c49070000000000000000000000000000000000000000000000000000000000000001",
        //     },
        //   ],
        // }),
        window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: "0xafd2c82d0768a13d125ca5da0695263840e68807",
              to: "0x62ad923f2e6fa09e8bb3aca4192ac215c45b943a",
              data: "0x0fbe4fe20000000000000000000000000000000000000000000000000000000000000001",
              value: "0x0",
            },
          ],
        }),
      ]);
      // console.log("res", res);
    } catch (e) {
      // console.log("receive error", e);
    }

    /* @ts-ignore */
    // window.ethereum.request({
    //   method: "eth_sendTransaction",
    //   params: [
    //     {
    //       from: "0xb233a1097171d862bca31bf5071fbcb9a0563c81",
    //       to: "0x9fb036532d78b0e3ef4b649d534f1166cbd83ace",
    //       data: "0x42842e0e000000000000000000000000db3e1421df7dfb784f78f42c3b5cf9309afbc8cf00000000000000000000000068da372a96aca53e159ae8d72d6ffa267780d3d6000000000000000000000000000000000000000000000000000000000000151d",
    //     },
    //   ],
    // });
  })();
}, 4 * 1000);
