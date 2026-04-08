import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListPage from './pages/ListPage';
import FormPage from './pages/FormPage';
import DetailPage from './pages/DetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/add" element={<FormPage />} />
        <Route path="/edit/:id" element={<FormPage />} />
        
        {}
        <Route path="/detail/:id" element={<DetailPage />} />
        
        {}
        <Route path="/user/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
