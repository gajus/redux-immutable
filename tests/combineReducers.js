import {
    expect
} from 'chai';

import Immutable from 'immutable';

import sinon from 'sinon';

import combineReducers from './../src/combineReducers';

describe('combineReducers', () => {
    describe('when an instance of reducer is called with unknown action', () => {
        let spy;
        beforeEach(() => {
            spy = sinon.stub(console, 'warn');
        });
        afterEach(() => {
            console.warn.restore();
        });
        it('produces console.warn message', () => {
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
                name: 'UNKNOWN'
            };

            reducer(state, action);

            expect(spy.calledWith('Unhandled action "UNKNOWN".')).to.equal(true);
        });
    });
    describe('when an instance of reducer is called with {type: @@redux/INIT} action.', () => {
        let spy;
        beforeEach(() => {
            spy = sinon.stub(console, 'info');
        });
        afterEach(() => {
            console.info.restore();
        });
        it('produces console.info message', () => {
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
                type: '@@redux/INIT'
            };

            reducer(state, action);

            expect(spy.calledWithExactly('Ignoring @@redux/INIT. redux-immutable does not support state inflation. Refer to https://github.com/gajus/canonical-reducer-composition/issues/1.')).to.equal(true);
        });
    });
    describe('when action handler produces a value thats not an instance of Immutable.Iterable', () => {
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
