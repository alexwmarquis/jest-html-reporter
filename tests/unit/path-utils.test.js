const { getFileName } = require('../../src/template/utils/path');

test('getFileName extracts filename from path', () => {
  const path = 'path/to/test.js';

  const result = getFileName(path);

  expect(result).toBe('test.js');
});

test('getFileName returns full path if no slashes', () => {
  const path = 'test.js';

  const result = getFileName(path);

  expect(result).toBe('test.js');
});

test('getFileName handles paths ending in slash', () => {
  const path = 'path/to/';

  const result = getFileName(path);

  expect(result).toBe('path/to/');
});

test('getFileName handles empty string', () => {
  const path = '';

  const result = getFileName(path);

  expect(result).toBe('');
});
