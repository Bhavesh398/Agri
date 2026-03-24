import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgriBot from './components/AgriBot';

import Home from './pages/Home';
import CropDoctor from './pages/CropDoctor';
import Weather from './pages/Weather';
import Market from './pages/Market';
import Soil from './pages/Soil';
import Schemes from './pages/Schemes';

function App() {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crop-doctor" element={<CropDoctor />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/market" element={<Market />} />
          <Route path="/soil" element={<Soil />} />
          <Route path="/schemes" element={<Schemes />} />
        </Routes>
      </main>
      <Footer />
      <AgriBot />
    </div>
  );
}

export default App;
