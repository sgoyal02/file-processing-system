import { useEffect, useState, type SubmitEvent } from 'react';
import type { AddProjectFormErr, Project } from '../services/types';
import '../styles/login.css';

interface AddProjectprops {
  onSubmit:(data:{ name: string; description: string})=> Promise<{success:boolean, msg:string}>;
  onCancel: () => void;
  formData:Project | null
}

const AddProject=({ onSubmit, onCancel, formData }: AddProjectprops)=> {
  const [inp, setInp] = useState({name:"", description:"", isSubmit: false})
  const [err, setErr] = useState<AddProjectFormErr>({});

  useEffect(()=>{
    if(formData)
      setInp((prev)=>({...prev, name: formData.name, description: formData.description}));
  },[formData]);

  const validateForm=(): boolean=> {
    const newErr: AddProjectFormErr = {};
    if (!inp.name.trim()) newErr.name = 'Project name is required.';
    if (!inp.description.trim()) newErr.description = 'Description is required.';
    setErr(newErr);
    return Object.keys(newErr).length === 0;
  }

  const handleSubmit =async(e: SubmitEvent)=> {
    e.preventDefault();
    if (!validateForm()) return;
    setInp((prev)=>({...prev, isSubmit: true}))
    const {success, msg} =  await onSubmit({ name: inp.name.trim(), description: inp.description.trim() });
    if(success)
        onCancel();
    else{
       setErr((prev)=>({...prev, res: msg})); 
        setInp((prev)=>({...prev, isSubmit: false}))
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {!!err.res&& (
        <div className="res-error">{err.res}</div>
      )}

      <div className={`form-group ${err.name ? 'has-error' : ''}`}>
        <label className={`inp-group ${!!err.name ? 'err' : ''}`} htmlFor="proj-name"
        style={{fontSize: "0.9rem"}}>Project Name</label>
        <input
          id="proj-name"
          type="text"
          className="user-inp"
          placeholder="Add name here"
          value={inp.name}
          onChange={(e) => {
            setInp((prev)=>({...prev, name: e.target.value}));
            setErr((prev)=>({...prev, name:"", res:""}))
          }}
          disabled={inp.isSubmit}
        />
        {!!err.name && <span className="inp-errTxt">{err.name}</span>}
      </div>

      <div className={`form-group ${err.description ? 'has-error' : ''}`} style={{ marginTop: '1rem' }}>
        <label className={`inp-group ${!!err.description ? 'err' : ''}`}
         htmlFor="proj-desc"
          style={{fontSize: "0.9rem"}}>Description</label>
        <textarea
          id="proj-desc"
          className="user-inp"
          style={{resize:'vertical', fontFamily:'inherit'}}
          placeholder="Project details"
          value={inp.description}
          onChange={(e) => {
            setInp((prev)=>({...prev, description: e.target.value}));
            setErr((prev)=>({...prev, description:"", res:""}))
          }}
          disabled={inp.isSubmit}
          rows={3}
        />
        {!!err.description && <span className="inp-errTxt">{err.description}</span>}
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={inp.isSubmit}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={inp.isSubmit}>
          Submit
        </button>
      </div>
    </form>
  );
}


export default AddProject