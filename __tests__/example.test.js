describe('Math Operations', () => {
  describe('Addition', () => {
    test('adds 1 + 2 to equal 3', () => {
      expect(1 + 2).toBe(3);
    });

    test('adds negative numbers correctly', () => {
      expect(-1 + -2).toBe(-3);
    });

    test('adds decimals correctly', () => {
      expect(0.1 + 0.2).toBeCloseTo(0.3);
    });
  });

  describe('Subtraction', () => {
    test('subtracts 5 - 3 to equal 2', () => {
      expect(5 - 3).toBe(2);
    });
  });

  describe('Multiplication', () => {
    test('multiplies 3 * 4 to equal 12', () => {
      expect(3 * 4).toBe(12);
    });

    test('handles zero multiplication', () => {
      expect(5 * 0).toBe(0);
    });
  });
});

describe('String Operations', () => {
  test('concatenates strings', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  test('converts to uppercase', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });

  test('splits strings correctly', () => {
    expect('a,b,c'.split(',')).toEqual(['a', 'b', 'c']);
  });
});

describe('Array Operations', () => {
  const numbers = [1, 2, 3, 4, 5];

  test('finds array length', () => {
    expect(numbers.length).toBe(5);
  });

  test('maps values correctly', () => {
    expect(numbers.map(n => n * 2)).toEqual([2, 4, 6, 8, 10]);
  });

  test('filters values correctly', () => {
    expect(numbers.filter(n => n > 3)).toEqual([4, 5]);
  });

  test('reduces values correctly', () => {
    expect(numbers.reduce((a, b) => a + b, 0)).toBe(15);
  });
});

describe('Async Operations', () => {
  const fetchData = () => Promise.resolve({ id: 1, name: 'Test' });

  test('resolves promise with data', async () => {
    const data = await fetchData();
    expect(data).toEqual({ id: 1, name: 'Test' });
  });

  test('handles async/await correctly', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});

describe('Intentional Failures (Demo)', () => {
  test('this test passes', () => {
    expect(true).toBe(true);
  });

  test.skip('this test is skipped', () => {
    expect(true).toBe(false);
  });

  test.todo('implement this feature later');
});

