import { describe, it, expect} from 'vitest';
import { actionReducer, initData } from '../../hooks/actionReducer';
import { mockUser } from '../mocks/mockData';

describe('actionReducer hook', () => {

    it('isLoad-true on LOAD', () => {
        const res = actionReducer(initData, {type: 'LOAD'});
        expect(res.isLoad).toBe(true);
    });
    it('user and token set on LOGIN_SUCCESS', () => {
        const res = actionReducer(initData, {
            type: 'LOGIN_SUCCESS',
            payload: { user: mockUser,token: 'abc123' }
        });
        expect(res.user).toEqual(mockUser);
        expect(res.token).toBe('abc123');
        expect(res.isLoad).toBe(false);
    });

    it('reset app on LOGOUT', () => {
        const loggedInState = {user: mockUser, token: 'abc', isGuest: false, isLoad: false};
        const res = actionReducer(loggedInState, {type: 'LOGOUT'});
        expect(res.user).toBeNull();
        expect(res.token).toBeNull();
        expect(res.isLoad).toBe(false);
    });

    it('reset to init on LOGIN_FAIL', () => {
        const res = actionReducer(initData, { type: 'LOGIN_FAIL' });
        expect(res.user).toBeNull();
        expect(res.isLoad).toBe(false);
    });
    it('random action return existing data-no change', () => {
        const res = actionReducer(initData, { type: 'ANY' } as any);
        expect(res).toEqual(initData);
    });
});