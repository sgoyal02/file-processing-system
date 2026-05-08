import AuthContextProvider from './contexts/AuthContext'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <AuthContextProvider>
      <AppRoutes/>
    </AuthContextProvider>
  )
}

export default App
