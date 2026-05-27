import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApiService } from '../services/apiService';
import { formatDate, type FileQueue, type SavedFile } from '../services/types';

const FilesManagement = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const apiService = useApiService();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<{
        data: SavedFile[], inpFiles: FileQueue[], isLoad: boolean, err: string, delErr: string
    }>({ data: [], isLoad: false, err: "", inpFiles: [], delErr: "" });

    const uploadRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!id) return;
        setFiles((prev) => ({ ...prev, isLoad: true, err: "" }))
        apiService.fetchFiles(id)
            .then((data) => {
                setFiles((prev) => ({ ...prev, data: data, isLoad: false }))
            }).catch((err) => {
                const msg = err instanceof Error ? err.message : 'Failed to get files.';
                setFiles((prev) => ({ ...prev, isLoad: false, err: msg }))
            })
    }, [id])

    useEffect(() => {
        if (files.inpFiles.length) {
            onUploadFiles();
        }
    }, [files.inpFiles])

    const handleChange = (inpData: FileList) => {
        if (!inpData || !inpData.length) return;
        const selected: FileQueue[] = Array.from(inpData).map((file) => ({
            id: crypto.randomUUID(),
            file,
            progress: 0,
            status: 'uploading'
        }))
        setFiles((prev) => ({ ...prev, inpFiles: [...prev.inpFiles, ...selected] }));
    }

    //wrong for files count-- ?

    const onUploadFiles = async () => {
        const selFiles = files.inpFiles.filter(
            (f) => f.status === 'uploading' && !uploadRef.current.has(f.id));
        if (!selFiles.length) return;
        const uploadItems = selFiles?.map(async (item) => {
            uploadRef.current.add(item.id);
            try {
                const fileData = await apiService.uploadFile(item.file, id!, (amt) => {
                    setFiles((prev) => ({
                        ...prev,
                        inpFiles: prev.inpFiles.map((f) =>
                            f.id === item.id ? { ...f, progress: amt } : f  //for fil progress
                        )
                    }))
                });
                //after comp
                setFiles((prev) => ({
                    ...prev,
                    inpFiles: prev.inpFiles.map((f) => f.id === item.id ? { ...f, status: 'completed' } : f)
                }))
                return fileData;
            } catch (err) {
                uploadRef.current.delete(item.id);  //ref del
                setFiles((prev) => ({
                    ...prev,
                    inpFiles: prev.inpFiles.map((f) =>
                        f.id === item.id ? { ...f, status: 'err' } : f
                    )
                }));
                throw err;
            }
        });

        const res = await Promise.allSettled(uploadItems);
        //to check onlysuccess uploads
        const filterRes = res.filter((r) => r.status === 'fulfilled').map((r) => r.value);
        if (filterRes.length) {
            setTimeout(() => {
                setFiles((prev) => ({
                    ...prev,
                    data: [...filterRes, ...prev.data],
                    inpFiles: prev.inpFiles.filter((f) => 
                        !filterRes.some((r) => r.name === f.file.name))
                }));
                filterRes.forEach((f) => {
                    const inp = selFiles.find((sf) => sf.file.name === f.name);
                    if (inp) uploadRef.current.delete(inp.id);
                });
            }, 1000);
        }
    }

    useEffect(() => {
        if (!files.delErr) return;
        const timer = setTimeout(() => {
            setFiles((prev) => ({ ...prev, delErr: "" }))
        }, 3000);
        return (() => clearTimeout(timer));
    }, [files.delErr])

    const handleDelFile = async (fileId: string | number) => {
        console.log("fileId to del: ", fileId);
        try {
            await apiService.delFile(id!, fileId);
            setFiles((prev) => ({
                ...prev,
                data: prev.data?.filter((f) => f.id?.toString() !== fileId?.toString())
            }));
        } catch (err:any) {
            setFiles((prev) => ({ ...prev, delErr:"Delete file failed. Try again." }))
        }
    }

    return (
        <div className="detail-page">
            <button className="btn-back" onClick={() => navigate(`/projects/${id}`)}>
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>Back
            </button>
            <div className="detail-wrapper">
                <h5 className="detail-title">{"Files Management"}</h5>
                <div className='drop-zone'
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleChange(e.dataTransfer.files)
                    }}
                    onClick={() => inputRef.current?.click()}
                >
                    <p>Drag and Drop files here or click to upload.</p>
                    <input type="file" className='file-inp'
                        multiple
                        ref={inputRef}
                        onChange={(e) => e.target.files && handleChange(e.target.files)}
                    />
                </div>

                {files.inpFiles.length ?
                    <div className='queue-zone'>
                        <div className='flex-between'>
                            <span className='state-text'>{`Uploading (${files.inpFiles.length})`}</span>
                        </div>
                        {files.inpFiles.map((item) => (
                            <div key={item.id} className='file-box'>
                                <div className='flex-between'>
                                    <span className='state-text'>{item.file.name}</span>
                                    <button className="flex-center btn btn-delete"
                                        onClick={() =>
                                            setFiles((prev) => ({
                                                ...prev,
                                                inpFiles: prev.inpFiles.filter((f) => f.id !== item.id)
                                            }))}
                                        title="Delete file">
                                        <svg width={"15px"} height={"15px"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                                <div className='distribute-bar' style={{ margin: '0.3rem 0' }}>
                                    <div style={{ width: `${item.progress}%` }}
                                        className={`${item.status === 'err' ? 'file-err' : 'file-progress'}`}>
                                    </div>
                                </div>

                                <div className="file-meta">
                                    <span className="file-size">
                                        {(item.file.size / 1024).toFixed(1)}KB
                                    </span>
                                    <span className={item.status === 'completed' ? 'file-success' : item.status === 'err' ? 'err-txt' : ''}>
                                        {item.status === 'err' ? 'Error' :
                                            item.status === 'completed' ?
                                                <svg width={"20"} height={"20"} xmlns="http://www.w3.org/2000/svg"
                                                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                                :

                                                `${item.progress}%`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    : null}

                {!!files.delErr &&
                    <p className="card-err">{files.delErr}</p>}
                <div className='table-wrapper'>
                    <table className='file-table'>
                        <thead>
                            <tr className='state-text'>
                                <th>Name</th>
                                <th>Size(KB)</th>
                                <th>Upload Date</th>
                                <th>Action</th>
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
                                    !!files.err ?
                                        <tr>
                                            <td colSpan={4} className='card-err'>
                                                {files.err}
                                            </td>
                                        </tr>
                                        : !files.data.length ?
                                            <tr>
                                                <td colSpan={4} className='state-text'>No files added yet.</td>
                                            </tr>
                                            :
                                            files.data.map((f, idx) => (
                                                <tr key={idx} className='state-text'>
                                                    <td>{f.name}</td>
                                                    <td>{(f.size / 1024).toFixed(2)}</td>
                                                    <td>{formatDate(f.uploadedAt)}</td>
                                                    <td>
                                                        <button className='btn btn-delete' title='Delete' onClick={() => handleDelFile(f.id)}>
                                                            <svg width={"15px"} height={"15px"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default FilesManagement
