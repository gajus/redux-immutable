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
    context('root reducer is created from nested combineReducers', () => {
        it('returns initial state from default values', () => {
            const initialState = Immutable.fromJS({
                outer: {
                    inner1: {
                        a: true,
                        b: false
                    },
                    inner2: {
                        a: false,
                        b: true
                    }
                }
            });

            const rootReducer = combineReducers({
                outer: combineReducers({
                    inner1: (state = Immutable.fromJS({a: true, b: false})) => {
                        return state;
                    },
                    inner2: (state = Immutable.fromJS({a: false, b: true})) => {
                        return state;
                    }
                })
            });

            expect(rootReducer()).to.eql(initialState);
        });
    });
});
