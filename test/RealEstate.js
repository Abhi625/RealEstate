const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether= tokens

describe('RealEstate', () => {
    let realEstate, escrow
    let deployer, seller
    let nftID= 1

    beforeEach(async () => {
        //setup accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        seller = deployer
        buyer= accounts[1]
        inspector= accounts[2]
        lender= accounts[3]
        purchasePrice= ether(100)
        escrowAmount= ether(20)
        //Load contracts
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')

        //deploy contracts
        realEstate = await RealEstate.deploy()
        escrow = await Escrow.deploy
        (realEstate.address,
            nftID,
            purchasePrice,
            escrowAmount,
            seller.address,
            buyer.address,
            inspector.address,
            lender.address)
       
        transaction= await realEstate.connect(seller).approve(escrow.address, nftID)
        await transaction.wait()
    })

    describe('Deployment', async () => {
        it('sends an NFT to the seller /deployer', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })

    describe('Selling real estate', async () => {
        let balance
        it('executes a successful transaction', async () => {
            //Expects seller to be NFT owner before the sale
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)

            //Check escrow balance
            balance= await escrow.getBalance()
            console.log("escrow balance:", ethers.utils.formatEther(balance))

            //Buyer deposits earnest
            transaction= await escrow.connect(buyer).depositEarnest({value: ether(30)})
            console.log("buyer deposits earnest money")

            //Check escrow balance
            balance= await escrow.getBalance()
            console.log("escrow balance:", ethers.utils.formatEther(balance))

            //Inspector updates status
            transaction= await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()
            console.log("Inspector updates status")

            //Buyer approves sale
            transaction = await escrow.connect(buyer).approveSale()
            await transaction.wait()
            console.log("Buyer approves sale")

            //Seller approves sale
            transaction = await escrow.connect(seller).approveSale()
            await transaction.wait()
            console.log("Seller approves sale")

            //lender funds sale
            transaction= await lender.sendTransaction({to: escrow.address, value: ether(80)})
            await transaction.wait()
            console.log("lender sends remmaning funds")

             //Check escrow balance
             balance= await escrow.getBalance()
             console.log("escrow balance:", ethers.utils.formatEther(balance))

            //lender approves sale
            transaction = await escrow.connect(lender).approveSale()
            await transaction.wait()
            console.log("lender approves sale")

            //Finalize sale
            transaction= await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log("Buyer finalizes sale")

            //Expects buyer to be NFT owner after the sale
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)
        
            //Check seller balance
             balance= await ethers.provider.getBalance(seller.address)
             console.log("seller balance:", ethers.utils.formatEther(balance))
            expect(balance).to.be.above(ether(10109))
            })
    })
})