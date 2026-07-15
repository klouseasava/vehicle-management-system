import React from 'react'
// Topbar.tsx — account controls, demo status, and shared notification acknowledgement.
import { BellIcon, MenuIcon, RadioIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFleetData } from '../../context/FleetDataContext'
import './Topbar.css'
export function Topbar({
  onMenu,
  usingMock,
}: {
  onMenu: () => void
  usingMock: boolean
}) {
  const { user } = useAuth()
  const { notifications, markNotificationsRead } = useFleetData()
  const initials = (user?.full_name || 'VF')
    .split(' ')
    .map((x) => x[0])
    .slice(0, 2)
    .join('')
  return (
    <header className="topbar">
      <button
        className="topbar__menu"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <MenuIcon size={22} />
      </button>
      <div className="topbar__spacer" />
      {usingMock && (
        <span
          className="topbar__demo"
          title="API fallback is active; shared local demo data is in use"
        >
          <RadioIcon size={14} />
          Demo data
        </span>
      )}
      <button
        className="topbar__notifications"
        onClick={markNotificationsRead}
        aria-label={`Clear ${notifications.length} notifications`}
      >
        <BellIcon size={18} />
        {notifications.length > 0 && <b>{notifications.length}</b>}
      </button>
      <div className="topbar__user">
        <div className="topbar__avatar">
          {user?.avatar ? <img src={user.avatar} alt="" /> : initials}
        </div>
        <div className="topbar__user-text">
          <span className="topbar__user-name">
            {user?.full_name || 'VFMS User'}
          </span>
          <span className="topbar__user-role">
            {user?.role || 'Fleet Administrator'}
          </span>
        </div>
      </div>
    </header>
  )
}
