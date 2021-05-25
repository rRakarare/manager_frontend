import React from "react";
import { Grid, Segment, Step } from "semantic-ui-react";
import ProjectInvoices from "../components/ProjectInvoices";
import ProjectSteps from "../components/ProjectSteps";
import ProjectDetail from "../components/ProjectDetail";

function ProjectDetailScreen({ match }) {
  const projectID = match.params.id;

  return (
    <Grid stackable columns={3}> 
      <Grid.Row style={{ minHeight: "343px" }} stretched>
        <Grid.Column computer={4} tablet={16}>
          <Segment>
            <ProjectDetail projectID={projectID} />
          </Segment>
        </Grid.Column>
        <Grid.Column computer={4} tablet={16}>
          <Segment>
            <Step.Group fluid vertical>
              <ProjectSteps projectID={projectID} />
            </Step.Group>
          </Segment>
        </Grid.Column>
        <Grid.Column computer={8} tablet={16}>
          <Segment>
            <ProjectInvoices projectID={projectID} />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default ProjectDetailScreen;
