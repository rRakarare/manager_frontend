import React, { useState, useEffect } from "react";
import {
  Grid,
  Segment,
  Button,
  Statistic,
  Step,
  Icon,
  List,
  Item,
  Loader,
  Dimmer,
  Label,
  Popup,
} from "semantic-ui-react";
import axiosInstance from "../axios/axios";
import MaterialTable from "material-table";
import ProjectInvoices from '../components/ProjectInvoices'
import { useAppStore } from '../app.state'
var _ = require("lodash/core");

function ProjectDetail({ match }) {
  const projectID = match.params.id;
  const projectdata = useAppStore(state => state.projectdata)
  const setProjectdata = useAppStore(state => state.setProjectdata)

  const [status, setStatus] = useState([]);

  const getProjectData = async () => {
    try {
      const res = await axiosInstance.get(`projects/${projectID}/`);
      setProjectdata(res.data);
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



  const setNewStatus = async (id) => {
    try {
      const res = await axiosInstance.put(`projects/${projectID}/`, {
        status: id,
        title: projectdata.title,
      });
      setProjectdata(res.data);
    } catch (err) {
      console.log(err.response);
      return err.message;
    }
  };

  const Steps = status.map((item) =>
    !_.isEmpty(projectdata) ? (
      <Step
        key={item.id}
        completed={projectdata.status >= item.order}
        active={projectdata.status + 1 == item.order}
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

  const date = new Date(projectdata.created_at).toLocaleDateString("de", {
    hour: "numeric",
    minute: "numeric",
  });

  const Projekt = _.isEmpty(projectdata) ? (
    <Dimmer active inverted>
      <Loader size="medium">Loading</Loader>
    </Dimmer>
  ) : (
    <Item>
      <Item.Content>
        <Item.Header style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
          {projectdata.title}
        </Item.Header>
        <Item.Meta style={{ color: "grey", marginBottom: "1rem" }}>
          <span style={{ display: "block" }} className="cinema">
            <strong>Kunde: </strong>
            {projectdata.client.name}
          </span>
          <span style={{ display: "block" }} className="cinema">
            <strong>Erstellt: </strong>
            {date}
          </span>
        </Item.Meta>

        <Item.Extra>
          <Button
            style={{ marginBottom: ".3rem" }}
            icon="edit"
            content="Bearbeiten"
          />
          <Button
            style={{ marginBottom: ".3rem" }}
            icon="add"
            content="Rechnung"
          />
          <Button
            style={{ marginBottom: ".3rem" }}
            icon="add"
            content="Task"
          />
        </Item.Extra>
      </Item.Content>
    </Item>
  );



  return (
    <Grid stackable columns={3}>
      <Grid.Row style={{ minHeight: "343px" }} stretched>
        <Grid.Column computer={6} tablet={16}>
          <Segment>{Projekt}</Segment>
        </Grid.Column>
        <Grid.Column computer={6} tablet={16}>
          <Segment><ProjectInvoices projectID={projectID}/></Segment>
        </Grid.Column>
        <Grid.Column computer={4} tablet={16}>
          <Step.Group fluid vertical>
            {Steps}
          </Step.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default ProjectDetail;
