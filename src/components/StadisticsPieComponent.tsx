import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart.tsx";

interface StadisticsPieComponentProps {
  title: string;
  subtitle: string;
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  labelPassed: string;
  footerText?: string;
  subFooterText?: string;
}

export default function StadisticsPieComponent({
  title,
  subtitle,
  data,
  labelPassed,
  footerText,
  subFooterText,
}: StadisticsPieComponentProps) {
  const chartConfig: ChartConfig = {
    labelPassed: {
      label: labelPassed,
    },
    ...Object.fromEntries(
      data.map((item) => [item.name, { label: item.name, color: item.color }])
    ),
  } satisfies ChartConfig;
  return (
    <Card className="flex flex-col bg-white dark:bg-gray-800">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full">
        <div className="flex flex-col gap-2 mb-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-bold">
                {item.name.toUpperCase()} : {item.value}
              </span>
            </div>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[600px] max-h-[500px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              labelLine={false}
              label={({ payload, ...props }) => {
                const total = data.reduce((acc, item) => acc + item.value, 0);
                const percentage = ((payload.value / total) * 100).toFixed(2);
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill={payload.color}
                    className="text-[15px] font-bold"
                  >
                    {percentage}%
                  </text>
                );
              }}
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {footerText} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {subFooterText}
        </div>
      </CardFooter>
    </Card>
  );
}
