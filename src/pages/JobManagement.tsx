import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useApiService } from '../services/apiService';
import { formaFulltDate, formatDate, type SavedFile, type SavedJobs } from '../services/types';

const JobManagement = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const apiService = useApiService();
  const [files, setFiles] = useState<{
    data: SavedFile[], isLoad: boolean,
    errTxt: string, selIds: Set<string | number>
  }>
    ({ data: [], selIds: new Set(), isLoad: false, errTxt: "", });
  const [jobs, setJobs] = useState<{
    data: SavedJobs[], isLoad: boolean, err: string, isCreate: boolean
  }>({ data: [], isLoad: false, err: "", isCreate: false });

  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      apiService.fetchFiles(projectId), apiService.fetchJobs(projectId)
    ]).then(([filesData, jobsData]) => {
      setFiles((prev) => ({ ...prev, isLoad: false, data: filesData }));
      setJobs((prev) => ({ ...prev, isLoad: false, data: jobsData }))
    })
  }, [projectId]);

  const handleSelectFile = (id: string | number) => {
    const selFiles = new Set(files.selIds);
    selFiles.has(id) ? selFiles.delete(id) : selFiles.add(id);
    setFiles((prev) => ({ ...prev, selIds: selFiles }));
  }
  const handleCreateJob = async () => {
    if (!projectId || !files.selIds.size) return;
    setJobs((prev) => ({ ...prev, isCreate: true }))
    const newJob: Omit<SavedJobs, 'id'> = {
      createdAt: new Date().toISOString(),
      fileIds: Array.from(files.selIds),
      projectId: projectId!,
      completedAt: '',
      downloadUrl: '',
      progress: 0,
      status: 'PROCESSING'
    };
    try {
      const res = await apiService.createZipJob(newJob);
      let count = 0;
      setJobs((prev) => {
        const newData = [res, ...prev.data];
        count = newData.length;
        return { ...prev, data: newData };
      })
      setFiles((prev) => ({ ...prev, selIds: new Set() }))
      await apiService.updateProjectDataCount(projectId, { jobsCount: count });

    } catch (err) {
      alert('Error in creating zip job');
    } finally {
      setJobs((prev) => ({ ...prev, isCreate: false }))
    }
  }

  useEffect(() => {
    const incompJobs = jobs.data.filter((j) => j.status === 'PROCESSING');
    if (!incompJobs.length) return;
    //poll logic
    const jobInterval = setInterval(async () => {
      const res = await Promise.allSettled(incompJobs.map((j) => apiService.getJobStatus(j.id)));
      setJobs((prev) => {
        const jobData = prev.data.map((j): SavedJobs => {
          const existIdx = incompJobs.findIndex((ij) => ij.id === j.id);
          if (existIdx !== -1) {
            const finalRes = res[existIdx];
            if (finalRes.status === 'fulfilled')
              return finalRes.value
            else return { ...j, status: 'ERROR', progress: 0 }
          }
          return j;
        });
        return { ...prev, data: jobData }
      })
    }, 3000);

    return (() => clearInterval(jobInterval))
  }, [jobs.data]);

  const handleDownloadZip = (url: string | null, name: string) => {
    if (!url) return;
    const testData = "test zip file";
    const blob = new Blob([testData], { type: 'application/zip' });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${name}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }

  const handleSelectAll=()=>{
  const allIds = files.data.map(f => f.id);
  const selFiles = new Set<string | number>();
  if (files.selIds.size< allIds.length) {
    allIds.forEach(id => selFiles.add(id));
  }
  setFiles((prev) => ({ ...prev, selIds: selFiles }));
  }

  return (
    <div className="detail-page">
      <button className="btn-back" onClick={() => navigate(`/projects/${projectId}`)}>
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>Back
      </button>
      <div className="detail-wrapper">
        <h5 className="detail-title">{"Jobs Management"}</h5>
        <div className='job-section'>
          <div className="flex-between">
          <h3 className='state-text'>Create ZIP Job</h3>
          <button className='btn-primary' style={{marginTop:'0.5rem'}}
            disabled={files.selIds.size === 0 || jobs.isCreate}
            onClick={handleCreateJob}>
            <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {jobs.isCreate ? 'Creating...' : `Create zip (${files.selIds.size})`}
          </button>
          </div>
          <div className='table-wrapper'>
        <table className='file-table'>
          <thead>
            <tr className='state-text'>
              <th>
              <input type="checkbox" style={{cursor:'pointer'}}
              checked={files.data.length > 0 && files.selIds.size === files.data.length}
              ref={(el) => {if (el) {
                  el.indeterminate = files.selIds.size > 0 && 
                  files.selIds.size < files.data.length;
                }
              }}
        onChange={handleSelectAll}
      />
      </th>
              <th>Name</th>
              <th>Size(KB)</th>
              <th>Upload Date</th>
            </tr>
          </thead>
          <tbody>
            {
              files.isLoad ?
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>
                    <span className="loader loader--sm" />
                  </td>
                </tr> :
                !!files.errTxt ?
                  <tr>
                    <td colSpan={4} className='card-err'>
                      {files.errTxt}
                    </td>
                  </tr>
                  : !files.data.length ?
                    <tr>
                      <td colSpan={4} className='state-text'>No files avaialble yet.</td>
                    </tr>
                    :
                    files.data.map((f, idx) => (
                      <tr key={idx} className='state-text'>
                        <td>
                          <input style={{ cursor: 'pointer' }}
                            type="checkbox"
                            checked={files.selIds.has(f.id)}
                            onChange={() => handleSelectFile(f.id)}
                          />
                        </td>
                        <td>{f.name}</td>
                        <td>{(f.size / 1024).toFixed(2)}</td>
                        <td>{formatDate(f.uploadedAt)}</td>
                      </tr>
                    ))}
          </tbody>
        </table>
        </div>
        </div>

        <div className='job-section'>
          <div className="flex-between">
          <h3 className='state-text' style={{marginTop:'1rem'}}>Jobs List</h3>
          </div>
           <div className='table-wrapper'>
          <table className='file-table'>
            <thead>
              <tr className='state-text'>
                <th>Job ID</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Created At</th>
                <th>Completed At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                jobs.isLoad ?
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>
                      <span className="loader loader--sm" />
                    </td>
                  </tr> :
                  !!jobs.err ?
                    <tr>
                      <td colSpan={6} className='card-err'>
                        {jobs.err}
                      </td>
                    </tr>
                    : !jobs.data.length ?
                      <tr>
                        <td colSpan={6} className='state-text'>No jobs added yet.</td>
                      </tr>
                      :
                      jobs.data.map((j, idx) => (
                        <tr key={idx} className='state-text'>
                          <td>{j.id}</td>
                          <td>
                            <span className={`status-badge ${j.status.toLowerCase()}`}>{j.status}</span>
                          </td>
                          <td>{`${j.progress || 0}%`}</td>
                          <td>{formaFulltDate(j.createdAt)}</td>
                          <td>{j.completedAt ? formaFulltDate(j.completedAt) : ''}</td>
                          <td>{
                            j.status === 'COMPLETED' ?
                              <button className='btn btn-success' title='Download' onClick={() => handleDownloadZip(j.downloadUrl, `Job-${j.id}`)}>

                                <svg width={"15px"} height={"15px"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                </svg>

                              </button>
                              : '-'
                          }</td>
                        </tr>
                      ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobManagement
