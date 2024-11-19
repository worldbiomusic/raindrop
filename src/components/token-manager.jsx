import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi } from 'viem'
import { FAUCET_TOKEN_AMOUNT } from '../utils/constants.js'
import axios from 'axios';

export function TokenManagerComponent() {
  const axiosBase = axios.create({
    baseURL: 'http://localhost:3001', // 예시 도메인
  });

  const { address, isConnected } = useAccount();
  const { data } = useBalance({
    address: address,
    token: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS, // 로컬 Hardhat 네트워크의 ERC-20 토큰 주소
  });

  const [balance, setBalance] = useState(0)
  const [transferAmount, setTransferAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [message, setMessage] = useState("")

  // Transfer 실행 설정
  const { data: transactionHash, writeContract, isError, isSuccess: isContractSuccess } = useWriteContract();

  // 트랜잭션 완료 대기
  const { isLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: transactionHash });

  useEffect(() => {
    if (isConnected) {
      console.log(data); // 로그에 실제 데이터를 출력   
      setBalance(data ? parseFloat(data?.formatted) : 0);
    }
  }, [isConnected, data]);

  useEffect(() => {
    if (isTxSuccess) {
      setMessage(`${transferAmount} 토큰이 성공적으로 ${recipientAddress}로 전송되었습니다.`);
      setBalance((prevBalance) => prevBalance - Number(transferAmount));
      setTransferAmount("");
      setRecipientAddress("");
    }
  }, [isTxSuccess])

  const handleReceiveTokens = async () => {
    setMessage("토큰 받기 처리 중...")

    const response = await axiosBase.get(`/mint?address=${address}`)

    const data = response.data;
    console.log(data);
    const msg = data.msg;
    const hash = data.hash;
    const amount = data.amount;

    if (msg === '성공') {
      console.log('hash:', hash);
      // setBalance((prevBalance) => prevBalance + FAUCET_TOKEN_AMOUNT)
      setMessage(`${amount} 토큰을 받았습니다!`)
    } else if (msg === '쿨다운') {
      setMessage(`쿨다운 중입니다.`)
    } else {
      setMessage(`실패 ㅠㅠ...`)
      console.log(msg)
    }
  }

  const handleTransferTokens = async () => {
    setMessage("토큰 전송 처리 중...")

    const amount = Number(transferAmount)
    if (isNaN(amount) || amount <= 0) {
      setMessage("유효한 전송 금액을 입력하세요.")
      return
    }
    if (amount > balance) {
      setMessage("잔액이 부족합니다.")
      return
    }
    if (!recipientAddress || recipientAddress.trim() === "") {
      setMessage("유효한 받는 주소를 입력하세요.")
      return
    }

    try {
      writeContract({
        address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS, // ERC-20 토큰 컨트랙트 주소
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipientAddress, transferAmount * 10 ** data?.decimals]
      })
    } catch (error) {
      setMessage("토큰 전송 실패: " + error.message)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>토큰 관리자</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-2xl font-bold">
          잔액: {balance} 토큰
        </div>
        <div className="flex justify-center">
          <Button onClick={handleReceiveTokens}>토큰 받기</Button>
        </div>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="받는 주소"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="전송할 토큰 수량"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <Button onClick={handleTransferTokens} disabled={isLoading}>토큰 전송</Button>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">{message}</div>
      </CardContent>
    </Card>
  )
}