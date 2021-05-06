import React, { useState, useEffect } from "react";
import { Grid, Segment, Statistic, Step, Icon } from "semantic-ui-react";
import axiosInstance from "../axios/axios";

function ProjectDetail({ match }) {
  const projectID = match.params.id;
  const [data, setData] = useState({});

  const SegmentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const getProjectData = async () => {
    try {
      const res = await axiosInstance.get(`projects/${projectID}`);
      setData(res.data);
    } catch (err) {
      return err.message;
    }
  };

  useEffect(() => {
    getProjectData();
  }, []);

  return (
    <Grid style={{ margin: "2rem" }} columns={3}>
      <Grid.Row stretched>
        <Grid.Column width={2}></Grid.Column>
        <Grid.Column width={11}>{data.title}</Grid.Column>
        <Grid.Column width={3}>
          <Step.Group fluid vertical>
            <Step>
              <Icon name="signup" />
              <Step.Content>
                <Step.Title>Angebot</Step.Title>
                <Step.Description>Angebot an Kunden</Step.Description>
              </Step.Content>
            </Step>

            <Step>
              <Icon name="play" />
              <Step.Content>
                <Step.Title>Bearbeitung</Step.Title>
                <Step.Description>Projekt in Bearbeitung</Step.Description>
              </Step.Content>
            </Step>

            <Step>
              <Icon name="euro" />
              <Step.Content>
                <Step.Title>Rechnung</Step.Title>
                <Step.Description>Letzte Rechnung gestellt.</Step.Description>
              </Step.Content>
            </Step>

            <Step active>
              <Icon name="flag checkered" />
              <Step.Content>
                <Step.Title>Abschluss</Step.Title>
                <Step.Description>Projekt abgeschlossen</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default ProjectDetail;
