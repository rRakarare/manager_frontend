import React, { useEffect } from "react";
import { Dimmer, Loader, Item, Button } from "semantic-ui-react";
import axiosInstance from "../axios/axios";
import { useAppStore } from "../app.state";
import WordTemplateReplace from "../components/WordTemplateReplace";

var _ = require("lodash/core");

function ProjectDetail({ projectID }) {
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
    qwe2: "Hello World",
  };

  const [projectdata, setProjectdata] = useAppStore((state) => [
    state.projectdata,
    state.setProjectdata,
  ]);

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
    getProjectData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return _.isEmpty(projectdata) ? (
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
            style={{ display: "block", marginBottom: ".3rem" }}
            icon="edit"
            content="Bearbeiten"
          />
          <WordTemplateReplace
            filepath="/test.docx"
            filename="asdqwe.docx"
            data={dataold}
            render={(generateDocument) => {
              return (
                <Button
                
                  icon="file word"
                  content="Angebot erstellen"
                  color="blue"
                  style={{ display: "block", marginBottom: ".3rem" }}
                  onClick={() => generateDocument()}
                />
              );
            }}
          />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}

export default ProjectDetail;
