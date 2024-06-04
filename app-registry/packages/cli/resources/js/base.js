import './utils/test';
import { SOME_TEST_CONSTANT } from './utils/constants';

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Base Block Script Registered');
    console.log(SOME_TEST_CONSTANT);
  });
});
