/* eslint-env mocha */

import {
    expect
} from 'chai';

import Immutable from 'immutable';
import sinon from 'sinon';
import combineReducers from './../src/combineReducers';

describe(`combineReducers`, () => {
    context(`when an instance of a reducer is called without an action`, () => {
        it(`produces an error`, () => {
            let reducer,
                state;

            reducer = combineReducers({});

            state = Immutable.Map({});

            expect(() => {
                reducer(state);
            }).to.throw(Error, `Action parameter value must be an object.`);
        });
    });
    context(`when an instance of a reducer is called with undefined action`, () => {
        let spy;

        beforeEach(() => {
            spy = sinon.stub(console, `warn`);
        });
        afterEach(() => {
            console.warn.restore();
        });
        it(`produces console.warn message`, () => {
            let action,
                reducer,
                state;

            reducer = combineReducers({
                foos: {
                    FOO: () => {

                    }
                }
            });

            state = Immutable.Map({});

            action = {
                name: `UNKNOWN`
            };

            reducer(state, action);

            expect(spy.calledWith(`Unhandled action "UNKNOWN".`)).to.equal(true);
        });
        context(`when action.name is 'CONSTRUCT'`, () => {
            it(`does not procuce console.warn message`, () => {
                let action,
                    reducer,
                    state;

                reducer = combineReducers({
                    foos: {
                        FOO: () => {

                        }
                    }
                });

                state = Immutable.Map({});

                action = {
                    name: `CONSTRUCT`
                };

                reducer(state, action);

                expect(spy.called).to.equal(false);
            });
        });
    });
    context(`when an instance of a reducer is called with an action defining a type property with a value beginning with "@@".`, () => {
        let spy;

        beforeEach(() => {
            spy = sinon.stub(console, `info`);
        });
        afterEach(() => {
            console.info.restore();
        });
        it(`produces console.info message`, () => {
            let action,
                reducer,
                state;

            reducer = combineReducers({
                foos: {
                    FOO: () => {

                    }
                }
            });

            state = Immutable.Map({});

            action = {
                type: `@@redux/INIT`
            };

            reducer(state, action);

            expect(spy.calledWithExactly(`Ignoring private action "@@redux/INIT". redux-immutable does not support state inflation. Refer to https://github.com/gajus/canonical-reducer-composition/issues/1.`)).to.equal(true);
        });
    });
    context(`when action handler produces a value thats not an instance of Immutable.Iterable`, () => {
        it(`throws an error`, () => {
            let action,
                reducer,
                state;

            reducer = combineReducers({
                foos: {
                    FOO: () => {

                    }
                }
            });

            state = Immutable.Map({});

            action = {
                name: `FOO`
            };

            // @todo Should name the full domain namespace, e.g. foo.bar.baz.

            expect(() => {
                reducer(state, action);
            }).to.throw(Error, `Reducer must return an instance of Immutable.Iterable. "foos" domain "FOO" action handler result is "undefined".`);
        });
    });

    context(`when reducers parameter is a valid reducers definition object`, () => {
        it(`produces a new state using the reducer`, () => {
            let reducer,
                state;

            reducer = combineReducers({
                foos: {
                    FOO: (fooState) => {
                        return fooState.set(`bar`, 2);
                    }
                }
            });

            state = Immutable.fromJS({
                foos: {
                    bar: 1
                }
            });

            state = reducer(state, {name: `FOO`});

            expect(state.get(`foos`).get(`bar`)).to.equal(2);
        });

        it(`reducer does not mutate the original state`, () => {
            let reducer,
                state;

            reducer = combineReducers({
                foos: {
                    FOO: (fooState) => {
                        return fooState.set(`bar`, 2);
                    }
                }
            });

            state = Immutable.fromJS({
                foos: {
                    bar: 1
                }
            });

            reducer(state, {name: `FOO`});

            expect(state.get(`foos`).get(`bar`)).to.equal(1);
        });
    });
});
