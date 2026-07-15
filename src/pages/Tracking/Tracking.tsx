import React, { useMemo, useState } from 'react'
// Tracking.tsx — shared live simulation view; no route-local data fetches.
import { InfoIcon } from 'lucide-react'
import { useFleetData } from '../../context/FleetDataContext'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { StatusBadge } from '../../components/StatusBadge/StatusBadge'
import { TrackingMap } from './TrackingMap'
import { VehicleDetails } from './VehicleDetails'
import './Tracking.css'
export function Tracking() {
  const { tracking, vehicles, getDriverForVehicle } = useFleetData()
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<number | null>(null)
  const list = useMemo(
    () =>
      filter === 'All' ? tracking : tracking.filter((t) => t.status === filter),
    [tracking, filter],
  )
  const vehicle = list.find((t) => t.id === selected) || list[0]
  return (
    <div className="tracking">
      <PageHeader
        title="Vehicle Tracking"
        subtitle="Simulated Vihiga road positions update gently until the live GPS endpoint is connected."
      />
      <div className="tracking__grid">
        <div className="tracking__panel card">
          <div className="tracking__filters">
            {['All', 'In Motion', 'Parked', 'In Repair'].map((f) => (
              <button
                key={f}
                className={`tracking__filter ${filter === f ? 'tracking__filter--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="tracking__history">
            <span className="tracking__history-label">
              Route history · GPS endpoint pending
            </span>
            <div className="tracking__history-selects">
              <select className="select">
                <option>Today</option>
              </select>
              <button className="btn btn--ghost btn--sm" onClick={() => {}}>
                View
              </button>
            </div>
          </div>
          <div className="tracking__list vfms-scroll">
            {list.map((t) => {
              const v = vehicles.find((x) => x.plate_number === t.plate)
              const d = v && getDriverForVehicle(v)
              return (
                <button
                  key={t.id}
                  className={`tracking__item ${vehicle?.id === t.id ? 'tracking__item--active' : ''}`}
                  onClick={() => setSelected(t.id)}
                >
                  <div className="tracking__item-main">
                    {d?.profile_photo && (
                      <img
                        className="tracking__avatar"
                        src={d.profile_photo}
                        alt=""
                      />
                    )}
                    <span>
                      <b className="tracking__item-plate mono">{t.plate}</b>
                      <small className="tracking__item-model">{t.model}</small>
                    </span>
                  </div>
                  <StatusBadge status={t.status} />
                </button>
              )
            })}
          </div>
        </div>
        <div className="tracking__right">
          <div className="card tracking__map-card">
            <TrackingMap
              vehicles={list}
              selected={vehicle || null}
              onSelect={setSelected}
            />
          </div>
          {vehicle ? (
            <VehicleDetails vehicle={vehicle} />
          ) : (
            <div className="card card__body info-callout">
              <InfoIcon size={16} />
              No vehicles are available. Restore demo records or add a vehicle.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
