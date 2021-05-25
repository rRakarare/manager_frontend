import React from "react";
import { Grid, Segment, Step } from "semantic-ui-react";
import ProjectInvoices from "../components/ProjectInvoices";
import ProjectSteps from "../components/ProjectSteps";
import ProjectDetail from "../components/ProjectDetail";
import WordOffer from "../components/WordOffer";

function ProjectDetailScreen({ match }) {
  const projectID = match.params.id;

  const dataold = {
    loop: [
      {
        name: "rene",
        image: { isImage: true, url: "/smile.png", width: 200, height: 200 },
      },
      {
        name: "couti",
        image: { isImage: true, url: "/logo512.png", width: 200, height: 200 },
      },
    ],
    asdqwe: { isImage: true, url: "/logo512.png", width: 200, height: 200 },
    qwe2: { isImage: true, url: "/smile.png", width: 200, height: 200 },
  };

  return (
    <Grid stackable columns={3}>
      <Grid.Row style={{ minHeight: "343px" }} stretched>
        <Grid.Column computer={4} tablet={16}>
          <Segment>
            <ProjectDetail projectID={projectID} />
            <WordOffer
              filepath="/test.docx"
              filename="asdqwe.docx"
              data={dataold}
            />
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
