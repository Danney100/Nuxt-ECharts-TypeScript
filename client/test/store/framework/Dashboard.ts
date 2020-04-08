// import { expect } from 'chai'

// describe('Dashboard mutations', () => {
//   it('should create', async function() {
//     await store.dispatch('updateCount', 2)
//     expect(parseInt(store.state.mm.count, 10)).to.equal(2)

//     await store.dispatch('updateCountOnlyOnEven', 8)
//     expect(parseInt(store.state.mm.count, 10)).to.equal(8)

//     // try {
//     //   await store.dispatch('updateCountButNoSuchPayload', '1337')
//     // } catch (e) {
//     //   expect(e.message).to.contain('ERR_MUTATE_PARAMS_NOT_IN_PAYLOAD')
//     // }

//     try {
//       await store.dispatch('updateCountOnlyOnEven', 7)
//     } catch (e) {
//       expect(e.message).to.contain('not an even number')
//     }
//   })

//   it('should update fruitname', async function() {
//     await store.dispatch('changeFruit', 'Guava')
//     expect(store.state.mm.fruit).to.equal('Guava')
//   })
// })
