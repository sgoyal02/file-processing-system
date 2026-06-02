import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import ProjectsProvider, { useProjects } from '../../contexts/ProjectsContext';

const wrapper = ({children}:{children:React.ReactNode}) => (
    <ProjectsProvider>{children}</ProjectsProvider>
);

vi.mock('../../services/apiService', () => ({
  useApiService: vi.fn(),
}));
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockFetchProjects = vi.fn();  //global acces- data to return
const mockCreateProject = vi.fn();
const mockOnLogout = vi.fn();

describe('projectsContext testing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    //custom add
    vi.mocked(useApiService).mockReturnValue({
      fetchProjects: mockFetchProjects,
      createProject: mockCreateProject,
      updateProject: vi.fn(),  //just dummy
      removeProject: vi.fn(),
    } as any);
    vi.mocked(useAuth).mockReturnValue({
      authData: { token: 'abc123', user: null, isGuest: false },
      onLogin: vi.fn(),
      onLogout: mockOnLogout,
      setLoad: vi.fn(),
      setError: vi.fn(),
    } as any);
  });

  it('fetch and store getProjects data', async () => {
    const testData = [{id: 1, name: 'Project invoice', description: 'invoice desc' }];
    mockFetchProjects.mockResolvedValueOnce(testData);
    const {result}= renderHook(() => useProjects(), {wrapper});
    act(() => {
      result.current.getProjects();
    });
    expect(result.current.isLoad).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoad).toBe(false);
    });
    console.log("res p: ", result.current);
    expect(result.current.data).toEqual(testData);
    expect(result.current.err).toBe('');
  });

  it('logout on unauthhorized err', async () => {
    mockFetchProjects.mockRejectedValueOnce(new Error('Unauthorized'));
    const {result}= renderHook(() => useProjects(), { wrapper });
    await act(async () => {
      await result.current.getProjects();
    });
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
    expect(result.current.err).toBe('Unauthorized');
  });
});