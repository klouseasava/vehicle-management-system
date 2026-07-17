// src/constants.ts

/**
 * Vihiga County Government - Fleet Management System Constants
 * Centralized configurations for branding, routing, menus, and visual elements.
 */

export const APP_CONFIG = {
  APP_TITLE: 'VFMS',
  ORGANIZATION_NAME: 'Vihiga County Government',
  DEPARTMENT_NAME: 'Vihiga County Fleet & Logistics Division',
  LOGO_ALT_TEXT: 'Vihiga County Official Coat of Arms',
};

/**
 * Official Theme Color Palette Mapping (Matching CSS Variables)
 */
export const THEME_COLORS = {
  PRIMARY_FOREST: '#1a4329', // Deep official county green
  GOLD: '#da9100',           // Vibrant gold representing county heritage
  CLAY: '#a0401d',           // Rich brick clay accent
  PAPER_BACKGROUND: '#f9f8f3', // Off-white luxury layout canvas
  SURFACE: '#ffffff',
  BORDER: '#dfd8c7',
};

/**
 * Sidebar Navigation Architecture
 * Maps exact route keys to labels, active icons, and paths.
 * "Add Vehicle" has been officially replaced with "Reports".
 * "Fuel & Energy" has been renamed to "Fuel & Work Tickets".
 */
export interface NavigationItem {
  key: string;
  label: string;
  path: string;
  description: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    description: 'Fleet Overview and Interactive Action Cards',
  },
  {
    key: 'tracking',
    label: 'Vehicle Tracking',
    path: '/tracking',
    description: 'Real-time GPS mapping and geographical telemetry',
  },
  {
    key: 'fleet',
    label: 'Manage Fleet Assets',
    path: '/fleet',
    description: 'Inventory control of county vehicles and machinery',
  },
  {
    key: 'drivers',
    label: 'Manage Drivers',
    path: '/drivers',
    description: 'Driver profiles, license records, and shift schedules',
  },
  {
    key: 'reports', // Replaced "Add Vehicle"
    label: 'Reports',
    path: '/reports',
    description: 'Generate detailed activity log summaries for drivers and vehicles',
  },
  {
    key: 'maintenance',
    label: 'Service & Maintenance',
    path: '/maintenance',
    description: 'Schedules, service records, and defect management',
  },
  {
    key: 'fuel', // Replaced "Fuel & Energy"
    label: 'Fuel & Work Tickets',
    path: '/fuel',
    description: 'Fuel consumption auditing and digital work ticket workflow',
  },
  {
    key: 'profile',
    label: 'Profile',
    path: '/profile',
    description: 'Manage administrator account details and preferences',
  },
];

/**
 * Dashboard Action Card Options
 * Configures actions and routes dynamically when interacting with the main dashboard panels.
 */
export interface AnalysisOption {
  id: string;
  label: string;
  targetPath: string;
}

export const ANALYSIS_CARDS_CONFIG = {
  report: {
    title: 'Find Report',
    description: 'Generate performance, diagnostic, or activity sheets instantly.',
    options: [
      { id: 'driver_perf_report', label: 'Driver Activity Report', targetPath: '/reports' },
      { id: 'vehicle_spec_report', label: 'Vehicle Performance Report', targetPath: '/reports' },
      { id: 'maintenance_log_report', label: 'Maintenance Summary Ledger', targetPath: '/reports' },
    ] as AnalysisOption[],
  },
  tickets: {
    title: 'Work Tickets Approval',
    description: 'Approve, reject, or audit digital driver task tickets.',
    options: [
      { id: 'pending_tickets', label: 'Review Pending Tickets', targetPath: '/fuel' },
      { id: 'approved_history', label: 'View Approved Ledgers', targetPath: '/fuel' },
    ] as AnalysisOption[],
  },
  fuel: {
    title: 'Fuel Consumption',
    description: 'Audit efficient refueling histories and fuel-to-kilometers indicators.',
    options: [
      { id: 'fuel_logbook', label: 'Open Fuel Logbook', targetPath: '/fuel' },
      { id: 'heavy_machinery_fuel', label: 'Review Heavy Machinery Usage', targetPath: '/fuel' },
    ] as AnalysisOption[],
  },
};