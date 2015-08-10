import {
    expect
} from 'chai';

import Immutable from 'immutable';

import combineReducers from './../src/combineReducers';

describe('combineReducers', () => {
    describe('when reducer is used without an action', () => {
        it('throws an error', () => {
            let reducer;

            reducer = combineReducers({});

            expect(() => {
                reducer({});
            }).to.throw(Error, 'Action definition parameter must be an object.');
        });
    });

    describe('when reducer is used with an action', () => {
        describe('that does not define action.type property', () => {
            it('throws an error', () => {
                let reducer;

                reducer = combineReducers({});

                expect(() => {
                    reducer({}, {});
                }).to.throw(Error, 'Action definition parameter "type" property must be a string.');
            });
        });

        describe('that has "type" value which does not consists only of uppercase alphabetical characters and underscores', () => {
            it('throws an error', () => {
                let reducer;

                reducer = combineReducers({});

                expect(() => {
                    reducer({}, {type: 'foo'});
                }).to.throw(Error, 'Action "type" property value must consist only of uppercase alphabetical characters and underscores.');
            })
        });
    });

    describe('when reducer is used with a state (domain) thats not an instance of Immutable.Iterator', () => {
        it('throws an error', () => {
            let reducer;

            reducer = combineReducers({});

            expect(() => {
                reducer({}, {type: 'FOO'});
            }).to.throw(Error, 'Domain must be an instance of Immutable.Iterable.');
        });
    });

    describe('when reducer is used with a reducer definition object that does not define domain object', () => {
        it('throws an error', () => {
            expect(() => {
                combineReducers({
                    FOO: () => {

                    }
                })
            }).to.throw(Error, 'Reducer definition object must begin with a domain map.');
        });
    });

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
                type: 'FOO'
            };

            // @todo Should name the full domain namespace, e.g. foo.bar.baz.

            expect(() => {
                reducer(state, action);
            }).to.throw(Error, 'Reducer must return an instance of Immutable.Iterable. "foos" domain "FOO" action reducer result is "undefined".');
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

            state = reducer(state, {type: 'FOO'});

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

            reducer(state, {type: 'FOO'});

            expect(state.get('foos').get('bar')).to.equal(1);
        });
    });
});
