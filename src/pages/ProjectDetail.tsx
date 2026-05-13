import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/projects.css';
import { formatDate, type Project } from '../services/types';
import { useApiService } from '../services/apiService';

const ProjectDetail = () => {
  console.log("in detail");
  const navigate = useNavigate();
  const [detailState, setDetailState] = useState<{ project: Project | null, isLoad: boolean, err: string }>
    ({ project: null, isLoad: false, err: "" });

  const { id } = useParams<{ id: string }>();
  console.log("id: ", id);
  const apiService = useApiService();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  function handlePick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected) return;
  setFiles((prev) => [...prev, ...Array.from(selected)]);
  }

  function delFile(idx: number) {
  setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  useEffect(() => {
    if (!id) return;
    setDetailState((prev) => ({ ...prev, isLoad: true, err: "" }))

    apiService.fetchProjectById(id)
      .then((data) =>
        setDetailState((prev) => ({ ...prev, isLoad: false, project: data }))
      )
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to get project.';
        setDetailState((prev) => ({ ...prev, isLoad: false, err: msg }))
      })
  }, [id]);


  return (
    detailState.isLoad ?
      <div className="flex-center page-state">
        <span className="loader loader--lg" />
        <p className="state-text">Loading project detail..</p>
      </div>
      : detailState.err || !detailState.project ?
        <div className="flex-center page-state">
          <div className="flex-center state-icon state-icon--err">
            <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="state-text">{detailState.err || 'Project not found'}</p>
          <button className="btn-secondary" onClick={() => navigate('/projects')}>
            Back to Projects
          </button>
        </div>
        :
        <div className="detail-page">
          <button className="btn-back" onClick={() => navigate('/projects')}>
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>Back
          </button>

          <div className="detail-wrapper">
            <h1 className="detail-title">{detailState.project.name}</h1>
            <p className="detail-desc">{detailState.project.description}</p>
            <div className='flex-between detail-date'>
              <p>Created on{formatDate(detailState.project.createdAt)}</p>
              <div className='flex-center' style={{ justifyContent: 'flex-end', gap: "1rem" }}>
                <span className="stat-item">
                  <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>

                  {detailState.project.filesCount || 0} files
                </span>
                <span className="stat-item">
                  <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                  </svg>
                  {detailState.project.filesCount || 0} jobs
                </span>
              </div>
            </div>

          </div>


          <div className="detail-section">
            <div className="flex-between" style={{marginRight:"1rem"}}>
        <h2 className="section-title">Files</h2>
        <button
          className="btn-primary"
          onClick={handlePick}
          type="button"
        >
          Upload Files
        </button>
      </div>
       <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={handleChange}
      />

      {!files.length ? (
        <div className="section-placeholder">
          <p>No files uploaded.</p>
        </div>
      ) : (
        <div className="files-list">
          {files.map((file, idx) => (
            <div className="flex-between file-item" key={`${file.name}-${idx}`}>
              <div className="file-info">
                <p className="file-name">{file.name}</p>
                <span className="file-size">
                  {(file.size/1024).toFixed(1)} KB
                </span>
              </div>

              <button
                className="flex-center btn-delete"
                onClick={() => delFile(idx)}
                type="button"
              >
                 <svg width={"15px"} height={"15px"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
              </button>

            </div>
          ))}
        </div>
      )}
          </div>

          <div className="detail-section">
            <h2 className="section-title">Jobs</h2>
            <div className="section-placeholder">
              <p>to do</p>
            </div>
          </div>
        </div>
  );
}

export default ProjectDetail;