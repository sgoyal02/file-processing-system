import { beforeEach, describe, expect, it } from "vitest";
import AuthContextProvider, { useAuth } from "../../contexts/AuthContext";
import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { mockUser } from "../mocks/mockData";


const wrapper = ({ children}:{children: React.ReactNode}) => (
    <AuthContextProvider>{children}</AuthContextProvider>
);
beforeEach(()=>localStorage.clear());

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

    it('storage clea on logout', async () => {
        localStorage.setItem('authToken', mockUser.token);
        localStorage.setItem('authUser', JSON.stringify(mockUser));
        const {result}= renderHook(() => useAuth(), { wrapper});
        await waitFor(() => {
            expect(result.current.authData.token).toBe(mockUser.token);
        });
        act(() => {result.current.onLogout();});
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