import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { SellerDashboard } from './pages/SellerDashboard';
import { BuyerSubmission } from './pages/BuyerSubmission';
import { OfferComparison } from './pages/OfferComparison';
import { PropertyIntelligence } from './pages/PropertyIntelligence';
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/buyer" element={<BuyerSubmission />} />
          <Route path="/offers" element={<OfferComparison />} />
          <Route path="/intelligence" element={<PropertyIntelligence />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </Router>
  )
}

export default App
