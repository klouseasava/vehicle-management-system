// Sidebar.tsx — persistent left navigation. The signature element of the app:
// deep forest surface, road-marking texture strip, and a sliding active indicator.

import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboardIcon,
  MapPinnedIcon,
  TruckIcon,
  UsersIcon,
  PlusSquareIcon,
  WrenchIcon,
  FuelIcon,
  UserCircleIcon,
  LogOutIcon,
} from 'lucide-react'
import './Sidebar.css'
interface Props {
  open: boolean
  onNavigate: () => void
  onLogout: () => void
}
const NAV = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    to: '/tracking',
    label: 'Vehicle Tracking',
    icon: MapPinnedIcon,
  },
  {
    to: '/fleet',
    label: 'Manage Fleet Assets',
    icon: TruckIcon,
  },
  {
    to: '/drivers',
    label: 'Manage Drivers',
    icon: UsersIcon,
  },
  {
    to: '/add-vehicle',
    label: 'Add Vehicle',
    icon: PlusSquareIcon,
  },
  {
    to: '/maintenance',
    label: 'Service & Maintenance',
    icon: WrenchIcon,
  },
  {
    to: '/fuel',
    label: 'Fuel & Energy',
    icon: FuelIcon,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: UserCircleIcon,
  },
]
export function Sidebar({ open, onNavigate, onLogout }: Props) {
  return (
    <aside
      className={`sidebar ${open ? 'sidebar--open' : ''}`}
      aria-label="Primary"
    >
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">
          <TruckIcon size={22} />
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-title">VFMS</span>
          <span className="sidebar__brand-sub">Vihiga County Fleet</span>
        </div>
      </div>

      {/* Road-marking texture strip — subtle county-roads signature. */}
      <div className="sidebar__road" aria-hidden="true" />

      <nav className="sidebar__nav vfms-scroll">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="sidebar__active-bar"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 40,
                    }}
                  />
                )}
                <Icon size={19} className="sidebar__link-icon" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={onLogout}>
        <LogOutIcon size={19} />
        <span>Logout</span>
      </button>
    </aside>
  )
}
