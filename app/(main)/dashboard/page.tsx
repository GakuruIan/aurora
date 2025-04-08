"use client";
import React from "react";

// tanstack
import { useQuery } from "@tanstack/react-query";

// axios
import axios from "axios";

// icons
import {
  MailOpen,
  Mail,
  Sparkles,
  ShieldAlert,
  CircleCheckBig,
  CloudAlert,
} from "lucide-react";

// recharts
import { CartesianGrid, Line, LineChart, XAxis, Pie, PieChart } from "recharts";

// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

// dummy data
import { chartData } from "@/data/data";
import Upcomingtasks from "@/components/UpcomingTasks/Upcomingtasks";

const Page = () => {
  const {
    data: summary,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["summary"],
    queryFn: async () =>
      await axios.get("/api/summary").then((res) => res.data),
  });

  const CARDS = [1, 2, 3];

  const chartConfig = {
    desktop: {
      label: "needsAction",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "completed",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const PieConfig = {
    completed: {
      label: "completed",
      color: "hsl(var(--chart-2))",
    },
    needsAction: {
      label: "needsAction",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  // loading screen
  if (isLoading) {
    return (
      <div className="">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {CARDS.map((card) => (
              <div
                key={card}
                className="h-44 dark:bg-dark-50 bg-zinc-200 rounded-md"
              ></div>
            ))}
          </div>
        </div>

        <div className="animate-pulse mt-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="col-span-full md:col-span-8 h-44 dark:bg-dark-50 bg-zinc-200 rounded-md"></div>
            <div className="col-span-full md:col-span-4 h-44 dark:bg-dark-50 bg-zinc-200 rounded-md"></div>
          </div>
        </div>

        <div className="animate-pulse mt-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="col-span-full md:col-span-4 h-44 dark:bg-dark-50 bg-zinc-200 rounded-md"></div>
            <div className="col-span-full md:col-span-8 h-44 dark:bg-dark-50 bg-zinc-200 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  // error screen
  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-center flex-col gap-y-2">
          <CloudAlert size={40} className="text-rose-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  const taskData = summary?.tasks
    ? Object.entries(summary?.tasks).map(([status, count]) => ({
        name: status,
        value: count,
        fill: status === "completed" ? "#4AD092" : "#0579F9",
      }))
    : [];

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks Summary</CardTitle>
            <CardDescription>Tasks from google tasks</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-x-4 flex-wrap gap-y-2">
              <div className="flex items-center gap-x-1">
                <CircleCheckBig size={16} />
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  completed - {summary?.tasks?.completed}
                </p>
              </div>
              <div className="flex items-center gap-x-1">
                <ShieldAlert size={16} />
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  needsAction - {summary?.tasks?.needsAction}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes Summary</CardTitle>
            <CardDescription>Notes</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm dark:text-gray-400 text-gray-500">
              Total notes {summary?.notes}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emails</CardTitle>
            <CardDescription>Email from your integrations</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-1">
                <MailOpen size={16} />
                <p className="text-sm dark:text-gray-400 text-gray-500">Read</p>
              </div>
              <div className="flex items-center gap-x-1">
                <Mail size={16} />
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  Unread - {summary?.unreadEmails}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* task analysis */}
      <div className="grid grid-cols-2 md:grid-cols-12 gap-4 my-4">
        <div className="col-span-full md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Analytics</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="max-h-52 w-full">
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    dataKey="desktop"
                    type="monotone"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="mobile"
                    type="monotone"
                    stroke="var(--color-mobile)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-full md:col-span-4 w-full">
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>
                This is a representation of your active tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={PieConfig}
                className="mx-auto aspect-square max-h-[255px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={taskData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* task analysis */}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Today's tasks */}
        <div className="">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Tasks</CardTitle>
              <CardDescription>
                This is your top tasks for the day{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Upcomingtasks tasks={summary?.todayTask} />
            </CardContent>
          </Card>
        </div>
        {/* Today's tasks */}
      </div>
    </div>
  );
};

export default Page;
