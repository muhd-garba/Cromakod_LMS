import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

import { Layout } from './components/Layout';
import { CourseCreatePage } from './features/courses/CourseCreatePage';
import { CourseCatalogPage } from './features/courses/CourseCatalogPage';
import { CoursePlayerPage } from './features/courses/CoursePlayerPage';
import { AdminDashboard } from './features/admin/AdminDashboard';

// ... (ProtectedRoute same as before)

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={
              <div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1><p>Welcome to Cromkod LMS!</p></div>
            } />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="courses" element={<CourseCatalogPage />} />
            <Route path="courses/:id" element={<CoursePlayerPage />} />
            <Route path="courses/create" element={<CourseCreatePage />} />
            <Route index element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
