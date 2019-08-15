import { firstInningsTimeLost, matchStartLate, secondInningsTimeLost } from '../calc'

describe('Rain rules', () => {
  describe('2nd XI', () => {
    describe('time lost before the start', () => {
      it('calculates new match conditions after delayed start', () => {
        expect(matchStartLate(50)).toEqual({
          breakType: 0,
          overs: 42,
          maxPerBowler: 8,
          powerPlay: 12,
        })

        expect(matchStartLate(150)).toEqual({
          breakType: 0,
          overs: 30,
          maxPerBowler: 6,
          powerPlay: 9,
        })

        expect(matchStartLate(150, true)).toEqual({
          breakType: 0,
          overs: 32,
          maxPerBowler: 6,
          powerPlay: 9,
        })

        expect(matchStartLate(20)).toEqual({
          breakType: 0,
          overs: 45,
          maxPerBowler: 9,
          powerPlay: 12,
        })
      })

      it('throws an exception if too many overs have been lost', () => {
        expect(() => {
          matchStartLate(250)
        }).toThrowError()
      })
    })

    describe('time lost during first innings', () => {
      it('calculates new total after first innings rain break', () => {
        expect(firstInningsTimeLost(203, 41.1, 135, true, 45)).toEqual({
          breakType: 1,
          target: 151,
          overs: 26,
          maxPerBowler: 5,
          powerPlay: 7,
          targetRunRate: 5.8,
          targetExact: false
        })

        expect(firstInningsTimeLost(213, 45, 135, true, 45)).toEqual({
          breakType: 1,
          target: 145,
          overs: 23,
          maxPerBowler: 4,
          powerPlay: 6,
          targetRunRate: 6.3,
          targetExact: false
        })
      })

      it('returns correct values if not enough time has been lost', () => {
        expect(firstInningsTimeLost(203, 41.1, 39, true, 45)).toEqual({
          breakType: 1,
          target: 204,
          overs: 45,
          maxPerBowler: 9,
          powerPlay: 12,
          targetRunRate: 4.51,
          targetExact: true
        })
        expect(firstInningsTimeLost(203, 41.1, 21, false, 45)).toEqual({
          breakType: 1,
          target: 204,
          overs: 45,
          maxPerBowler: 9,
          powerPlay: 12,
          targetRunRate: 4.51,
          targetExact: true
        })
      })

      it('throws an exception if game should be abandoned', () => {
        expect(() => {
          firstInningsTimeLost(203, 41.1, 310, true, 45)
        }).toThrowError()
      })
    })

    describe('time lost during the 2nd innings', () => {
      it('calculates target when delay in 2nd innings', () => {
        expect(secondInningsTimeLost(43, 45, 3.4)).toEqual({
          breakType: 2,
          target: 140,
          overs: 41,
          maxPerBowler: 8,
          powerPlay: 12,
          targetRunRate: 3.4,
          targetExact: false
        })

        expect(secondInningsTimeLost(120, 45, 5.0)).toEqual({
          breakType: 2,
          target: 111,
          overs: 22,
          maxPerBowler: 4,
          powerPlay: 6,
          targetRunRate: 5.0,
          targetExact: true
        })

        expect(secondInningsTimeLost(120, 45, 5.01)).toEqual({
          breakType: 2,
          target: 111,
          overs: 22,
          maxPerBowler: 4,
          powerPlay: 6,
          targetRunRate: 5.01,
          targetExact: false
        })
      })

      it('throws an exception when not enough overs left to complete game', () => {
        expect(() => {
          secondInningsTimeLost(43, 22, 3.4)
        }).toThrowError()
      })

    })
  })
})
