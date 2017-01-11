/* eslint-disable max-nested-callbacks */

import {
  expect
} from 'chai';
import getStateName from '../../src/utilities/getStateName';

describe('utilities', () => {
  describe('getStateName()', () => {
    context('action.type is @@redux/INIT', () => {
      it('describes initialState', () => {
        const expectedStateName = getStateName({
          type: '@@redux/INIT'
        });

        expect(expectedStateName).to.equal('initialState argument passed to createStore');
      });
    });
    context('action.type is anything else', () => {
      it('describes previous state', () => {
        const expectedStateName = getStateName({});

        expect(expectedStateName).to.equal('previous state received by the reducer');
      });
    });
  });
});
