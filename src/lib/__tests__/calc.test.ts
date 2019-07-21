import { firstInningsTimeLost, matchStartLate } from '../calc'

describe('Rain rules', () => {
  describe('2nd XI', () => {
    describe('time lost before the start', () => {
      it('calculates new match conditions after delayed start', () => {
        expect(matchStartLate(50)).toEqual({
          overs: 42,
          maxPerBowler: 8,
          powerPlay: 12,
        })

        expect(matchStartLate(150)).toEqual({
          overs: 30,
          maxPerBowler: 6,
          powerPlay: 9,
        })

        expect(matchStartLate(150, true)).toEqual({
          overs: 32,
          maxPerBowler: 6,
          powerPlay: 9,
        })

        expect(matchStartLate(20)).toEqual({
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
          target: 151,
          overs: 26,
          maxPerBowler: 5,
          powerPlay: 7,
        })

        expect(firstInningsTimeLost(213, 45, 135, true, 45)).toEqual({
          target: 145,
          overs: 23,
          maxPerBowler: 4,
          powerPlay: 6,
        })
      })

      it('returns correct values if not enough time has been lost', () => {
        expect(firstInningsTimeLost(203, 41.1, 39, true, 45)).toEqual({
          target: 203,
          overs: 45,
          maxPerBowler: 9,
          powerPlay: 12,
        })
        expect(firstInningsTimeLost(203, 41.1, 21, false, 45)).toEqual({
          target: 203,
          overs: 45,
          maxPerBowler: 9,
          powerPlay: 12,
        })
      })

      it('throws an exception if game should be abandoned', () => {
        expect(() => {
          firstInningsTimeLost(203, 41.1, 310, true, 45)
        }).toThrowError()
      })
    })
  })
})
