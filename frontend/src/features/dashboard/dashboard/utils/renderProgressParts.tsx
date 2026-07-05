import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, PieLabelRenderProps, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useThemeStyles } from "../../../../hooks/useThemeStyles";
import { ChartSlice } from "../../../../types/types";

export default function renderProgressParts() {
    const { isDark,text } = useThemeStyles()

    const ChartPlaceholder = ({ message, textClass }: { message: string; textClass: string }) => (
        <div className={`flex h-[300px] items-center justify-center text-sm ${textClass}`}>
          {message}
        </div>
      );
      

    const chart = {
        grid: isDark ? '#334155' : '#e2e8f0',
        tick: isDark ? '#94a3b8' : '#64748b',
        tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: isDark ? '1px solid #334155' : 'none',
            borderRadius: '8px',
            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            color: isDark ? '#f1f5f9' : '#0f172a',
        },
        legend: { fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' },
        cursor: isDark ? '#334155' : '#f8fafc',
        pieLabel: isDark ? '#e2e8f0' : '#334155',
    };

    const renderPieLabel = ({ name, percent, cx, cy, midAngle, outerRadius }: PieLabelRenderProps) => {
        const RADIAN = Math.PI / 180;
        const radius = (Number(outerRadius) || 0) * 1.15;
        const angle = Number(midAngle) || 0;
        const x = Number(cx) + radius * Math.cos(-angle * RADIAN);
        const y = Number(cy) + radius * Math.sin(-angle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill={chart.pieLabel}
                textAnchor={x > Number(cx) ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
            >
                {`${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
            </text>
        );
    };

    const renderBarChart = (data: ChartSlice[]) => (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chart.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chart.tick, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: chart.tick, fontSize: 12 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: chart.cursor }} contentStyle={chart.tooltip} />
                <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]} barSize={36}>
                    {data.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    const renderPieChart = (data: ChartSlice[], loading: boolean, emptyMessage: string) => {
        if (loading) {
            return <ChartPlaceholder message="Loading…" textClass={text.secondary} />;
        }
        if (!data.length) {
            return <ChartPlaceholder message={emptyMessage} textClass={text.secondary} />;
        }

        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={renderPieLabel}
                        labelLine={{ stroke: chart.pieLabel }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={chart.tooltip} />
                </PieChart>
            </ResponsiveContainer>
        );
    };
    return { chart,ChartPlaceholder,renderPieLabel,renderBarChart,renderPieChart}
}