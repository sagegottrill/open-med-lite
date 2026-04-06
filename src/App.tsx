import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import MedicalApp from './MedicalApp'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <SmoothScroll>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<MedicalApp />} />
          <Route path="/officer-dashboard" element={<MedicalApp />} />
          <Route path="/patients" element={<MedicalApp />} />
          <Route path="/desk" element={<MedicalApp />} />
        </Routes>
      </BrowserRouter>
    </SmoothScroll>
  )
}
