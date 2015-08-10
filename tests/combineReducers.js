import {
    expect
} from 'chai';

import Immutable from 'immutable';

import combineReducers from './../src/combineReducers';

describe('combineReducers', () => {
    describe('when reducer produces a value thats not an instance of Immutable.Iterable', () => {
        it('throws an error', () => {
            let reducer,
                state,
                action;

            reducer = combineReducers({
                foos: {
                    FOO: () => {

                    }
                }
            });

            state = Immutable.Map({});

            action = {
                name: 'FOO'
            };

            // @todo Should name the full domain namespace, e.g. foo.bar.baz.

            expect(() => {
                reducer(state, action);
            }).to.throw(Error, 'Reducer must return an instance of Immutable.Iterable. "foos" domain "FOO" action handler result is "undefined".');
        });
    });

    describe('when reducers parameter is a valid reducers definition object', () => {
        it('produces a new state using the reducer', () => {
            let reducer,
                state;

            reducer = combineReducers({
                foos: {
                    FOO: (fooState) => {
                        return fooState.set('bar', 2);
                    }
                }
            });

            state = Immutable.fromJS({
                foos: {
                    bar: 1
                }
            });

            state = reducer(state, {name: 'FOO'});

            expect(state.get('foos').get('bar')).to.equal(2);
        });

        it('reducer does not mutate the original state', () => {
            let reducer,
                state;

            reducer = combineReducers({
                foos: {
                    FOO: (fooState) => {
                        return fooState.set('bar', 2);
                    }
                }
            });

            state = Immutable.fromJS({
                foos: {
                    bar: 1
                }
            });

            reducer(state, {name: 'FOO'});

            expect(state.get('foos').get('bar')).to.equal(1);
        });
    });
});
