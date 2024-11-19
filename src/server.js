import express from 'express'
import cors from 'cors'
import { writeContract } from '@wagmi/core'
import { erc20Abi } from 'viem'
import { FAUCET_TOKEN_AMOUNT, TOKEN_DECIMALS } from './utils/constants.js'
import { walletClient, adminAccount } from './utils/accounts.js'

let canMint = {} // 나중에 날짜로 바꾸기

// express 서버 생성
const app = express()
const port = 3001
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/mint', async (req, res) => {
    const address = req.query.address;
    console.log('address:', address);

    // cooldown에 address가 없으면 추가
    if (!(address in canMint)) {
        canMint[address] = true;
    }

    // 쿨다운 검사
    if (canMint[address] === false) {
        res.json({
            msg: `쿨다운`,
            hash: hash,
            amount: FAUCET_TOKEN_AMOUNT
        });
    } else {
        // 실제로 Mint하는 로직
        const hash = await walletClient.writeContract({
            address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS, // ERC-20 토큰 컨트랙트 주소
            abi: [{
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "mint",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }],
            functionName: 'mint',
            args: [address, FAUCET_TOKEN_AMOUNT * 10 ** TOKEN_DECIMALS],
            account: adminAccount,
        })

        canMint[address] = false;
        setTimeout(() => {
            canMint[address] = true;
        }, 1000 * 10);

        res.json({
            msg: `성공`,
            hash: hash,
            amount: FAUCET_TOKEN_AMOUNT
        });
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})