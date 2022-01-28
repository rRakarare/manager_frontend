import React, { useRef, useEffect, useState } from "react";
import TestChart from "../components/Forecast/charts/TestChart";
import { Grid, Segment, Statistic, Button, Dropdown } from "semantic-ui-react";
import RadChart from "../components/Forecast/charts/RadChart";
import axiosInstance from "../axios/axios";
import ExcelExport from "../components/Forecast/excelexport/ExcelExport";
import ExcelCosts from "../components/Forecast/excelexport/ExcelCosts";
import svgDownload from "../components/Forecast/svgDownload.js";

const reducer = (accumulator, currentValue) => accumulator + currentValue;

function ForecastScreen() {
  const radRef = useRef(null);
  const foreCastRef = useRef(null);

  const [graphWidth, setGraphWidth] = useState(0);
  const [charges, setCharges] = useState([]);
  const [sumOfCharges, setSumOfCharges] = useState(0);
  const [balance, setBalance] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [income, setIncome] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [status, setStatus] = useState([]);
  const [forecastStatus, setForecastStatus] = useState([]);
  const [types, setTypes] = useState([]);
  const [projects, setProjects] = useState([]);

  const queryInvoices = async () => {
    try {
      const invs = await axiosInstance.get("invoicesall/");

      const projects = await axiosInstance.get("projects/");

      const types = await axiosInstance.get("types");

      const invoices = invs.data.map((invoice) => ({
        ...invoice,
        project: projects.data.find(
          (project) => project.id === invoice.project
        ),
      }));

      setInvoices(invoices);
      setProjects(projects.data);



      setTypes(
        types.data.map((type) => {
          let value = 0;
          let counts = 0;

          invoices.forEach((inv) => {
            if (inv.project.project_type === type.id) {
              value += parseFloat(inv.amount);
            }
          });

          projects.data.forEach((project) => {
            if (project.project_type === type.id) {
              counts += 1;
            }
          });

          return {
            ...type,
            counts,
            value,
          };
        })
      );
    } catch (err) {
      console.log(err.response);
    }
  };

  const getStatus = async () => {
    try {
      const res = await axiosInstance.get("status");
      const projects = await axiosInstance.get("projects/");

      setStatus(
        res.data.map((item) => {
          let counts = 0;
          projects.data.forEach((project) => {
            if (project.status.id === item.id) {
              counts += 1;
            }
          });
          return {
            key: item.id,
            value: item.id,
            text: item.name + ` (${counts})`,
          };
        })
      );
      setForecastStatus(res.data.map((item) => item.id));
    } catch (err) {
      return err.message;
    }
  };

  const queryCharges = async () => {
    try {
      const res = await axiosInstance.get("forecast/charges");
      setCharges(res.data);
      setSumOfCharges(
        res.data
          .map((item) => parseFloat(item.amount_per_month))
          .reduce(reducer)
      );
    } catch (err) {
      console.log(err.response);
    }
  };

  const queryBalance = async () => {
    try {
      const res = await axiosInstance.get("forecast/balance");
      setBalance(res.data[0]);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    setIncome(
      invoices
        .filter((item) => {
          return new Date(item.date_of_payment) >= new Date(balance.date);
        })
        .map((item) => ({
          ...item,
          amount: parseFloat(item.amount),
          date_of_payment: new Date(item.date_of_payment),
        }))
    );
  }, [balance, invoices]);

  useEffect(() => {
    const projectstatusfilter = forecastStatus;

    if (income.length !== 0) {
      const data = new Array(12).fill().map((item, i) => {
        const date = new Date(balance.date && balance.date.substring(0, 7));
        date.setMonth(date.getMonth() + i);

        const monthlyIncome = income.filter(
          (item) =>
            new Date(item.date_of_payment).getMonth() === date.getMonth() &&
            new Date(item.date_of_payment).getFullYear() === date.getFullYear() &&
            projectstatusfilter.includes(item.project.status.order)
        );

        return {
          date: date.toLocaleDateString("de-DE", {
            year: "2-digit",
            month: "short",
          }),
          income:
            monthlyIncome.length !== 0
              ? monthlyIncome.map((item) => item.amount).reduce(reducer)
              : 0,
          costs: sumOfCharges,
          invoices: monthlyIncome.length !== 0 ? monthlyIncome : [],
        };
      });

      let returndata = [];

      data.forEach((item, i, arr) => {
        let newbal = 0;

        if (i === 0) {
          newbal = parseFloat(balance.amount);
        } else {
          newbal = returndata[i - 1].balance - arr[i].costs + arr[i].income;
        }

        returndata[i] = {
          ...item,
          balance: newbal,
        };
      });



      setTypes((data) => {
        return data.map((type) => {
          return {
            ...type,
          };
        });
      });

      setIncomeData(returndata);
    }
  }, [income, forecastStatus, charges, balance]);

  useEffect(() => {
    const newInvs = invoices.filter((item) =>{
      return forecastStatus.includes(item.project.status.id)}
    );

    const newProjs = projects.filter((item) =>{
      return forecastStatus.includes(item.status.id)}
    );


    setTypes((types) => {
      return types.map((type) => {
        let value = 0;
        let counts = 0;
        

        newInvs.forEach((inv) => {
          if (inv.project.project_type === type.id) {
            value += parseFloat(inv.amount);
          }
        });

        newProjs.forEach((project) => {
          if (project.project_type === type.id) {
            counts += 1;
          }
        });
        return {
          ...type,
          value,
          counts,
        };
      });
    });
  }, [forecastStatus, invoices, projects]);

  useEffect(() => {
    console.log("types",types)
  }, [types])

  useEffect(() => {
    queryCharges();
    queryBalance();
    queryInvoices();
    getStatus();
  }, []);



  useEffect(() => {
    setGraphWidth(radRef.current.clientWidth);

    const handleResize = () => {
      setGraphWidth(radRef.current.clientWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const SegmentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const Types = types.map((item) => (
    <Segment key={item.id} style={SegmentStyle}>
      <Statistic size="tiny">
        <Statistic.Value>
          {item.value.toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          })}
        </Statistic.Value>
        <Statistic.Label>{`${item.name} (${item.counts})`}</Statistic.Label>
      </Statistic>
    </Segment>
  ));

  return (
    <Grid stackable columns={2}>
      <Grid.Row stretched>
        <Grid.Column width={11}>
          <Segment style={{ height: "400px" }}>
            <TestChart data={incomeData} ref={foreCastRef} />
          </Segment>
        </Grid.Column>

        <Grid.Column width={5}>
          <Segment style={SegmentStyle}>
            <Dropdown
              placeholder="Skills"
              value={forecastStatus}
              fluid
              multiple
              selection
              options={status}
              onChange={(e, { value }) => setForecastStatus(value)}
            />
          </Segment>
          <Segment style={SegmentStyle}>
            <ExcelExport data={incomeData} />
          </Segment>
          <Segment style={SegmentStyle}>
            <ExcelCosts data={charges} />
          </Segment>
          <Segment style={SegmentStyle}>
            <Button
              onClick={() =>
                svgDownload(foreCastRef.current.current, "Forecast")
              }
              icon="area graph"
              label="Graph"
            />
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row stretched>
        <Grid.Column width={6}>
          <div ref={radRef}>
            <Segment style={{ padding: 0 }}>
              <RadChart
                data={charges}
                graphwidth={graphWidth}
                graphheight={370}
              />
            </Segment>
          </div>
        </Grid.Column>
        <Grid.Column width={5}>
          <Segment style={SegmentStyle}>
            <Statistic size="tiny">
              <Statistic.Value>
                {parseFloat(balance.amount).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                })}
              </Statistic.Value>
              <Statistic.Label>
                {new Date(balance.date).toLocaleDateString("de-DE", {
                  year: "2-digit",
                  month: "long",
                })}
              </Statistic.Label>
            </Statistic>
          </Segment>
          <Segment style={SegmentStyle}>
            <Statistic
              size="tiny"
              color={
                incomeData.length !== 0 &&
                parseFloat(incomeData[6].balance - balance.amount) >= 0
                  ? "green"
                  : "red"
              }
            >
              <Statistic.Value>
                {incomeData.length !== 0 &&
                  parseFloat(
                    incomeData[6].balance - balance.amount
                  ).toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  })}
              </Statistic.Value>
              <Statistic.Label>∆ 6 Monate</Statistic.Label>
            </Statistic>
          </Segment>
          <Segment style={SegmentStyle}>
            <Statistic
              size="tiny"
              color={
                incomeData.length !== 0 &&
                parseFloat(incomeData[11].balance - balance.amount) >= 0
                  ? "green"
                  : "red"
              }
            >
              <Statistic.Value>
                {incomeData.length !== 0 &&
                  parseFloat(
                    incomeData[11].balance - balance.amount
                  ).toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  })}
              </Statistic.Value>
              <Statistic.Label>∆ 12 Monate</Statistic.Label>
            </Statistic>
          </Segment>
        </Grid.Column>
        <Grid.Column width={5}>{Types}</Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default ForecastScreen;
