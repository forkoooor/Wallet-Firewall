const payload = {
    "domain": {
        "chainId": 1,
        "name": "Seaport",
        "version": "1.1",
        "verifyingContract": "0x00000000006c3852cbEf3e08E8dF289169EdE581"
    },
    "message": {
        "offerer": "0xAFD2C82D0768A13d125ca5DA0695263840E68807",
        "offer": [
            {
                "itemType": 2,
                "token": "0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93",
                "identifierOrCriteria": "7906",
                "startAmount": "1",
                "endAmount": "1"
            },
            {
                "itemType": 2,
                "token": "0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93",
                "identifierOrCriteria": "7733",
                "startAmount": "1",
                "endAmount": "1"
            },
            {
                "itemType": 2,
                "token": "0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93",
                "identifierOrCriteria": "7553",
                "startAmount": "1",
                "endAmount": "1"
            },
            {
                "itemType": 2,
                "token": "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
                "identifierOrCriteria": "1917",
                "startAmount": "1",
                "endAmount": "1"
            }
        ],
        "consideration": [
            {
                "itemType": 2,
                "token": "0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93",
                "identifierOrCriteria": "7906",
                "startAmount": "1",
                "endAmount": "1",
                "recipient": "0xfd7bd3578b01cfafeefde581d8a3ac2cf6e02c11"
            },
            {
                "itemType": 2,
                "token": "0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93",
                "identifierOrCriteria": "7733",
                "startAmount": "1",
                "endAmount": "1",
                "recipient": "0xfd7bd3578b01cfafeefde581d8a3ac2cf6e02c11"
            },
            {
                "itemType": 2,
                "token": "0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93",
                "identifierOrCriteria": "7553",
                "startAmount": "1",
                "endAmount": "1",
                "recipient": "0xfd7bd3578b01cfafeefde581d8a3ac2cf6e02c11"
            },
            {
                "itemType": 2,
                "token": "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
                "identifierOrCriteria": "1917",
                "startAmount": "1",
                "endAmount": "1",
                "recipient": "0xfd7bd3578b01cfafeefde581d8a3ac2cf6e02c11"
            }
        ],
        "startTime": "1654697296",
        "endTime": "1988064000",
        "orderType": 2,
        "zone": "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
        "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "salt": "5022689054477558522674370781106324528773091813350411458948384664963440",
        "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
        "counter": "0"
    },
    "primaryType": "OrderComponents",
    "types": {
        "EIP712Domain": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "version",
                "type": "string"
            },
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ],
        "ConsiderationItem": [
            {
                "name": "itemType",
                "type": "uint8"
            },
            {
                "name": "token",
                "type": "address"
            },
            {
                "name": "identifierOrCriteria",
                "type": "uint256"
            },
            {
                "name": "startAmount",
                "type": "uint256"
            },
            {
                "name": "endAmount",
                "type": "uint256"
            },
            {
                "name": "recipient",
                "type": "address"
            }
        ],
        "OfferItem": [
            {
                "name": "itemType",
                "type": "uint8"
            },
            {
                "name": "token",
                "type": "address"
            },
            {
                "name": "identifierOrCriteria",
                "type": "uint256"
            },
            {
                "name": "startAmount",
                "type": "uint256"
            },
            {
                "name": "endAmount",
                "type": "uint256"
            }
        ],
        "OrderComponents": [
            {
                "name": "offerer",
                "type": "address"
            },
            {
                "name": "zone",
                "type": "address"
            },
            {
                "name": "offer",
                "type": "OfferItem[]"
            },
            {
                "name": "consideration",
                "type": "ConsiderationItem[]"
            },
            {
                "name": "orderType",
                "type": "uint8"
            },
            {
                "name": "startTime",
                "type": "uint256"
            },
            {
                "name": "endTime",
                "type": "uint256"
            },
            {
                "name": "zoneHash",
                "type": "bytes32"
            },
            {
                "name": "salt",
                "type": "uint256"
            },
            {
                "name": "conduitKey",
                "type": "bytes32"
            },
            {
                "name": "counter",
                "type": "uint256"
            }
        ]
    }
}

  request = {
  method: "eth_signTypedData_v4",
  params: [
    "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
    JSON.stringify(payload),
  ],
  from: "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
  id: 1659364960573,
};


window.ethereum.request(request)