/* eslint-disable max-nested-callbacks */

import {
    expect
} from 'chai';
import Immutable from 'immutable';
import combineReducers from './../src/combineReducers';

describe('combineReducers()', () => {
    context('reducer returns received state', () => {
        it('returns initial state', () => {
            const rootReducer = combineReducers({
                foo: (state) => {
                    return state;
                }
            });

            const initialState = Immutable.fromJS({
                foo: {
                    count: 0
                }
            });

            expect(rootReducer(initialState, {type: 'ADD'})).to.equal(initialState);
        });
    });
    context('reducer creates new domain state', () => {
        it('returns new state', () => {
            const rootReducer = combineReducers({
                foo: (state) => {
                    return state.set('count', state.get('count') + 1);
                }
            });

            const initialState = Immutable.fromJS({
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
                    inner: {
                        bar: false,
                        foo: true
                    }
                }
            });

            const innerDefaultState = Immutable.fromJS({
                bar: false,
                foo: true
            });

            const rootReducer = combineReducers({
                outer: combineReducers({
                    inner: (state = innerDefaultState) => {
                        return state;
                    }
                })
            });

            // eslint-disable-next-line no-undefined
            expect(rootReducer(undefined, {})).to.eql(initialState);
        });
    });
});
