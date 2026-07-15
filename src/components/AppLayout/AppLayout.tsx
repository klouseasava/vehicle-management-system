import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Sidebar } from '../Sidebar/Sidebar'
import { Topbar } from '../Topbar/Topbar'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { useAuth } from '../../context/AuthContext'
import { onFallbackChange } from '../../api/client'
import './AppLayout.css'
export function AppLayout() {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [usingMock, setUsingMock] = useState(false)
  const reducedMotion = useReducedMotion()
  
  useEffect(() => onFallbackChange(setUsingMock), [])
  
  useEffect(() => setDrawerOpen(false), [location.pathname])
  function doLogout() {
    setConfirmLogout(false)
    logout()
    navigate('/login')
  }
  return (
    <div className="app-layout">
    
      {drawerOpen && (
        <div
          className="app-layout__scrim"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <Sidebar
        open={drawerOpen}
        onNavigate={() => setDrawerOpen(false)}
        onLogout={() => setConfirmLogout(true)}
      />

      <div className="app-layout__main">
        <Topbar onMenu={() => setDrawerOpen(true)} usingMock={usingMock} />
        <main className="app-layout__content vfms-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 8,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 0,
                      y: -6,
                    }
              }
              transition={{
                duration: reducedMotion ? 0 : 0.2,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="app-layout__page"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ConfirmModal
        open={confirmLogout}
        title="Log out of VFMS?"
        message="You will need to sign in again with a fresh verification code."
        confirmLabel="Log out"
        danger
        onConfirm={doLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  )
}
