import AuthContextProvider from './contexts/AuthContext'
import ProjectsProvider from './contexts/ProjectsContext'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <AuthContextProvider>
      <ProjectsProvider>
      <AppRoutes/>
      </ProjectsProvider>
    </AuthContextProvider>
  )
}

export default App
