import { range } from '../array';

describe('range', () => {
  it('should return array from given start = 1 to given end = 10 (not including)', () => {
    const actualRange = range(1, 10);
    const expectedRange = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(actualRange).toEqual(expectedRange);
  });

  it('should return array from given start = 5 to given end = 8 (not including)', () => {
    const actualRange = range(5, 8);
    const expectedRange = [5, 6, 7];
    expect(actualRange).toEqual(expectedRange);
  });

  it('should return array from given start = -2 to given end = 12 (not including)', () => {
    const actualRange = range(-2, 12);
    const expectedRange = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expect(actualRange).toEqual(expectedRange);
  });
});
