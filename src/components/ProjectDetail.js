import React, { useEffect, useState } from "react";
import {
  Dimmer,
  Loader,
  Item,
  Button,
  Image,
  Modal,
  List,
  Icon,
} from "semantic-ui-react";
import axiosInstance from "../axios/axios";
import { useAppStore } from "../app.state";
import WordTemplateReplace from "../components/WordTemplateReplace";
import ProjectEdit from "../components/ProjectEdit";

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

  const [editModalOpen, setEditModalOpen] = useAppStore((state) => [
    state.editModalOpen,
    state.setEditModalOpen,
  ]);

  const invoices = useAppStore((state) => state.invoices);

  let honorar = 0;

  invoices.forEach(item => honorar += parseFloat(item.amount))

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
  }, [editModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return _.isEmpty(projectdata) ? (
    <Dimmer active inverted>
      <Loader size="medium">Loading</Loader>
    </Dimmer>
  ) : (
    <>
      <List divided relaxed>
        <List.Item>
          <List.Content>
            <List.Header as="h2">{projectdata.title}</List.Header>
            <List.Description as="p">
              <strong>Erstellt:</strong> {date}
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <Image
            rounded
            style={{ width: "23.625px", marginRight: "6px" }}
            src={projectdata.client.image}
          />
          <List.Content>
            <List.Header as="h3">{projectdata.client.name}</List.Header>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="eur" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header style={{ marginLeft: "11px" }} as="h4">
              Honorar
            </List.Header>
            <List.Description style={{ marginLeft: "11px" }}>
              <strong style={{ color: "green" }}>{honorar.toLocaleString('de') + " €"}</strong>
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="map" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header as="h4">Anschrift</List.Header>
            <List.Description>
              <strong>Straße: </strong>
              {projectdata.street}{" "}
              {projectdata.street && <Icon color="green" name="check" />}
            </List.Description>
            <List.Description>
              <strong>Plz: </strong>
              {projectdata.plz}{" "}
              {projectdata.plz && <Icon color="green" name="check" />}
            </List.Description>
            <List.Description>
              <strong>Ort: </strong>
              {projectdata.place}{" "}
              {projectdata.place && <Icon color="green" name="check" />}
            </List.Description>
            <List.Description>
              <strong>Kontakt: </strong>
              {projectdata.contact}{" "}
              {projectdata.contact && <Icon color="green" name="check" />}
            </List.Description>
            <List.Description>
              <strong>Abteilung: </strong>
              {projectdata.part}{" "}
              {projectdata.part && <Icon color="green" name="check" />}
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <Button
              style={{ marginBottom: ".3rem" }}
              icon="edit"
              content="edit"
              onClick={() => setEditModalOpen(true)}
            />
            <WordTemplateReplace
              filepath="/test.docx"
              filename="asdqwe.docx"
              data={dataold}
              render={(generateDocument) => {
                return (
                  <Button
                    icon="file word"
                    content="offer"
                    color="blue"
                    style={{ marginBottom: ".3rem" }}
                    onClick={() => generateDocument()}
                  />
                );
              }}
            />
          </List.Content>
        </List.Item>
      </List>

      <Modal open={editModalOpen}>
        <ProjectEdit />
      </Modal>
    </>
  );
}

export default ProjectDetail;
