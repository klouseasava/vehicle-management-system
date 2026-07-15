import React, { useState } from 'react'
// Fuel.tsx — shared derived fuel overview and session-persisted daily logs.
import { format } from 'date-fns'
import {
  CalendarSearchIcon,
  FuelIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react'
import { useFleetData } from '../../context/FleetDataContext'
import { useToast } from '../../components/Toast/ToastProvider'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { EmptyState } from '../../components/StateViews/StateViews'
import { formatKsh, formatNumber } from '../../utils/format'
import './Fuel.css'
export function Fuel() {
  const { fuelSummary, getDailyLog, synchronizeFuel } = useFleetData()
  const toast = useToast()
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [looked, setLooked] = useState(false)
  const rows = getDailyLog(date)
  return (
    <div className="fuel stack">
      <PageHeader
        title="Fuel & Energy Tracking"
        subtitle="Fuel summaries reflow automatically whenever the fleet changes."
        actions={
          <button
            className="btn btn--forest"
            onClick={() => {
              synchronizeFuel()
              toast.success('Fuel summary synchronized.')
            }}
          >
            <RefreshCwIcon size={16} />
            Synchronize logs
          </button>
        }
      />
      <div className="fuel__cards">
        {[
          [
            <FuelIcon size={20} />,
            'litres',
            `${formatNumber(fuelSummary.summary.total_fleet_litres)} L`,
            'Total fleet litres',
          ],
          [
            <WalletIcon size={20} />,
            'cost',
            formatKsh(fuelSummary.summary.total_fleet_cost),
            'Total fleet cost',
          ],
          [
            <TrendingUpIcon size={20} />,
            'forecast',
            formatKsh(fuelSummary.forecast.estimated_next_month_budget_ksh),
            'Next-month forecast',
          ],
        ].map(([icon, tone, value, label], i) => (
          <div className="fuel__card" key={i}>
            <span className={`fuel__card-icon fuel__card-icon--${tone}`}>
              {icon as React.ReactNode}
            </span>
            <span className="fuel__card-value mono">{value as string}</span>
            <span className="fuel__card-label">{label as string}</span>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Per-vehicle burn rate</h2>
        </div>
        {fuelSummary.vehicles.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Plate</th>
                  <th>Model</th>
                  <th>Monthly litres</th>
                  <th>Monthly cost</th>
                  <th>Daily avg.</th>
                </tr>
              </thead>
              <tbody>
                {fuelSummary.vehicles.map((v) => (
                  <tr key={v.plate_number}>
                    <td className="mono">{v.plate_number}</td>
                    <td>{v.model}</td>
                    <td className="mono">
                      {formatNumber(v.monthly_total_litres)}
                    </td>
                    <td className="mono">{formatKsh(v.monthly_total_cost)}</td>
                    <td className="mono">
                      {formatNumber(v.daily_average_litres)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No fuel records yet"
            hint="Add vehicles or restore demo records to populate fleet consumption."
          />
        )}
      </div>
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">
            <CalendarSearchIcon size={16} />
            Daily log lookup
          </h2>
        </div>
        <div className="card__body">
          <div className="fuel__lookup">
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              className="btn btn--primary"
              onClick={() => setLooked(true)}
            >
              Fetch log
            </button>
          </div>
          {looked &&
            (rows.length ? (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Plate</th>
                      <th>Distance</th>
                      <th>Litres</th>
                      <th>Cost</th>
                      <th>Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.plate_number}>
                        <td className="mono">{r.plate_number}</td>
                        <td>{r.distance} km</td>
                        <td>{r.litres}</td>
                        <td>{formatKsh(r.cost)}</td>
                        <td>{r.speed} km/h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No entries for this date"
                hint="Daily logs were cleared with the local project data."
              />
            ))}
        </div>
      </div>
    </div>
  )
}
