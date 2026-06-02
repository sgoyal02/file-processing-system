import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthContextProvider, { useAuth } from "../../contexts/AuthContext";
import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { mockUser } from "../mocks/mockData";


const wrapper = ({ children}:{children: React.ReactNode}) => (
    <AuthContextProvider>{children}</AuthContextProvider>
);
beforeEach(()=>localStorage.clear());

vi.mock('jwt-decode', () => ({
    jwtDecode: () => ({
        exp: Math.floor(new Date('2030-01-01').getTime() / 1000)
    })
}));

describe('authContext file testing', ()=>{
    it('initial no token-empty storage', async()=>{
        const {result}= renderHook(()=>useAuth(), {wrapper});
        await waitFor(()=>{
            expect(result.current.authData.isLoad).toBe(false);
        });
        expect(result.current.authData.token).toBeNull();
    });

    it('storage set on login', async()=>{
        const {result}= renderHook(()=>useAuth(), {wrapper});
        await waitFor(()=>{
            expect(result.current.authData.isLoad).toBe(false);
        });
        act(()=>{result.current.onLogin(mockUser);})
        console.log("Res on login: ", result.current.authData);
        expect(result.current.authData.token).toBe(mockUser.token);
        expect(localStorage.getItem('authToken')).toBe(mockUser.token);
    });

    it('storage clean on logout', async () => {
        localStorage.setItem('authToken', mockUser.token);
        localStorage.setItem('authUser', JSON.stringify(mockUser));
        const {result}= renderHook(() => useAuth(), { wrapper});
        console.log("res: ", result.current);
        await waitFor(() => {
            expect(result.current.authData?.token).toBe(mockUser.token);
        });
        await act(async() => {await result.current.onLogout();});
        console.log("res after act: ", result.current)
        expect(result.current.authData.token).toBeNull();
        expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('session restore on render', async () => {
        localStorage.setItem('authToken', mockUser.token);
        localStorage.setItem('authUser', JSON.stringify(mockUser));
        const {result}= renderHook(() => useAuth(), {wrapper});
        await waitFor(() => {
            expect(result.current.authData.token).toBe(mockUser.token);
        });
        expect(result.current.authData.isGuest).toBe(false);
    });
})