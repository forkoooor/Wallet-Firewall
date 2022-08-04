import Inspector from "./FireWall/Inspector";
import App from "./App";
import {
  setupPortalShadowRoot,
  createReactRootShadowedPartial,
} from "./ShadowRoot";

import "./i18n";
import "./shared/api";

const version = '0.0.31';
const firewall = new Inspector();
firewall.init();

// console.log('run', Date.now());
function mountApp() {
  console.log("mount interface", version);
  const createReactRootShadowed = createReactRootShadowedPartial({
    preventEventPropagationList: [],
  });
  const shadow = setupPortalShadowRoot({ mode: "closed" });
  createReactRootShadowed(shadow, { key: "app" }).render(
    <App firewall={firewall} />
  );
}

/* @ts-ignore */
if (document.body){
  mountApp();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    mountApp();
  });
}
 
//  test
setTimeout(() => {
  /* @ts-ignore */
  if (window.location.host !== "localhost:3000") return;
  return;
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
        // window.ethereum.request({
        //   method: "eth_call",
        //   params: [
        //     {
        //       to: "0xfd43d1da000558473822302e1d44d81da2e4cc0d",
        //       data: "0x4e1273f4000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000ef0d8f546880d1d41e7f35c5ba06a43c7f42ff2f000000000000000000000000ef0d8f546880d1d41e7f35c5ba06a43c7f42ff2f000000000000000000000000ef0d8f546880d1d41e7f35c5ba06a43c7f42ff2f0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000009",
        //     },
        //     "latest",
        //   ],
        // }),
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
        // window.ethereum.request({
        //   method: "eth_signTypedData_v4",
        //   params: [
        //     "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
        //     '{"domain":{"chainId":1,"name":"Seaport","version":"1.1","verifyingContract":"0x00000000006c3852cbEf3e08E8dF289169EdE581"},"message":{"offerer":"0xAFD2C82D0768A13d125ca5DA0695263840E68807","offer":[{"itemType":2,"token":"0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93","identifierOrCriteria":"7906","startAmount":"1","endAmount":"1"},{"itemType":2,"token":"0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93","identifierOrCriteria":"7733","startAmount":"1","endAmount":"1"},{"itemType":2,"token":"0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93","identifierOrCriteria":"7553","startAmount":"1","endAmount":"1"},{"itemType":2,"token":"0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e","identifierOrCriteria":"1917","startAmount":"1","endAmount":"1"}],"consideration":[{"itemType":2,"token":"0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93","identifierOrCriteria":"7906","startAmount":"1","endAmount":"1","recipient":"0xc0fdf4fa92f88b82ccbebfc80fbe4eb7e5a8e0ca"},{"itemType":2,"token":"0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93","identifierOrCriteria":"7733","startAmount":"1","endAmount":"1","recipient":"0xc0fdf4fa92f88b82ccbebfc80fbe4eb7e5a8e0ca"},{"itemType":2,"token":"0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93","identifierOrCriteria":"7553","startAmount":"1","endAmount":"1","recipient":"0xc0fdf4fa92f88b82ccbebfc80fbe4eb7e5a8e0ca"},{"itemType":2,"token":"0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e","identifierOrCriteria":"1917","startAmount":"1","endAmount":"1","recipient":"0xc0fdf4fa92f88b82ccbebfc80fbe4eb7e5a8e0ca"}],"startTime":"1654697296","endTime":"1988064000","orderType":2,"zone":"0x004C00500000aD104D7DBd00e3ae0A5C00560C00","zoneHash":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"5022689054477558522674370781106324528773091813350411458948384664963440","conduitKey":"0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000","counter":"0"},"primaryType":"OrderComponents","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"ConsiderationItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"},{"name":"recipient","type":"address"}],"OfferItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"}],"OrderComponents":[{"name":"offerer","type":"address"},{"name":"zone","type":"address"},{"name":"offer","type":"OfferItem[]"},{"name":"consideration","type":"ConsiderationItem[]"},{"name":"orderType","type":"uint8"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"zoneHash","type":"bytes32"},{"name":"salt","type":"uint256"},{"name":"conduitKey","type":"bytes32"},{"name":"counter","type":"uint256"}]}}',
        //   ],
        //   from: "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
        //   id: 1659364960573,
        // }),
        /* @ts-ignore */
        window.ethereum.request({
          method: "personal_sign",
          params: [
            `Welcome, 

Click to sign in and accept the Terms of Service.

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet Address:
0xbe862AD9AbFe6f22BCb087716c7D89a26051f74C

Nonce:
6OquihMe-qlKN-qMPc-NiEECAPTFI4A`,
            "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
          ],
        }),
        // window.ethereum.request({
        //   method: "eth_sign",
        //   params: [
        //     "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
        //     "0x685362ab31202630bffb9974f4fe46bbf569d45ea13f32d05d5a6f574aea7f8e",
        //   ],
        // }),
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
