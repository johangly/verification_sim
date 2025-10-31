import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { StadisticsPage } from './pages/StadisticsPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignsPageSelected from './pages/CampaignsSelectedPage';
import DetailsCampaignsPage from "./pages/DetailsCampaignsPage.tsx";
import ConcentratedPage from './pages/ConcentratedPage.tsx';
import GroupPage from './pages/GroupPage.tsx';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/:id" element={<CampaignsPageSelected />} />
            <Route path="/estadisticas" element={<StadisticsPage />} />
            <Route path="/concentrated" element={<ConcentratedPage />} />
            <Route path='/groups' element={<GroupPage/>} />
              <Route path="details-campaign" element={<DetailsCampaignsPage/>} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;