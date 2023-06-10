const {expect} = require('chai');
const {ethers} = require('hardhat');

describe('Counter', () => {
    let counter
    beforeEach( async () => {
        const Counter = await ethers.getContractFactory('Counter')
        counter = await Counter.deploy('My Counter', 2)
    })

    it('stores the count', async () => {
        const count= await counter.count()
        expect(count).to.equal(2)
    })

    it('stores the name', async () => {
        const name= await counter.name()
        expect(name).to.equal('My Counter')
    })

    describe('Counting', () => {

        it('increments the count', async () => {
            let transaction= await counter.increment()
            await transaction.wait()
            let count= await counter.count()
            expect(count).to.equal(3) 

            transaction= await counter.increment()
            await transaction.wait()
            count= await counter.count()
            expect(count).to.equal(4) 
        })

        
        it('decrements the count', async () => {
            let transaction= await counter.decrement()
            await transaction.wait()
            let count= await counter.count()
            expect(count).to.equal(1) 

            transaction= await counter.decrement()
            await transaction.wait()
            count= await counter.count()
            expect(count).to.equal(0)
            
        })

        it('reads the name from the public name variable', async () => {
            let name= await counter.name()
            expect(name).to.equal('My Counter')
        })

        it('updates the name using setName() function', async () => {
            let update= await counter.setName('New name')
            await update.wait()
            let name= await counter.name()
            expect(name).to.equal('New name')
        })

        it('reads the name from the getName() function', async () => {
            expect(await counter.getName()).to.equal('My Counter')
        })
    })

})

