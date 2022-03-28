/* eslint-disable max-nested-callbacks */

import {
  expect,
} from 'chai';
import * as Immutable from 'immutable';
import {
  getUnexpectedInvocationParameterMessage,
} from '../../src/utilities/getUnexpectedInvocationParameterMessage';

describe('utilities', () => {
  describe('getUnexpectedInvocationParameterMessage()', () => {
    let validAction: any;
    let validReducers: any;
    let validState: any;

    beforeEach(() => {
      validState = Immutable.Map();
      validReducers = {
        foo () {},
      };
      validAction = {
        type: '@@redux/INIT',
      };
    });

    context('store does not have a valid reducer', () => {
      it('returns an error', () => {
        const expectedErrorMessage = getUnexpectedInvocationParameterMessage(validState, {}, validAction);

        expect(expectedErrorMessage).to.equal('Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.');
      });
    });
    context('state is not an instance of Immutable.Collection or Immutable.Record', () => {
      it('returns error', () => {
        const expectedErrorMessage = getUnexpectedInvocationParameterMessage({}, validReducers, validAction);

        expect(expectedErrorMessage).to.equal('The initialState argument passed to createStore is of unexpected type. Expected argument to be an instance of Immutable.Collection or Immutable.Record with the following properties: "foo".');
      });
    });
    context('state defines properties that are not present in the reducer map', () => {
      it('returns error', () => {
        const expectedErrorMessage = getUnexpectedInvocationParameterMessage(Immutable.Map({
          bar: 'BAR',
        }), validReducers, validAction);

        expect(expectedErrorMessage).to.equal('Unexpected property "bar" found in initialState argument passed to createStore. Expected to find one of the known reducer property names instead: "foo". Unexpected properties will be ignored.');
      });
    });
    context('valid', () => {
      it('returns null', () => {
        const expectedErrorMessage = getUnexpectedInvocationParameterMessage(validState, validReducers, validAction);

        expect(expectedErrorMessage).to.equal(null);
      });
    });
  });
});
