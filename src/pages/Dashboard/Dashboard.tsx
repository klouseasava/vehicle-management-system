import React, { Children } from 'react'
// Dashboard.tsx — live fleet overview derived from the shared FleetDataContext.
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BellRingIcon,
  AlertOctagonIcon,
  LinkIcon,
  CircleCheckIcon,
} from 'lucide-react'
import { useFleetData } from '../../context/FleetDataContext'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { SummaryCard } from './SummaryCard'
import { RepairTrendsChart } from './RepairTrendsChart'
import { EmptyState } from '../../components/StateViews/StateViews'
import './Dashboard.css'
export function Dashboard() {
  const { dashboard, trends, vehicles } = useFleetData()
  return (
    <div className="dashboard">
      <PageHeader
        title="Fleet Overview"
        subtitle="Live status of the Vihiga County vehicle fleet."
      />
      <motion.div
        className="dashboard__cards"
        initial="hidden"
        animate="show"
        variants={{
          show: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <SummaryCard
          icon={<BellRingIcon size={20} />}
          tone="amber"
          label="Service Reminders"
          value={dashboard.reminders}
          hint="Priority units due for service"
          to="/maintenance"
        />
        <SummaryCard
          icon={<AlertOctagonIcon size={20} />}
          tone="red"
          label="Open Critical Issues"
          value={dashboard.critical}
          hint="Defects flagged critical"
          to="/maintenance"
        />
        <SummaryCard
          icon={<LinkIcon size={20} />}
          tone="blue"
          label="Active Assignments"
          value={dashboard.activeAssignments}
          hint="Vehicles with a driver"
          to="/fleet"
        />
        <SummaryCard
          icon={<CircleCheckIcon size={20} />}
          tone="green"
          label="Fleet Functional"
          value={`${dashboard.functional}/${dashboard.total}`}
          hint="Vehicles in service"
          to="/tracking"
        />
      </motion.div>
      <div className="card dashboard__chart">
        <div className="card__header">
          <div>
            <h2 className="card__title">Repair Priority Trends</h2>
            <p className="card__subtitle">
              Updates instantly when a new defect is reported
            </p>
          </div>
          <Link to="/maintenance" className="btn btn--ghost btn--sm">
            Open ledger
          </Link>
        </div>
        <div className="card__body">
          {trends.length ? (
            <RepairTrendsChart data={trends} />
          ) : (
            <EmptyState
              title="No repair activity yet"
              hint={
                vehicles.length
                  ? 'Report a defect to begin the repair trend.'
                  : 'Restore demo records or add fleet assets to begin.'
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
