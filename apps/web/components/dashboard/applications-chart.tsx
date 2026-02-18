'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@hackhyre/ui/components/chart'
import { Chart } from '@hackhyre/ui/icons'

const chartConfig = {
  applications: {
    label: 'Applications',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

interface ApplicationsChartProps {
  data: { date: string; applications: number }[]
}

export function ApplicationsChart({ data }: ApplicationsChartProps) {
  const hasData = data.some((d) => d.applications > 0)

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Applications This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Chart
              size={32}
              variant="Linear"
              className="text-muted-foreground/30 mb-2"
            />
            <p className="text-muted-foreground text-[13px]">
              No applications received this week
            </p>
            <p className="text-muted-foreground/60 mt-1 text-[12px]">
              Data will appear here as candidates apply to your jobs
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Applications This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillApplications" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              className="text-muted-foreground text-xs"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              className="text-muted-foreground text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#fillApplications)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
