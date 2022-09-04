

import { ethers } from "ethers";
import { provider } from "../provider/eth";
import { Provider, Contract } from "ethers-multicall";

const OpenSeaConduit = "0x1e0049783f008a0085193e00003d00cd54003c71";
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const ethcallProvider = new Provider(provider, 1);

export async function fetchOrders(contract: string, tokenId: string) {
    const req = await fetch("https://opensea.io/__api/graphql/", {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh,en;q=0.9,ar;q=0.8,zh-CN;q=0.7",
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-app-id": "opensea-web",
            "x-build-id": "af0e9ca812b26a43587fe8173acd2194e98701e9",
            "x-signed-query": "dca533c8543ae52c1fe8fa97823f7bf281bac34ecd412f5e5a5224070cbfa5c3",
        },
        "referrer": "https://opensea.io/",
        "referrerPolicy": "strict-origin",
        "body": JSON.stringify({
            "id": "OrdersQuery",
            "query": "query OrdersQuery(\n  $cursor: String\n  $count: Int = 10\n  $excludeMaker: IdentityInputType\n  $isExpired: Boolean\n  $isValid: Boolean\n  $isInactive: Boolean\n  $maker: IdentityInputType\n  $makerArchetype: ArchetypeInputType\n  $makerAssetIsPayment: Boolean\n  $takerArchetype: ArchetypeInputType\n  $takerAssetCategories: [CollectionSlug!]\n  $takerAssetCollections: [CollectionSlug!]\n  $takerAssetIsOwnedBy: IdentityInputType\n  $takerAssetIsPayment: Boolean\n  $sortAscending: Boolean\n  $sortBy: OrderSortOption\n  $makerAssetBundle: BundleSlug\n  $takerAssetBundle: BundleSlug\n  $expandedMode: Boolean = false\n  $isBid: Boolean = false\n  $filterByOrderRules: Boolean = false\n  $includeCriteriaOrders: Boolean = false\n  $criteriaTakerAssetId: AssetRelayID\n  $includeCriteriaTakerAsset: Boolean = false\n) {\n  ...Orders_data_JYMoI\n}\n\nfragment AccountLink_data on AccountType {\n  address\n  config\n  isCompromised\n  user {\n    publicUsername\n    id\n  }\n  displayName\n  ...ProfileImage_data\n  ...wallet_accountKey\n  ...accounts_url\n}\n\nfragment AssetMediaAnimation_asset on AssetType {\n  ...AssetMediaImage_asset\n}\n\nfragment AssetMediaAudio_asset on AssetType {\n  backgroundColor\n  ...AssetMediaImage_asset\n}\n\nfragment AssetMediaContainer_asset_2V84VL on AssetType {\n  backgroundColor\n  ...AssetMediaEditions_asset_2V84VL\n}\n\nfragment AssetMediaEditions_asset_2V84VL on AssetType {\n  decimals\n}\n\nfragment AssetMediaImage_asset on AssetType {\n  backgroundColor\n  imageUrl\n  collection {\n    displayData {\n      cardDisplayStyle\n    }\n    id\n  }\n}\n\nfragment AssetMediaPlaceholderImage_asset on AssetType {\n  collection {\n    displayData {\n      cardDisplayStyle\n    }\n    id\n  }\n}\n\nfragment AssetMediaVideo_asset on AssetType {\n  backgroundColor\n  ...AssetMediaImage_asset\n}\n\nfragment AssetMediaWebgl_asset on AssetType {\n  backgroundColor\n  ...AssetMediaImage_asset\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  displayImageUrl\n  imageUrl\n  isDelisted\n  ...AssetMediaAnimation_asset\n  ...AssetMediaAudio_asset\n  ...AssetMediaContainer_asset_2V84VL\n  ...AssetMediaImage_asset\n  ...AssetMediaPlaceholderImage_asset\n  ...AssetMediaVideo_asset\n  ...AssetMediaWebgl_asset\n}\n\nfragment CancelOrderButton_data on OrderV2Type {\n  id\n  item {\n    __typename\n    ... on AssetType {\n      chain {\n        identifier\n      }\n    }\n    ... on AssetBundleType {\n      chain {\n        identifier\n      }\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n  isFulfillable\n  oldOrder\n  orderType\n  side\n}\n\nfragment CollectionCell_collection on CollectionType {\n  name\n  imageUrl\n  isVerified\n  ...collection_url\n}\n\nfragment CollectionCell_trait on TraitType {\n  traitType\n  value\n}\n\nfragment ExpirationDate_data on OrderV2Type {\n  closedAt\n}\n\nfragment ItemCell_data on ItemType {\n  __isItemType: __typename\n  __typename\n  name\n  ...item_url\n  ... on AssetType {\n    collection {\n      name\n      id\n    }\n    ...AssetMedia_asset\n  }\n  ... on AssetBundleType {\n    bundleCollection: collection {\n      name\n      id\n    }\n    assetQuantities(first: 2) {\n      edges {\n        node {\n          asset {\n            name\n            ...AssetMedia_asset\n            id\n          }\n          relayId\n          id\n        }\n      }\n    }\n  }\n}\n\nfragment OrderPrice on OrderV2Type {\n  priceType {\n    unit\n  }\n  perUnitPriceType {\n    unit\n  }\n  dutchAuctionFinalPriceType {\n    unit\n  }\n  openedAt\n  closedAt\n  payment {\n    ...TokenPricePayment\n    id\n  }\n}\n\nfragment OrderUsdPrice on OrderV2Type {\n  priceType {\n    usd\n  }\n  perUnitPriceType {\n    usd\n  }\n  dutchAuctionFinalPriceType {\n    usd\n  }\n  openedAt\n  closedAt\n}\n\nfragment Orders_data_JYMoI on Query {\n  criteriaTakerAsset: asset(asset: $criteriaTakerAssetId) @include(if: $includeCriteriaTakerAsset) {\n    ownedQuantity(identity: {})\n    decimals\n    isDelisted\n    relayId\n    ...asset_url\n    id\n  }\n  orders(after: $cursor, excludeMaker: $excludeMaker, first: $count, isExpired: $isExpired, isInactive: $isInactive, isValid: $isValid, maker: $maker, makerArchetype: $makerArchetype, makerAssetIsPayment: $makerAssetIsPayment, takerArchetype: $takerArchetype, takerAssetCategories: $takerAssetCategories, takerAssetCollections: $takerAssetCollections, takerAssetIsOwnedBy: $takerAssetIsOwnedBy, takerAssetIsPayment: $takerAssetIsPayment, sortAscending: $sortAscending, sortBy: $sortBy, makerAssetBundle: $makerAssetBundle, takerAssetBundle: $takerAssetBundle, filterByOrderRules: $filterByOrderRules, includeCriteriaOrders: $includeCriteriaOrders) {\n    edges {\n      node {\n        isValid\n        openedAt\n        orderType\n        hasPendingTransactions\n        remainingQuantityType\n        maker {\n          address\n          ...AccountLink_data\n          ...wallet_accountKey\n          id\n        }\n        payment {\n          relayId\n          id\n        }\n        item {\n          __typename\n          relayId\n          chain {\n            identifier\n          }\n          ... on AssetType {\n            ...asset_url\n            decimals\n            ownedQuantity(identity: {})\n            isDelisted\n          }\n          ... on AssetBundleType {\n            assetQuantities(first: 30) {\n              edges {\n                node {\n                  asset {\n                    relayId\n                    isDelisted\n                    ownedQuantity(identity: {})\n                    decimals\n                    id\n                  }\n                  id\n                }\n              }\n            }\n          }\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n        relayId\n        side\n        taker {\n          address\n          ...AccountLink_data\n          ...wallet_accountKey\n          id\n        }\n        perUnitPriceType {\n          eth\n          usd\n        }\n        ...OrderPrice\n        ...OrderUsdPrice\n        item @include(if: $isBid) {\n          __typename\n          ... on AssetType {\n            collection {\n              statsV2 {\n                floorPrice {\n                  eth\n                }\n              }\n              id\n            }\n          }\n          ... on AssetBundleType {\n            bundleCollection: collection {\n              statsV2 {\n                floorPrice {\n                  eth\n                }\n              }\n              id\n            }\n          }\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n        criteria @include(if: $isBid) {\n          collection {\n            ...CollectionCell_collection\n            id\n          }\n          trait {\n            ...CollectionCell_trait\n            id\n          }\n        }\n        item @include(if: $expandedMode) {\n          __typename\n          ...ItemCell_data\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n        ...CancelOrderButton_data\n        ...ExpirationDate_data\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ProfileImage_data on AccountType {\n  imageUrl\n}\n\nfragment TokenPricePayment on PaymentAssetType {\n  symbol\n  chain {\n    identifier\n  }\n  asset {\n    imageUrl\n    assetContract {\n      blockExplorerLink\n      id\n    }\n    id\n  }\n}\n\nfragment accounts_url on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n}\n\nfragment asset_url on AssetType {\n  assetContract {\n    address\n    id\n  }\n  tokenId\n  chain {\n    identifier\n  }\n}\n\nfragment bundle_url on AssetBundleType {\n  slug\n  chain {\n    identifier\n  }\n}\n\nfragment collection_url on CollectionType {\n  slug\n  isCategory\n}\n\nfragment item_url on ItemType {\n  __isItemType: __typename\n  __typename\n  ... on AssetType {\n    ...asset_url\n  }\n  ... on AssetBundleType {\n    ...bundle_url\n  }\n}\n\nfragment wallet_accountKey on AccountType {\n  address\n}\n",
            "variables": {
                "cursor": null,
                "count": 10,
                "excludeMaker": null,
                "isExpired": false,
                "isValid": true,
                "isInactive": null,
                "maker": null,
                "makerArchetype": null,
                "makerAssetIsPayment": true,
                "takerArchetype": {
                    "assetContractAddress": contract,
                    "tokenId": tokenId,
                    "chain": "ETHEREUM"
                },
                "takerAssetCategories": null,
                "takerAssetCollections": null,
                "takerAssetIsOwnedBy": null,
                "takerAssetIsPayment": null,
                "sortAscending": null,
                "sortBy": "MAKER_ASSETS_USD_PRICE",
                "makerAssetBundle": null,
                "takerAssetBundle": null,
                "expandedMode": false,
                "isBid": true,
                "filterByOrderRules": true,
                "includeCriteriaOrders": true,
                "criteriaTakerAssetId": "QXNzZXRUeXBlOjQxMjMyMjQ1Mg==",
                "includeCriteriaTakerAsset": true
            }
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });    
    return await req.json()
}

async function fetchOffer(contract: string, tokenId: string) {
    const offer = await fetchOrders(contract, tokenId);
    const orders = offer.data.orders.edges.map((_: any) => _.node).filter((_: any) => _.side === "BID").map((_: any) => {
        return {
            makerAddress: _.maker.address,
            token: _.payment.symbol,
            chain: _.payment.chain,
            user: _.maker.user,
        }
    });
    return orders
}

async function checkOffers(offers: any[]) {

  const ERC20ABI = [
    `function allowance(address user, address spender) public view returns (uint256)`,
  ]
  const validOffers = offers.filter((_) => _.token === "WETH")
  const allCalls = validOffers.map((offer) => {
      const erc20 = new Contract(WETH, ERC20ABI);
      return erc20.allowance(offer.makerAddress, OpenSeaConduit);
    });

  const checkResults = await ethcallProvider.all(allCalls);
  const zeroAllowanceOffers = validOffers.filter((offer, index) => {
    const allowance = checkResults[index];
    return allowance.isZero();
  })

  console.log("zeroAllowanceOffers", zeroAllowanceOffers);
  return zeroAllowanceOffers;
}


// in-page
export async function checkPage() {
  const url = window.location.href;
  if (url.indexOf('assets') > -1) {
    const pair = url.split('assets/')[1];
    const [chain, contract, tokenId] = pair.split('/');
    // console.log(chain, contract, tokenId)
    const orders = await fetchOffer(contract, tokenId);
    const validOrders = await checkOffers(orders);
    console.log('validOrders', validOrders)
  }
}
