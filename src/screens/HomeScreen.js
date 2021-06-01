import React, { useState, useEffect } from "react";
import { Grid, Segment, Statistic, Modal } from "semantic-ui-react";
import Table from "../components/Table";
import axiosInstance from "../axios/axios";
import CreateProject from '../components/CreateProject'
import { useAppStore } from "../app.state";

function HomeScreen() {
  const [projectModalOpen,setProjectModalOpen] = useAppStore(state => [state.projectModalOpen,state.setProjectModalOpen])
  const [isLoading, setIsLoading] = useState({
    dataLoaded: true,
    statusLoaded: true,
  });
  const [data, setData] = useState([]);
  const [status, setStatus] = useState([]);

  const getStatus = async () => {
    try {
      const res = await axiosInstance.get("status");
      setStatus(res.data);
      setIsLoading((prevState) => {
        return {
          ...prevState,
          dataLoaded: false,
        };
      });
    } catch (err) {
      return err.message;
    }
  };

  const getProjektData = async () => {
    try {
      const res = await axiosInstance.get("projects/");
      setData(res.data);
      setIsLoading((prevState) => {
        return {
          ...prevState,
          statusLoaded: false,
        };
      });
    } catch (err) {
      return err.message;
    }
  };

  useEffect(() => {
    getProjektData();
    getStatus();
  }, [projectModalOpen]);

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
          <Table data={data} isLoading={isLoading} status={status} />
        </Grid.Column>
        <Grid.Column width={3}>
          <Segment
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Statistic size="small">
              <Statistic.Value>22</Statistic.Value>
              <Statistic.Label>Aktive Projekte</Statistic.Label>
            </Statistic>
          </Segment>
          <Segment style={SegmentStyle}>
            <Statistic size="small">
              <Statistic.Value>22.000 €</Statistic.Value>
              <Statistic.Label>Auftragssumme</Statistic.Label>
            </Statistic>
          </Segment>
          <Segment style={SegmentStyle}>
            <Statistic size="small">
              <Statistic.Value>3</Statistic.Value>
              <Statistic.Label>Projekte in Aussicht</Statistic.Label>
            </Statistic>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    <Modal open={projectModalOpen}>
    <CreateProject/>
    </Modal>
    </>
  );
}

export default HomeScreen;
