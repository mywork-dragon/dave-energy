import { configure } from '@testing-library/dom';
require('jest-fetch-mock').enableMocks();

configure({
  testIdAttribute: 'data-tn',
});
