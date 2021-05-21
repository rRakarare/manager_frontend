import React, {useEffect} from 'react';
import { Dimmer,Loader,Item,Button } from 'semantic-ui-react'
import axiosInstance from "../axios/axios";
import { useAppStore } from '../app.state';


var _ = require("lodash/core");

function ProjectDetail({projectID}) {

    const [projectdata, setProjectdata] = useAppStore(state=> [state.projectdata, state.setProjectdata])

    const getProjectData = async () => {
        try {
          const res = await axiosInstance.get(`projects/${projectID}/`);
          setProjectdata(res.data);
        } catch (err) {
          return err.message;
        }
      };

      const date = new Date(projectdata.created_at).toLocaleDateString("de", {
        hour: "numeric",
        minute: "numeric",
      });

    useEffect(() => {
        getProjectData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        _.isEmpty(projectdata) ? (
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
                  <Button style={{ marginBottom: ".3rem" }} icon="add" content="Task" />
                </Item.Extra>
              </Item.Content>
            </Item>
          )
    )
}

export default ProjectDetail
