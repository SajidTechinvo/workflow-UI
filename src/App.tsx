import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth-store'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import WorkflowListPage from './pages/workflows/WorkflowListPage'
import CreateWorkflowPage from './pages/workflows/CreateWorkflowPage'
import EditWorkflowPage from './pages/workflows/EditWorkflowPage'
import WorkflowBuilderPage from './pages/workflows/WorkflowBuilderPage'
import Layout from './components/layout/Layout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/workflows" element={<WorkflowListPage />} />
                  <Route path="/workflows/new" element={<CreateWorkflowPage />} />
                  <Route path="/workflows/:id" element={<WorkflowBuilderPage />} />
                  <Route path="/workflows/:id/edit" element={<EditWorkflowPage />} />
                  <Route path="/workflows/:id/builder" element={<WorkflowBuilderPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

