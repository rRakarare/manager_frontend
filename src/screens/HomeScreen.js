import React, { useState, useEffect } from "react";
import { Grid, Segment, Statistic, Modal } from "semantic-ui-react";
import Table from "../components/Table";
import axiosInstance from "../axios/axios";
import CreateProject from "../components/CreateProject";
import { useAppStore } from "../app.state";
var _ = require("lodash");

function HomeScreen() {
  const [projectModalOpen, setProjectModalOpen] = useAppStore((state) => [
    state.projectModalOpen,
    state.setProjectModalOpen,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [allInvoices, setAllInvoices] = useAppStore((state) => [
    state.allInvoices,
    state.setAllInvoices,
  ]);
  const [rerender, setRerender] = useState(0);
  const [activeProjects, setActiveProjects] = useState(undefined);
  const [activeSum, setActiveSum] = useState(undefined);
  const [futureProjects, setFutureProjects] = useState(undefined);
  const [futureSum, setFutureSum] = useState(undefined);

  const rerenderfunc = () => {
    setRerender((inital) => inital + 1);
  };

  const getStatus = async () => {
    try {
      const res = await axiosInstance.get("status");
      setStatus(res.data);
    } catch (err) {
      return err.message;
    }
  };

  const createProjectData = async () => {
    try {
      const projectdata = await axiosInstance.get("projects/");
      const invoices = await axiosInstance.get("/invoicesall/");
      const newdata = projectdata.data.map((item) => {
        const projectinvoices = invoices.data.filter(
          (invoice) => invoice.project === item.id
        );
        const amounts = projectinvoices.map((pinv) => parseFloat(pinv.amount));

        return {
          ...item,
          honorar: _.sum(amounts),
        };
      });
      setData(newdata);
      console.log(newdata);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (data && status) {
      setIsLoading(false);
      calcDetails();
    }
  }, [data, status]);

  const calcDetails = () => {
    const active_projects = data.filter(
      (item) => item.status.order != 1 && item.status.order != 5
    );

    setActiveProjects(active_projects.length);
    setActiveSum(_.sum(active_projects.map((item) => item.honorar)));

    const future_projects = data.filter((item) => item.status.order == 1);

    setFutureProjects(future_projects.length);
    setFutureSum(_.sum(future_projects.map((item) => item.honorar)));
  };

  useEffect(() => {
    createProjectData();
    getStatus();
  }, [projectModalOpen, rerender]);

  const SegmentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <>
      <Grid stackable columns={3}>
        <Grid.Row stretched>
          <Grid.Column width={13}>
            <Table
              data={data}
              isLoading={isLoading}
              status={status}
              rerenderfunc={rerenderfunc}
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <Segment loading={activeProjects == undefined} style={SegmentStyle}>
              <Statistic size="small">
                <Statistic.Value>{activeProjects}</Statistic.Value>
                <Statistic.Label>Aktive Projekte</Statistic.Label>
              </Statistic>
            </Segment>
            <Segment loading={activeSum == undefined} style={SegmentStyle}>
              <Statistic size="small">
                <Statistic.Value>
                  {activeSum && activeSum.toLocaleString("de") + " €"}
                </Statistic.Value>
                <Statistic.Label>Auftragssumme</Statistic.Label>
              </Statistic>
            </Segment>
            <Segment loading={futureProjects == undefined} style={SegmentStyle}>
              <Statistic size="small">
                <Statistic.Value>{futureProjects}</Statistic.Value>
                <Statistic.Label>Projekte in Aussicht</Statistic.Label>
              </Statistic>
            </Segment>
            <Segment loading={futureSum == undefined} style={SegmentStyle}>
              <Statistic size="small">
                <Statistic.Value>
                  {futureSum && futureSum.toLocaleString("de") + " €"}
                </Statistic.Value>
                <Statistic.Label>Honorar in Aussicht</Statistic.Label>
              </Statistic>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Modal open={projectModalOpen}>
        <CreateProject />
      </Modal>
    </>
  );
}

export default HomeScreen;
