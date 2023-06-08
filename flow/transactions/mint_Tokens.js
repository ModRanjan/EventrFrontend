import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';

const mintTokens = async (eventID, categoryIDs, quantities, ownerAddr) => {
  console.log(
    `eventID: ${eventID}, categoryIDs: ${categoryIDs}, quantities: ${quantities}, ownerAddr: ${ownerAddr}`,
  );

  const Cadence = ` 
    // mint_token
    import Eventr1 from 0xEventr
    import FlowToken from 0xFlowToken 
    import FungibleToken from 0xFungibleToken

    transaction(eventID: UInt64, categoryIDs: [UInt64], quantities: [UInt32], ownerAddr: Address) {

      let eventOwnerCapability: &AnyResource{Eventr1.NFTMinterPublic}
    
      prepare(signer: AuthAccount) {
    
        let adminPublicPath = PublicPath(identifier: "EventrAdminEventId".concat(eventID.toString()))
          ?? panic("does not specify a public path")
    
        let senderFlowTokenVault = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
        ?? panic("Could not borrow Provider reference to the Vault")
      
        let eventOwnerAccount = getAccount(ownerAddr)
      
        // borrow a reference to the Admin resource in storage
        self.eventOwnerCapability =  eventOwnerAccount.getCapability(adminPublicPath).borrow<&{Eventr1.NFTMinterPublic}>()
          ?? panic("Cannot borrow a reference to the Admin's <MintNFTPublic> resource")
      
        let flowTokenVaultReceiverCapability: Capability<&FlowToken.Vault{FungibleToken.Receiver}> = eventOwnerAccount.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
    
        // get the Collection reference for the receiving eventr
        let collectionRef = signer.getCapability(Eventr1.CollectionPublicPath).borrow<&{Eventr1.CollectionPublic}>()
          ?? panic("Cannot borrow a reference to the Eventr Collection from recipient")
      
        for index, categoryId in categoryIDs {
          self.eventOwnerCapability.batchMintToken(eventID: eventID, categoryID: categoryId, quantity: quantities[index],  collection: collectionRef, ownerFlowTokenVault: flowTokenVaultReceiverCapability, buyerFlowTokenVault: senderFlowTokenVault)
    
          // self.eventOwnerCapability.testBatchMintToken(eventID: eventID, categoryID: categoryId, quantity: quantities[index], price: prices[index], collection: receiverRef)
    
          log(index)
          log("token mintd")
        }
      }
    }
    `;

  const payload = await fcl.args([
    fcl.arg(eventID.toString(), t.UInt64),
    fcl.arg(categoryIDs, t.Array(t.UInt64)),
    fcl.arg(quantities, t.Array(t.UInt32)),
    fcl.arg(ownerAddr, t.Address),
  ]);

  return await fcl.send([
    fcl.transaction(`${Cadence}`),
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(999),
    payload,
  ]);
};
export default mintTokens;
