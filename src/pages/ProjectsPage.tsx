import { useAuth } from "../contexts/AuthContext";

const ProjectsPage = () => {
  const {onLogout} = useAuth();
  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'1rem', gap:'8px'}}>
    <div>
        Projects listing--to do
    </div>
    <button type="button"
            className="logout-btn"
            onClick={()=>onLogout()}
          > Logout
            </button>
    </div>
  )
}

export default ProjectsPage;
