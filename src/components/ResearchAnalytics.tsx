"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  DashboardAnalytics,
  MeasurementDistribution,
} from "@/lib/dashboard-analytics";

const axisColor = "#768198";
const gridColor = "rgba(255,255,255,0.07)";
const tooltipStyle = {
  backgroundColor: "#111522",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  color: "#f8fafc",
  fontSize: 12,
};
const chartColors = ["#a78bfa", "#55b5c8", "#d08a68", "#82b99a", "#d1a85d"];

function ChartPanel({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`analytics-panel ${className}`}>
      <div className="analytics-panel-heading">
        <div>
          <p className="analytics-eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
      </div>
      <p className="analytics-description">{description}</p>
      {children}
    </article>
  );
}

function DistributionChart({
  distribution,
  title,
  description,
}: {
  distribution: MeasurementDistribution;
  title: string;
  description: string;
}) {
  return (
    <ChartPanel eyebrow="FLEX · PSI-69" title={title} description={description}>
      {distribution.bins.length === 0 ? (
        <p className="analytics-empty">No values are available for this field.</p>
      ) : (
        <div
          className="analytics-chart"
          role="img"
          aria-label={`${title} histogram. ${distribution.recorded} values recorded, ${distribution.missing} missing.`}
        >
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={distribution.bins}
              margin={{ top: 8, right: 4, left: -20, bottom: 30 }}
              accessibilityLayer
            >
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: axisColor, fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                angle={-30}
                textAnchor="end"
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: axisColor, fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value} records`, "Count"]}
                labelFormatter={(label) => `${label} ${distribution.unit}`}
              />
              <Bar
                dataKey="count"
                name="Records"
                fill="#a78bfa"
                radius={[4, 4, 0, 0]}
                maxBarSize={34}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="analytics-footnote">
        {distribution.recorded.toLocaleString()} values present ·{" "}
        {distribution.missing.toLocaleString()} rows without a numeric value ·
        {" "}X: {distribution.unit} · Y: row count
      </p>
    </ChartPanel>
  );
}

function DonutChart({
  data,
  total,
  colors,
  label,
  ariaLabel,
}: {
  data: { label: string; count: number }[];
  total: number;
  colors: string[];
  label: string;
  ariaLabel: string;
}) {
  return (
    <div className="analytics-donut-layout">
      <div className="analytics-donut">
        <div className="analytics-chart" role="img" aria-label={ariaLabel}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart accessibilityLayer>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                innerRadius="62%"
                outerRadius="84%"
                paddingAngle={3}
                stroke="none"
              >
                {data.map((item, index) => (
                  <Cell
                    key={item.label}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value} records`, "Count"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="analytics-donut-center" aria-hidden="true">
          <strong>{total.toLocaleString()}</strong>
          <span>{label}</span>
        </div>
      </div>
      <ul className="analytics-donut-legend" aria-label={`${label} categories`}>
        {data.map((item, index) => (
          <li key={item.label}>
            <span
              style={{ backgroundColor: colors[index % colors.length] }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
            <strong>{item.count.toLocaleString()}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResearchAnalytics({
  analytics,
}: {
  analytics: DashboardAnalytics;
}) {
  return (
    <section className="dashboard-section" id="analytics">
      <div className="dashboard-section-heading">
        <div>
          <p className="section-kicker">Measured data · descriptive only</p>
          <h2>Research analytics</h2>
        </div>
        <p>
          Distributions describe the integrated tables. They do not establish
          causes or predict outcomes beyond the recorded conditions.
        </p>
      </div>

      <div className="analytics-grid">
        <ChartPanel
          eyebrow="FLEX · PSI-69"
          title="Fuel representation"
          description="Share of rows by the fuel label recorded in the integrated FLEX table."
        >
          <DonutChart
            data={analytics.flex.fuels}
            total={analytics.flex.rows}
            colors={chartColors}
            label="table rows"
            ariaLabel={`FLEX fuel representation across ${analytics.flex.rows} table rows`}
          />
          <p className="analytics-footnote">
            Each slice is a recorded fuel label; values are row counts, not
            normalized percentages.
          </p>
        </ChartPanel>

        <ChartPanel
          eyebrow="Indexed source passages"
          title="Evidence coverage"
          description="Source passages indexed for each integrated investigation. A passage is not an experiment run, file, or sample."
        >
          <div
            className="analytics-chart"
            role="img"
            aria-label={`Indexed evidence passages, ${analytics.evidence.totalPassages} total`}
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={analytics.evidence.byExperiment}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
                accessibilityLayer
              >
                <CartesianGrid stroke={gridColor} horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: axisColor, fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={72}
                  tick={{ fill: axisColor, fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value} passages`, "Indexed"]}
                />
                <Bar
                  dataKey="count"
                  name="Indexed passages"
                  fill="#8b78d6"
                  radius={[0, 5, 5, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="analytics-footnote">
            X: indexed passages · {analytics.evidence.totalPassages.toLocaleString()} total across{" "}
            {analytics.evidence.pdfFiles} PDFs, {analytics.evidence.zipArchives}{" "}
            ZIP archives, and {analytics.evidence.textFiles} text files.
          </p>
        </ChartPanel>

        <DistributionChart
          distribution={analytics.flex.dropletDiameter}
          title="Initial droplet diameter"
          description="Measured starting diameters; missing values are excluded from bins."
        />
        <DistributionChart
          distribution={analytics.flex.burningRate}
          title="Burning rate"
          description="Recorded numeric values from the FLEX burning-rate field."
        />

        <ChartPanel
          eyebrow="FLEX · PSI-69"
          title="Recorded test-end labels"
          description="Recorded outcome categories shown without assigning additional physical interpretation."
        >
          {analytics.flex.outcomes.length === 0 ? (
            <p className="analytics-empty">No test-end labels are available.</p>
          ) : (
            <DonutChart
              data={analytics.flex.outcomes}
              total={analytics.flex.rows}
              colors={["#a78bfa", "#55b5c8", "#d08a68"]}
              label="table rows"
              ariaLabel="FLEX recorded test-end label distribution"
            />
          )}
          <p className="analytics-footnote">
            Recorded test-end categories · {analytics.flex.rows.toLocaleString()} table rows.
          </p>
        </ChartPanel>

        <ChartPanel
          eyebrow="BASS-II · PSI-25"
          title="Material labels in the integrated table"
          description={`Top recorded material descriptions from ${analytics.bass.rows.toLocaleString()} rows. The display groups only exact labels after whitespace cleanup.`}
        >
          {analytics.bass.materials.length === 0 ? (
            <p className="analytics-empty">No material labels are available.</p>
          ) : (
            <div
              className="analytics-chart"
              role="img"
              aria-label={`Most frequent BASS-II material labels, among ${analytics.bass.distinctMaterialLabels} distinct labels`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.bass.materials}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 18, bottom: 4 }}
                  accessibilityLayer
                >
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: axisColor, fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={118}
                    tick={{ fill: axisColor, fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} rows`, "Count"]}
                  />
                  <Bar
                    dataKey="count"
                    name="Rows"
                    fill="#55b5c8"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="analytics-footnote">
            X: table rows · Y: material descriptions.{" "}
            {analytics.bass.distinctMaterialLabels} distinct descriptions are
            represented; no absent FLEX/SAFFIRE material values are implied.
          </p>
        </ChartPanel>
      </div>
    </section>
  );
}
