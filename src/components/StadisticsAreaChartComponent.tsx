import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface StadisticsAreaChartComponentProps {
  title: string;
  description: string;
  labelPassed: string;
  data: {
    date: string;
    [key: string]: string | number;
  }[];
  colors?: Record<string, string>;
}

function groupByDay<T extends { date: string }>(
  data: T[],
  keys: (keyof T)[]
): Array<{ date: string } & Record<string, string>> {
  const grouped: Record<string, { date: string } & Record<string, string>> = {};

  data.forEach((item) => {
    const day = new Date(item.date).toISOString().slice(0, 10);
    if (!grouped[day]) {
      grouped[day] = {
        date: day,
        ...Object.fromEntries(keys.map((key) => [key as string, 0])),
      };
    }
    keys.forEach((key) => {
      grouped[day][key as string] += Number(item[key] ?? 0);
    });
  });

  return Object.values(grouped);
}

export default function StadisticsAreaChartComponent({
  title,
  description,
  labelPassed,
  data,
  colors = {},
}: StadisticsAreaChartComponentProps) {
  const [timeRange, setTimeRange] = useState("120d");
  const areaKeys = Object.keys(data[0] ?? {}).filter((key) => key !== "date");
  const groupedData = useMemo(
    () => groupByDay(data, areaKeys),
    [data, areaKeys]
  );
  const filteredData = useMemo(() => {
    return groupedData.filter((item) => {
      const date = new Date(item.date);
      const now = new Date();
      let dayToSubtract = 7;
      switch (timeRange) {
        case "7d":
          dayToSubtract = 7;
          break;
        case "30d":
          dayToSubtract = 30;
          break;
        case "60d":
          dayToSubtract = 60;
          break;
        case "90d":
          dayToSubtract = 90;
          break;
        case "120d":
          dayToSubtract = 120;
          break;
      }
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - dayToSubtract);
      return date >= startDate;
    });
  }, [timeRange, groupedData]);
  const chartConfig: ChartConfig = {
    labelPassed: { label: labelPassed },
    ...Object.fromEntries(
      areaKeys.map((key) => [
        key,
        { label: key, color: colors[key] ?? "#8884d8" },
      ])
    ),
  };

  return (
    <Card className="pt-0 bg-white dark:bg-gray-800 flex flex-1 max-w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row flex-wrap">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="120d" className="rounded-lg">
              4 meses
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              3 meses
            </SelectItem>
            <SelectItem value="60d" className="rounded-lg">
              2 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 días
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 días
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="h-[100px] sm:h-[200px] md:h-[250px] lg:h-[350px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {areaKeys.map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopOpacity={0.8} />
                  <stop offset="95%" stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {areaKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={colors[key] ?? "#8884d8"}
                stroke={colors[key] ?? "#8884d8"}
                stackId="a"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
