import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddHabit from './pages/AddHabit.jsx';
import Insights from './pages/Insights.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<AddHabit />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
