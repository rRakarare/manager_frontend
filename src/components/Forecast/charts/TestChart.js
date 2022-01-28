import React, { forwardRef } from "react";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
} from "recharts";

function TestChart(props, ref) {
  const toCurrency = (item) => {
    return item.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });
  };

  const data = props.data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const invoices = payload[1].payload.invoices.map((item) => (
        <p style={{display:"flex", marginBottom: ".1rem", fontSize:".9rem"}}> <strong>{item.id}</strong>-<strong>{item.project.client.short}</strong>-<span style={{ marginRight: "1rem"}}>{item.project.title}</span> <span style={{ marginLeft: "auto" }}>{toCurrency(item.amount)}</span></p>
      ));
      return (
        <div
          style={{
            background: "rgba(245,245,245,0.8)",
            color: "black",
            padding: ".5rem",
          }}
        >
          <p style={{ display: "flex", height: "20px", marginBottom: ".2rem" }}>
            <span
              style={{
                background: "#30343F",
                width: "10px",
                height: "10px",
                verticalAlign: "middle",
                marginTop: "5px",
                marginBottom: "5px",
                marginRight: "1rem",
              }}
            ></span>
            <span style={{ marginRight: "1rem", fontWeight: "bold" }}>
              Konto:
            </span>
            <span style={{ marginLeft: "auto", fontWeight:"bold", color:"#30343F" }}>
              {toCurrency(payload[2].value)}
            </span>
          </p>
          <p style={{ display: "flex", height: "20px", marginBottom: ".2rem" }}>
            <span
              style={{
                background: "#2089C6",
                width: "10px",
                height: "10px",
                verticalAlign: "middle",
                marginTop: "5px",
                marginBottom: "5px",
                marginRight: "1rem",
              }}
            ></span>
            <span style={{ marginRight: "1rem", fontWeight: "bold" }}>
              Kosten:
            </span>{" "}
            <span style={{ marginLeft: "auto", fontWeight:"bold", color:"#2089C6" }}>
              {toCurrency(payload[0].value)}
            </span>
          </p>
          <p style={{ display: "flex", height: "20px", marginBottom: ".2rem" }}>
            <span
              style={{
                background: "#519599",
                width: "10px",
                height: "10px",
                verticalAlign: "middle",
                marginTop: "5px",
                marginBottom: "5px",
                marginRight: "1rem",
              }}
            ></span>
            <span style={{ marginRight: "1rem", fontWeight: "bold" }}>
              Einkommen:
            </span>{" "}
            <span style={{ marginLeft: "auto", fontWeight:"bold", color:"#519599" }}>
              {toCurrency(payload[1].value)}
            </span>
          </p>
          <p style={{ display: "flex", height: "20px", marginBottom: ".2rem" }}>
            {" "}
            <span style={{ fontWeight: "bold" }}>Rechnungen:</span>{" "}
          </p>{" "}
          <div> {invoices}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer ref={ref}>
      <ComposedChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 30,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
          yAxisId="left"
          orientation="left"
          stroke="#2089C6"
          tickFormatter={(item) =>
            item.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })
          }
        />
        {/* <Legend /> */}
        <Bar yAxisId="left" dataKey="costs" fill="#2089C6" too />
        <Bar yAxisId="left" dataKey="income" fill="#519599" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="balance"
          stroke="#30343F"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default forwardRef(TestChart);
