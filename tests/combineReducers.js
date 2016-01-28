/* eslint-disable max-nested-callbacks */

import {
    expect
} from 'chai';

import Immutable from 'immutable';

import combineReducers from './../src/combineReducers';

describe('combineReducers()', () => {
    context('reducer returns received state', () => {
        it('returns initial state', () => {
            let initialState,
                rootReducer;

            rootReducer = combineReducers({
                foo: (state) => {
                    return state;
                }
            });

            initialState = Immutable.fromJS({
                foo: {
                    count: 0
                }
            });

            expect(rootReducer(initialState, {type: 'ADD'})).to.equal(initialState);
        });
    });
    context('reducer creates new domain state', () => {
        it('returns new state', () => {
            let initialState,
                rootReducer;

            rootReducer = combineReducers({
                foo: (state) => {
                    return state.set('count', state.get('count') + 1);
                }
            });

            initialState = Immutable.fromJS({
                foo: {
                    count: 0
                }
            });

            expect(rootReducer(initialState, {type: 'ADD'}).getIn(['foo', 'count'])).to.equal(1);
        });
    });
});
