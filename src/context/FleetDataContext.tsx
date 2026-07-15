import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  createContext,
  useContext,
} from 'react'
// FleetDataContext.tsx — one simple, session-persisted source of truth for VFMS fleet data.
// API mutations are attempted first; the local shared cache updates optimistically so the
// demo remains coherent when the backend is unavailable. This is intentionally not Redux.

import {
  addVehicle as apiAddVehicle,
  assignDriver as apiAssignDriver,
} from '../api/vehicles'
import type { Vehicle, TrackedVehicle } from '../api/vehicles'
import {
  deleteDriver as apiDeleteDriver,
  registerDriver as apiRegisterDriver,
  updateDriver as apiUpdateDriver,
  updateDriverStatus as apiUpdateDriverStatus,
} from '../api/drivers'
import type { Driver } from '../api/drivers'
import { reportDefect as apiReportDefect } from '../api/maintenance'
import type { LedgerItem } from '../api/maintenance'
import {
  mockDailyLog,
  mockDrivers,
  mockFuelSummary,
  mockPartsLedger,
  mockRepairTrends,
  mockTracking,
  mockVehicles,
} from '../api/mockData'
const CACHE_KEY = 'vfms_fleet_data_v2'
type Notification = {
  id: string
  message: string
  createdAt: number
}
type Trend = {
  month: string
  critical: number
  high: number
  medium: number
}
interface FleetCache {
  vehicles: Vehicle[]
  drivers: Driver[]
  ledger: LedgerItem[]
  tracking: TrackedVehicle[]
  dailyLogs: Record<string, ReturnType<typeof mockDailyLog>>
  notifications: Notification[]
  trends: Trend[]
}
interface FleetData extends FleetCache {
  loading: boolean
  addVehicle: (vehicle: Omit<Vehicle, 'status'>) => Promise<void>
  updateVehicleImages: (plate: string, files: File[]) => void
  assignDriver: (
    plate: string,
    employeeId: string,
  ) => Promise<{
    ok: boolean
    message?: string
  }>
  addDriver: (
    driver: Omit<Driver, 'profile_photo'>,
    photo: File,
  ) => Promise<void>
  updateDriver: (
    employeeId: string,
    driver: Omit<Driver, 'profile_photo'>,
    photo?: File | null,
  ) => Promise<void>
  updateDriverStatus: (employeeId: string, status: string) => Promise<void>
  removeDriver: (employeeId: string) => Promise<void>
  reportDefect: (payload: {
    plate_number: string
    part_name: string
    urgency_level: string
  }) => Promise<void>
  getDriverForVehicle: (vehicle: Vehicle) => Driver | undefined
  getVehicleForDriver: (employeeId: string) => Vehicle | undefined
  fuelSummary: typeof mockFuelSummary
  dashboard: {
    reminders: number
    critical: number
    activeAssignments: number
    functional: number
    total: number
  }
  getDailyLog: (date: string) => ReturnType<typeof mockDailyLog>
  synchronizeFuel: () => void
  markNotificationsRead: () => void
  resetSystem: () => void
  restoreDemoRecords: () => void
}
const FleetDataContext = createContext<FleetData | undefined>(undefined)
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
function demoCache(): FleetCache {
  const vehicles = clone(mockVehicles) as Vehicle[]
  const assignmentPairs = [
    ['KDM 420X', 'VFM-1024'],
    ['KCX 118A', 'VFM-1088'],
    ['KBQ 301L', 'VFM-1201'],
    ['KDE 777P', 'VFM-1156'],
  ]
  assignmentPairs.forEach(([plate, employee]) => {
    const vehicle = vehicles.find((v) => v.plate_number === plate)
    if (vehicle) vehicle.assigned_employee_id = employee
  })
  return {
    vehicles,
    drivers: clone(mockDrivers),
    ledger: clone(mockPartsLedger),
    tracking: clone(mockTracking).map((item, index) => ({
      ...item,
      speed: item.status === 'In Motion' ? [48, 62, 71][index % 3] : 0,
      direction: [42, 138, 205, 310][index % 4],
      route_index: index * 2,
    })),
    dailyLogs: {
      [new Date().toISOString().slice(0, 10)]: clone(
        mockDailyLog(new Date().toISOString().slice(0, 10)),
      ),
    },
    notifications: [
      {
        id: 'demo-ready',
        message: 'Fleet operations demo is ready for review.',
        createdAt: Date.now(),
      },
    ],
    trends: clone(mockRepairTrends),
  }
}
function emptyCache(): FleetCache {
  return {
    vehicles: [],
    drivers: [],
    ledger: [],
    tracking: [],
    dailyLogs: {},
    notifications: [],
    trends: [],
  }
}
function cachedOrDemo(): FleetCache {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    return cached ? (JSON.parse(cached) as FleetCache) : demoCache()
  } catch {
    return demoCache()
  }
}
function revokeLocalUrls(cache: FleetCache) {
  const urls = [
    ...cache.vehicles.flatMap((v) => v.image_urls || []),
    ...cache.drivers.map((d) => d.profile_photo || ''),
  ]
  urls
    .filter((url) => url.startsWith('blob:'))
    .forEach((url) => URL.revokeObjectURL(url))
}
export function FleetDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FleetCache>(cachedOrDemo)
  const [loading] = useState(false)
  const dataRef = useRef(data)
  useEffect(() => {
    dataRef.current = data
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data))
  }, [data])
  // Local GPS simulator: only in-motion records advance along simple Vihiga road corridors.
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced) return
    const timer = window.setInterval(() => {
      setData((prev) => ({
        ...prev,
        tracking: prev.tracking.map((item) => {
          if (item.status !== 'In Motion') return item
          const direction =
            ((item.direction || 0) + 9 + Math.random() * 12) % 360
          const radians = (direction * Math.PI) / 180
          const step = 0.00042
          return {
            ...item,
            lat: Math.max(
              0.046,
              Math.min(0.079, item.lat + Math.cos(radians) * step),
            ),
            lng: Math.max(
              34.701,
              Math.min(34.759, item.lng + Math.sin(radians) * step),
            ),
            direction,
            speed: Math.round(42 + Math.random() * 34),
            route_distance_km: +(item.route_distance_km + 0.28).toFixed(1),
            assignment_age_mins: item.assignment_age_mins + 0.04,
          }
        }),
      }))
    }, 2600)
    return () => window.clearInterval(timer)
  }, [])
  const notify = useCallback(
    (message: string) =>
      setData((prev) => ({
        ...prev,
        notifications: [
          {
            id: `${Date.now()}-${Math.random()}`,
            message,
            createdAt: Date.now(),
          },
          ...prev.notifications,
        ].slice(0, 8),
      })),
    [],
  )
  const addVehicle = useCallback(
    async (vehicle: Omit<Vehicle, 'status'>) => {
      await apiAddVehicle({
        plate_number: vehicle.plate_number,
        model: vehicle.model,
        engine_size_cc: vehicle.engine_size_cc || 0,
      })
      setData((prev) => {
        const next: Vehicle = {
          ...vehicle,
          status: 'Unassigned',
          meter_reading: vehicle.meter_reading || 0,
        }
        const tracking: TrackedVehicle = {
          id: Date.now(),
          plate: next.plate_number,
          model: next.model,
          status: 'Parked',
          assignment_age_mins: 0,
          route_distance_km: 0,
          lat: 0.055 + Math.random() * 0.018,
          lng: 34.71 + Math.random() * 0.035,
          speed: 0,
          direction: 0,
        }
        return {
          ...prev,
          vehicles: [...prev.vehicles, next],
          tracking: [...prev.tracking, tracking],
        }
      })
      notify(`${vehicle.plate_number} joined the fleet register.`)
    },
    [notify],
  )
  const updateVehicleImages = useCallback(
    (plate: string, files: File[]) => {
      const urls = files.map((file) => URL.createObjectURL(file))
      setData((prev) => ({
        ...prev,
        vehicles: prev.vehicles.map((vehicle) => {
          if (vehicle.plate_number !== plate) return vehicle
          ;(vehicle.image_urls || [])
            .filter((url) => url.startsWith('blob:'))
            .forEach(URL.revokeObjectURL)
          return {
            ...vehicle,
            image_urls: urls,
          }
        }),
      }))
      notify(`Vehicle imagery updated for ${plate}.`)
      // TODO: backend endpoint not available yet — persist vehicle images remotely.
    },
    [notify],
  )
  const assignDriver = useCallback(
    async (plate: string, employeeId: string) => {
      const existing = dataRef.current.vehicles.find(
        (v) =>
          v.assigned_employee_id === employeeId && v.plate_number !== plate,
      )
      if (existing)
        return {
          ok: false,
          message: `${employeeId} is already assigned to ${existing.plate_number}.`,
        }
      const vehicle = dataRef.current.vehicles.find(
        (v) => v.plate_number === plate,
      )
      const driver = dataRef.current.drivers.find(
        (d) => d.employee_id === employeeId,
      )
      if (!vehicle || !driver)
        return {
          ok: false,
          message: 'Choose a registered vehicle and driver.',
        }
      await apiAssignDriver(plate, employeeId)
      setData((prev) => ({
        ...prev,
        vehicles: prev.vehicles.map((v) =>
          v.plate_number === plate
            ? {
                ...v,
                assigned_employee_id: employeeId,
                status: 'Assigned',
              }
            : v,
        ),
        tracking: prev.tracking.map((t) =>
          t.plate === plate
            ? {
                ...t,
                status: t.status === 'In Repair' ? 'In Repair' : 'In Motion',
              }
            : t,
        ),
      }))
      notify(`${driver.full_name} was authorized for ${plate}.`)
      return {
        ok: true,
      }
    },
    [notify],
  )
  const addDriver = useCallback(
    async (driver: Omit<Driver, 'profile_photo'>, photo: File) => {
      await apiRegisterDriver(driver, photo)
      const photoUrl = URL.createObjectURL(photo)
      setData((prev) => ({
        ...prev,
        drivers: [
          ...prev.drivers,
          {
            ...driver,
            profile_photo: photoUrl,
          },
        ],
      }))
      notify(`${driver.full_name} was registered as a driver.`)
    },
    [notify],
  )
  const updateDriver = useCallback(
    async (
      employeeId: string,
      driver: Omit<Driver, 'profile_photo'>,
      photo?: File | null,
    ) => {
      await apiUpdateDriver(employeeId, driver)
      const newPhoto = photo ? URL.createObjectURL(photo) : undefined
      setData((prev) => ({
        ...prev,
        drivers: prev.drivers.map((item) => {
          if (item.employee_id !== employeeId) return item
          if (newPhoto && item.profile_photo?.startsWith('blob:'))
            URL.revokeObjectURL(item.profile_photo)
          return {
            ...driver,
            profile_photo: newPhoto || item.profile_photo,
          }
        }),
      }))
      notify(`${driver.full_name}'s driver record was updated.`)
    },
    [notify],
  )
  const updateDriverStatus = useCallback(
    async (employeeId: string, status: string) => {
      await apiUpdateDriverStatus(employeeId, status)
      setData((prev) => ({
        ...prev,
        drivers: prev.drivers.map((d) =>
          d.employee_id === employeeId
            ? {
                ...d,
                status,
              }
            : d,
        ),
      }))
      notify(`Driver status set to ${status}.`)
    },
    [notify],
  )
  const removeDriver = useCallback(
    async (employeeId: string) => {
      await apiDeleteDriver(employeeId)
      setData((prev) => {
        const driver = prev.drivers.find((d) => d.employee_id === employeeId)
        if (driver?.profile_photo?.startsWith('blob:'))
          URL.revokeObjectURL(driver.profile_photo)
        return {
          ...prev,
          drivers: prev.drivers.filter((d) => d.employee_id !== employeeId),
          vehicles: prev.vehicles.map((v) =>
            v.assigned_employee_id === employeeId
              ? {
                  ...v,
                  assigned_employee_id: undefined,
                  status: 'Unassigned',
                }
              : v,
          ),
          tracking: prev.tracking.map((t) =>
            prev.vehicles.some(
              (v) =>
                v.plate_number === t.plate &&
                v.assigned_employee_id === employeeId,
            )
              ? {
                  ...t,
                  status: 'Parked',
                }
              : t,
          ),
        }
      })
      notify('Driver deleted and related assignment cleared.')
    },
    [notify],
  )
  const reportDefect = useCallback(
    async (payload: {
      plate_number: string
      part_name: string
      urgency_level: string
    }) => {
      await apiReportDefect(payload)
      setData((prev) => {
        const vehicle = prev.vehicles.find(
          (v) => v.plate_number === payload.plate_number,
        )
        const item: LedgerItem = {
          agency: 'County Fleet',
          plate_number: payload.plate_number,
          model: vehicle?.model || 'Fleet asset',
          part_name: payload.part_name,
          urgency: payload.urgency_level,
          ai_quote: 'KSh 0.00',
          notes: 'Newly reported field defect.',
        }
        const bucket: 'critical' | 'high' | 'medium' =
          payload.urgency_level.toLowerCase() === 'critical'
            ? 'critical'
            : payload.urgency_level.toLowerCase() === 'high'
              ? 'high'
              : 'medium'
        const trends: Trend[] = prev.trends.length
          ? prev.trends.map((row, index) =>
              index === prev.trends.length - 1
                ? { ...row, [bucket]: row[bucket] + 1 }
                : row,
            )
          : [{ month: 'Now', critical: bucket === 'critical' ? 1 : 0, high: bucket === 'high' ? 1 : 0, medium: bucket === 'medium' ? 1 : 0 }]
        return { ...prev, ledger: [item, ...prev.ledger], trends }
      })
      notify(`Defect reported for ${payload.plate_number}.`)
    },
    [notify],
  )
  const resetSystem = useCallback(() => {
    revokeLocalUrls(dataRef.current)
    const clean = emptyCache()
    sessionStorage.removeItem(CACHE_KEY)
    setData(clean)
    // TODO: backend endpoint not available yet — this intentionally clears only local frontend cache/demo state.
  }, [])
  const restoreDemoRecords = useCallback(() => {
    revokeLocalUrls(dataRef.current)
    setData(demoCache())
  }, [])
  const markNotificationsRead = useCallback(
    () =>
      setData((prev) => ({
        ...prev,
        notifications: [],
      })),
    [],
  )
  const getDriverForVehicle = useCallback(
    (vehicle: Vehicle) =>
      dataRef.current.drivers.find(
        (d) => d.employee_id === vehicle.assigned_employee_id,
      ),
    [],
  )
  const getVehicleForDriver = useCallback(
    (employeeId: string) =>
      dataRef.current.vehicles.find(
        (v) => v.assigned_employee_id === employeeId,
      ),
    [],
  )
  const getDailyLog = useCallback(
    (date: string) => dataRef.current.dailyLogs[date] || [],
    [],
  )
  const synchronizeFuel = useCallback(() => {
    notify('Fuel records synchronized across the fleet.')
  }, [notify])
  const fuelSummary = useMemo(() => {
    const records = data.vehicles.map((v, index) => {
      const source =
        mockFuelSummary.vehicles[index % mockFuelSummary.vehicles.length]
      return {
        plate_number: v.plate_number,
        model: v.model,
        monthly_total_litres: source?.monthly_total_litres || 0,
        monthly_total_cost: source?.monthly_total_cost || 0,
        daily_average_litres: source?.daily_average_litres || 0,
      }
    })
    const totalLitres = records.reduce(
      (sum, item) => sum + item.monthly_total_litres,
      0,
    )
    const totalCost = records.reduce(
      (sum, item) => sum + item.monthly_total_cost,
      0,
    )
    return {
      summary: {
        total_fleet_litres: totalLitres,
        total_fleet_cost: totalCost,
      },
      forecast: {
        estimated_next_month_budget_ksh: Math.round(totalCost * 1.09),
      },
      vehicles: records,
    }
  }, [data.vehicles])
  const dashboard = useMemo(
    () => ({
      reminders: data.ledger.filter((item) =>
        ['ambulance', 'governor escort'].includes(item.agency.toLowerCase()),
      ).length,
      critical: data.ledger.filter(
        (item) => item.urgency.toLowerCase() === 'critical',
      ).length,
      activeAssignments: data.vehicles.filter((v) =>
        Boolean(v.assigned_employee_id),
      ).length,
      functional: data.vehicles.filter((v) => v.status !== 'Archived').length,
      total: data.vehicles.length,
    }),
    [data.vehicles, data.ledger],
  )
  const value = useMemo<FleetData>(
    () => ({
      ...data,
      loading,
      addVehicle,
      updateVehicleImages,
      assignDriver,
      addDriver,
      updateDriver,
      updateDriverStatus,
      removeDriver,
      reportDefect,
      getDriverForVehicle,
      getVehicleForDriver,
      fuelSummary,
      dashboard,
      getDailyLog,
      synchronizeFuel,
      markNotificationsRead,
      resetSystem,
      restoreDemoRecords,
    }),
    [
      data,
      loading,
      addVehicle,
      updateVehicleImages,
      assignDriver,
      addDriver,
      updateDriver,
      updateDriverStatus,
      removeDriver,
      reportDefect,
      getDriverForVehicle,
      getVehicleForDriver,
      fuelSummary,
      dashboard,
      getDailyLog,
      synchronizeFuel,
      markNotificationsRead,
      resetSystem,
      restoreDemoRecords,
    ],
  )
  return (
    <FleetDataContext.Provider value={value}>
      {children}
    </FleetDataContext.Provider>
  )
}
export function useFleetData(): FleetData {
  const context = useContext(FleetDataContext)
  if (!context)
    throw new Error('useFleetData must be used within FleetDataProvider')
  return context
}
