// RepairTrendsChart.tsx — stacked bar chart of defect urgency over recent months (recharts).

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
interface Row {
  month: string
  critical: number
  high: number
  medium: number
}
export function RepairTrendsChart({ data }: { data: Row[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 8,
          right: 8,
          left: -12,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e3dccb"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{
            fill: '#55584d',
            fontSize: 12,
          }}
          axisLine={{
            stroke: '#e3dccb',
          }}
          tickLine={false}
        />
        <YAxis
          tick={{
            fill: '#55584d',
            fontSize: 12,
          }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: '1px solid #e3dccb',
            boxShadow: 'var(--vfms-shadow)',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
          }}
          cursor={{
            fill: 'rgba(138,59,30,0.06)',
          }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{
            fontSize: 12,
            paddingTop: 8,
          }}
        />
        <Bar
          dataKey="critical"
          name="Critical"
          stackId="a"
          fill="#c62828"
          radius={[0, 0, 0, 0]}
        />
        <Bar dataKey="high" name="High" stackId="a" fill="#e0a83b" />
        <Bar
          dataKey="medium"
          name="Medium"
          stackId="a"
          fill="#2f5a3f"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
