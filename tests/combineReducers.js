import {
    expect
} from 'chai';

import Immutable from 'immutable';

import combineReducers from './../src/combineReducers';

describe('combineReducers', () => {
    /*describe('when reducers parameter is not an object', () => {
        it('throws an error', () => {
            expect(() => {
                combineReducers(null);
            }).to.throw(Error, 'Reducers definition parameter must be an object.');
        })
    });
    describe('when not all reducers parameter property values are functions', () => {
        it('throws an error', () => {
            expect(() => {
                combineReducers({
                    foo: 'bar'
                });
            }).to.throw(Error, 'All reducers definition object property values must be functions. "foo" property is a "string".');
        })
    });
    describe('when reducers parameter is a valid reducers definition object', () => {
        describe('when reducer is used without an action', () => {
            it('throws an error', () => {
                let reducer;

                reducer = combineReducers({});

                expect(() => {
                    reducer({});
                }).to.throw(Error, 'Action definition parameter must be an object.');
            });
        });
        describe('when reducer is used with an action that does not define action.type', () => {
            it('throws an error', () => {
                let reducer;

                reducer = combineReducers({});

                expect(() => {
                    reducer({}, {});
                }).to.throw(Error, 'Action definition parameter type property must be a string.');
            });
        });
        describe('when reducer is used with a state thats not an instance of Immutable.Map', () => {
            it('throws an error', () => {
                let reducer;

                reducer = combineReducers({});

                expect(() => {
                    reducer({}, {type: 'foo'});
                }).to.throw(Error, 'State must be an instance of Immutable.Map.');
            });
        });
        describe('when reduced state results in undefined', () => {
            it('throws an error with the name of the action', () => {
                let reducer,
                    state;

                reducer = combineReducers({
                    foo: () => {}
                });

                state = Immutable.Map({});

                expect(() => {
                    reducer(state, {type: 'bar'});
                }).to.throw(Error, 'Reducer "foo" returned undefined while handling "bar" action.');
            });
        });
        it('produces a new state using the reducer', () => {
            let reducer,
                state;

            reducer = combineReducers({
                foo: (fooState) => {
                    return fooState.set('bar', 2);
                }
            });

            state = Immutable.fromJS({
                foo: {
                    bar: 1
                }
            });

            state = reducer(state, {type: ''});

            expect(state.get('foo').get('bar')).to.equal(2);
        });
        it('reducer does not mutate the original state', () => {
            let reducer,
                state;

            reducer = combineReducers({
                foo: (fooState) => {
                    return fooState.set('bar', 2);
                }
            });

            state = Immutable.fromJS({
                foo: {
                    bar: 1
                }
            });

            reducer(state, {type: ''});

            expect(state.get('foo').get('bar')).to.equal(1);
        });
    });*/
});
