/* eslint-disable max-nested-callbacks */

import {
    expect
} from 'chai';

import Immutable from 'immutable';

import validateNextState from './../../src/utilities/validateNextState';

describe('utilities', () => {
    describe('validateNextState()', () => {
        context('state is undefined', () => {
            it('throws an error', () => {
                expect(() => {
                    /* eslint-disable no-undefined */
                    validateNextState(undefined, 'reducer name', {
                    /* eslint-enable no-undefined */
                        type: 'foo'
                    });
                }).to.throw(Error, 'Reducer "reducer name" returned undefined when handling "foo" action. To ignore an action, you must explicitly return the previous state.');
            });
        });
        context('state is defined', () => {
            it('returns null', () => {
                let result;

                result = validateNextState(Immutable.Map(), 'reducer name', {
                    type: 'foo'
                });

                expect(result).to.equal(null);
            });
        });
    });
});
