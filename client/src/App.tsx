import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { Layout } from './components/Layout';
import { CourseCreatePage } from './features/courses/CourseCreatePage';
import { CourseCatalogPage } from './features/courses/CourseCatalogPage';
import { CoursePlayerPage } from './features/courses/CoursePlayerPage';
import { AdminDashboard } from './features/admin/AdminDashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

function App() {
  console.log('App rendering');
  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, background: 'red', color: 'white', padding: '4px' }}>
        DEBUG: App is running
      </div>
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
    </>
  );
}

export default App;
