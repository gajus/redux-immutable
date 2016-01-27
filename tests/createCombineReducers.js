/* eslint-disable max-nested-callbacks */

import {
    expect
} from 'chai';

import Immutable from 'immutable';

import createCombineReducers from './../src/createCombineReducers';

describe('createCombineReducers()', () => {
    context('reducer returns received state', () => {
        it('returns initial state', () => {
            let combineReducers,
                initialState,
                rootReducer;

            combineReducers = createCombineReducers();

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
            let combineReducers,
                initialState,
                rootReducer;

            combineReducers = createCombineReducers();

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
