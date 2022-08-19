const { buildPermitTypedData } = require('@1inch/permit-signed-approvals-utils');

const chainId = 56;
const contractAddress = '0x11111112542d85b3ef69ae05771c2dccff4faa26';
const tokenAddress = '0x111111111117dc0aa78b770fa6a738034120c302';
const tokenName = '1INCH Token';
const walletAddress = '0x2c9b2dbdba8a9c969ac24153f5c1c23cb0e63914';

const payload = buildPermitTypedData({
    chainId,
    tokenName,
    tokenAddress,
    params: {
        owner: walletAddress,
        spender: contractAddress,
        value: '1000000000',
        nonce: 0,
        deadline: 192689033,
    }
});

console.log('payload', JSON.stringify(payload, null, 2))