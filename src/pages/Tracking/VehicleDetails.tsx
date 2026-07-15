// VehicleDetails.tsx — selected tracking details resolved from shared driver and vehicle records.
import { PhoneIcon, RouteIcon, ShieldCheckIcon, UserIcon } from 'lucide-react'
import type { TrackedVehicle } from '../../api/vehicles'
import { useFleetData } from '../../context/FleetDataContext'
import { StatusBadge } from '../../components/StatusBadge/StatusBadge'
export function VehicleDetails({ vehicle }: { vehicle: TrackedVehicle }) {
  const { vehicles, getDriverForVehicle } = useFleetData()
  const asset = vehicles.find((v) => v.plate_number === vehicle.plate)
  const driver = asset && getDriverForVehicle(asset)
  return (
    <div className="card veh-details">
      <div className="veh-details__head">
        <div className="veh-details__identity">
          {asset?.image_urls?.[0] && <img src={asset.image_urls[0]} alt="" />}
          <div>
            <span className="veh-details__plate mono">{vehicle.plate}</span>
            <span className="veh-details__model">{vehicle.model}</span>
          </div>
        </div>
        <StatusBadge status={vehicle.status} />
      </div>
      <div className="veh-details__auth is-ok">
        <ShieldCheckIcon size={16} />{' '}
        {driver ? 'Authorized assignment' : 'Unassigned vehicle'}
      </div>
      <dl className="veh-details__grid">
        <div>
          <dt>
            <UserIcon size={14} />
            Driver
          </dt>
          <dd className="veh-details__driver">
            {driver?.profile_photo && <img src={driver.profile_photo} alt="" />}
            {driver?.full_name || 'Unassigned'}
          </dd>
        </div>
        <div>
          <dt>Work ID</dt>
          <dd className="mono">{driver?.employee_id || '—'}</dd>
        </div>
        <div>
          <dt>
            <PhoneIcon size={14} />
            Phone
          </dt>
          <dd className="mono">{driver?.phone_number || '—'}</dd>
        </div>
        <div>
          <dt>Speed</dt>
          <dd className="mono">{vehicle.speed || 0} km/h</dd>
        </div>
        <div>
          <dt>
            <RouteIcon size={14} />
            Route distance
          </dt>
          <dd className="mono">{vehicle.route_distance_km.toFixed(1)} km</dd>
        </div>
      </dl>
    </div>
  )
}
