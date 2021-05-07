import React, { useState, useEffect } from "react";
import {
  Grid,
  Segment,
  Statistic,
  Step,
  Icon,
  Loader,
} from "semantic-ui-react";
import axiosInstance from "../axios/axios";

function ProjectDetail({ match }) {
  const projectID = match.params.id;
  const [data, setData] = useState({});
  const [status, setStatus] = useState([]);

  const getProjectData = async () => {
    try {
      const res = await axiosInstance.get(`projects/${projectID}/`);
      setData(res.data);
    } catch (err) {
      return err.message;
    }
  };

  const getStatus = async () => {
    try {
      const res = await axiosInstance.get("status");
      setStatus(res.data);
    } catch (err) {
      return err.message;
    }
  };

  useEffect(() => {
    getProjectData();
    getStatus();
  }, []);

  useEffect(() => {
    console.log(data);
    console.log(data.status ? data.status.id : "yolo");
  }, [status, data]);

  const setNewStatus = async (id) => {
    try {
      const res = await axiosInstance.put(`projects/${projectID}/`, {
        status: id,
        title: data.title,
      });
      setData(res.data)
    } catch (err) {
      console.log(err.response);
      return err.message;
    }
  };

  const ryout = async (asd) => {
    console.log(asd);
  };

  const Steps = status.map((item) =>
    data.status ? (
      <Step
        key={item.id}
        completed={data.status >= item.order}
        active={data.status + 1 == item.order}
        onClick={() => setNewStatus(item.order)}
      >
        <Icon name={item.icontext} />
        <Step.Content>
          <Step.Title>{item.name}</Step.Title>
          <Step.Description>{item.subtext}</Step.Description>
        </Step.Content>
      </Step>
    ) : null
  );

  return (
    <Grid style={{ margin: "2rem" }} columns={3}>
      <Grid.Row stretched>
        <Grid.Column width={2}></Grid.Column>
        <Grid.Column width={11}>{data.title}</Grid.Column>
        <Grid.Column width={3}>
          <Step.Group fluid vertical>
            {Steps}
          </Step.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default ProjectDetail;
