async function main() {
    const TestToken = await ethers.getContractFactory("Drop");
    const testToken = TestToken.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    try {
        const balance1 = await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

        console.log(`Balance of addr1: ${balance1.toString()}`);
    } catch (error) {
        console.error("Error fetching balances:", error); // 더 자세한 오류 메시지 출력
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
