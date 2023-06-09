const transferFlowToken = `
    import FungibleToken from 0xFT
    import FlowToken from 0xFLOW

    transaction(recepient: Address, amount: UFix64){

        prepare(signer: AuthAccount){
            let sender = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow Provider reference to the Vault")

            let receiverAccount = getAccount(recepient)

            let receiver = receiverAccount.getCapability(/public/flowTokenReceiver)
            .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
            ?? panic("Could not borrow Receiver reference to the Vault")

            let tempVault <- sender.withdraw(amount: amount)
            receiver.deposit(from: <- tempVault)
        }
    } 
`;

export default transferFlowToken;
