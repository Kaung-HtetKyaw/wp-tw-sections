import { SOME_TEST_CONSTANT } from './constants';
import './hello';

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Hello Test.js');
    console.log(SOME_TEST_CONSTANT);
  });
})();
