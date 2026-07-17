// App.tsx — Provider tree, routing, and Vihiga layouts
import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FleetDataProvider } from './context/FleetDataContext'
import { ToastProvider } from './components/Toast/ToastProvider'
import { AppLayout } from './components/AppLayout/AppLayout'
import { Login } from './pages/Login/Login'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Tracking } from './pages/Tracking/Tracking'
import { FleetAssets } from './pages/FleetAssets/FleetAssets'
import { Drivers } from './pages/Drivers/Drivers'
import { Reports } from './pages/Reports/Reports' // Replacing AddVehicle
import { Maintenance } from './pages/Maintenance/Maintenance'
import { Fuel } from './pages/Fuel/Fuel' // Maps to Fuel & Work Tickets
import { Profile } from './pages/Profile/Profile'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const location = useLocation()
  return token ? (
    <>{children}</>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{
        from: location,
      }}
    />
  )
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  return useAuth().token ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FleetDataProvider>
          <ToastProvider>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicOnly>
                    <Login />
                  </PublicOnly>
                }
              />
              <Route
                element={
                  <RequireAuth>
                    <AppLayout />
                  </RequireAuth>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/fleet" element={<FleetAssets />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/fuel" element={<Fuel />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ToastProvider>
        </FleetDataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}