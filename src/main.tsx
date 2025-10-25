import { createRoot } from 'react-dom/client'
import { initPresence } from '@/services/presence'
import App from './App.tsx'
import './index.css'
import './styles/mobile-overrides.css'
import 'leaflet/dist/leaflet.css'

// Initialize presence system
initPresence()

createRoot(document.getElementById("root")!).render(<App />);
