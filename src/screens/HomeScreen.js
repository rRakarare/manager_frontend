import React, { useState, useEffect } from "react";
import { Grid, Segment, Statistic, Modal } from "semantic-ui-react";
import Table from "../components/Projects/Table";
import axiosInstance from "../axios/axios";
import CreateProject from "../components/Projects/CreateProject";
import { useAppStore } from "../app.state";
var _ = require("lodash");

function HomeScreen() {
  const projectModalOpen = useAppStore((state) => state.projectModalOpen);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(undefined);
  const [status, setStatus] = useState(undefined);

  const [rerender, setRerender] = useState(0);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, status]);



  useEffect(() => {
    createProjectData();
    getStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectModalOpen, rerender]);


  return (
    <>
      <Grid stackable columns={3}>
        <Grid.Row stretched>
          <Grid.Column width={16}>
            <Table
              data={data}
              isLoading={isLoading}
              status={status}
              rerenderfunc={rerenderfunc}
            />
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
