import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProviderLogin from './components/provider/ProviderLogin';
import ProviderDashboard from './components/provider/ProviderDashboard';
import ProviderRecord from './components/provider/ProviderRecord';
import ProviderSummary from './components/provider/ProviderSummary';
import ProviderLoading from './components/provider/ProviderLoading';

import PatientLogin from './components/patient/PatientLogin';
import PatientDashboard from './components/patient/PatientDashboard';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/provider/login" element={<ProviderLogin />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/record" element={<ProviderRecord />} />
        <Route path="/provider/summary" element={<ProviderSummary />} />
        <Route path="/provider/loading" element={<ProviderLoading />} />

        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;