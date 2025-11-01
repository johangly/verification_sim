import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { StadisticsPage } from './pages/StadisticsPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignsPageSelected from './pages/CampaignsSelectedPage';
import DetailsCampaignsPage from "./pages/DetailsCampaignsPage.tsx";
import ConcentratedPage from './pages/ConcentratedPage.tsx';
import GroupPage from './pages/GroupPage.tsx';
import PromotersPage from './pages/PromotersPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import { ReactNode } from 'react';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.tsx';
import UsersPage from './pages/UsersPage.tsx';
import UserForm from './components/UserForm.tsx';
import path from 'path';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/" element={
                <HomePage />
              } />
              <Route path="/campaigns" element={
                <CampaignsPage />
              } />
              <Route path="/campaigns/:id" element={
                <CampaignsPageSelected />
              } />
              <Route path="/estadisticas" element={
                <StadisticsPage />
              } />
              <Route path="/concentrated" element={
                <ConcentratedPage />
              } />
              <Route path='/groups' element={
                <GroupPage />
              } />
              <Route path='/promoters' element={
                <PromotersPage />
              } />
              <Route path="details-campaign" element={
                <DetailsCampaignsPage />
              } />
              <Route path='/users' element={
                <UsersPage />
              } />
              
            </Route>
            <Route path="register-user-admin" element={
                <UserForm
                  showSelectRole={true}
                />
              }/>
            <Route path="register-user" element={
                <UserForm
                  showSelectRole={false}
                />
              }/>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;