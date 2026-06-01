import type { Project, SavedFile, SavedJobs } from '../../services/types';

export const mockUser = {
    id: "1",
    email: 'test@test.com',
    token: 'abc123'
};
export const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'A test project',
    createdAt: '2024-01-01T00:00:00Z'
};

export const mockFiles: SavedFile[] = [
    { id: 1, name: 'doc.pdf', size: 1024, projectId: 1, uploadedAt:""},
    { id: 2, name: 'photo.jpg', size: 2048, projectId: 1, uploadedAt:"" },
    { id: 3, name: 'data.csv', size: 512, projectId: 1, uploadedAt:"" },
];
export const mockJobs: SavedJobs[] = [
    { id: 1, status: 'COMPLETED', fileIds:[1,2], projectId: 1, createdAt: '2024-01-01', completedAt:null, downloadUrl:null, progress:100 },
    { id: 2, status: 'FAILED', projectId: 1, fileIds:[2,3], createdAt: '2024-01-02',completedAt:null, downloadUrl:null, progress:0 },
    { id: 3, status: 'PROCESSING', projectId: 1, fileIds:[1], createdAt: '2024-01-03',completedAt:null, downloadUrl:null, progress:40 },
];