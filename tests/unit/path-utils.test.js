const { getFileName } = require('../../src/template/utils/path');

test('should extract the filename from a given path', () => {
  const path = 'path/to/test.js';

  const result = getFileName(path);

  expect(result).toBe('test.js');
});

test('should return the full path if it contains no slashes', () => {
  const path = 'test.js';

  const result = getFileName(path);

  expect(result).toBe('test.js');
});

test('should return the path as is when it ends in a slash', () => {
  const path = 'path/to/';

  const result = getFileName(path);

  expect(result).toBe('path/to/');
});

test('should return an empty string when an empty path is provided', () => {
  const path = '';

  const result = getFileName(path);

  expect(result).toBe('');
});
