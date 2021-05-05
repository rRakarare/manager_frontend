import React, {useState, useEffect} from 'react'
import { Grid, Segment, Statistic } from "semantic-ui-react";
import axiosInstance from "../axios/axios";

function ProjectDetail({match}) {

    const projectID = match.params.id
    const [data, setData] = useState({})

    const SegmentStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };

    const getProjectData = async () => {
        try {
            const res = await axiosInstance.get(`projects/${projectID}`)
            setData(res.data)
        } catch(err) {
            return err.message
        }
    }

    useEffect(() => {
        getProjectData()
    }, [])

    return (
        <Grid style={{ margin: "2rem" }} columns={3}>
        <Grid.Row stretched>
          <Grid.Column width={2}></Grid.Column>
          <Grid.Column width={11}>
            {data.title}
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
    )
}

export default ProjectDetail
