import React, { useEffect } from "react";
import {
  Dimmer,
  Loader,
  Button,
  Image,
  Modal,
  List,
  Icon,
} from "semantic-ui-react";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../app.state";
import ProjectEdit from "./ProjectEdit";
import CreateOffer from "./CreateOffer";

var _ = require("lodash/core");

function ProjectDetail({ projectID }) {


  const [projectdata, setProjectdata] = useAppStore((state) => [
    state.projectdata,
    state.setProjectdata,
  ]);
  const [projectHonorar, setProjectHonorar] = useAppStore((state) => [
    state.projectHonorar,
    state.setProjectHonorar,
  ]);

  const [editModalOpen, setEditModalOpen] = useAppStore((state) => [
    state.editModalOpen,
    state.setEditModalOpen,
  ]);

  const [createOfferModel, setCreateOfferModel] = useAppStore((state) => [
    state.createOfferModel,
    state.setCreateOfferModel,
  ]);

  const invoices = useAppStore((state) => state.invoices);


  useEffect(() => {
    if (invoices) {
      let betrag = 0;
      invoices.forEach((item) => (betrag += parseFloat(item.amount)));
      setProjectHonorar(betrag)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices])





  

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
            <List.Description as="p" style={{ marginBottom: 0 }}>
              <strong>Erstellt:</strong> {date}
            </List.Description>
            <List.Description as="p">
              <strong>Projektnr:</strong> {projectdata.project_number}
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <Image
            rounded
            style={{ width: "23.625px", marginRight: "6px" }}
            src={projectdata.client && projectdata.client.image}
          />
          <List.Content>
            <List.Header as="h3">{projectdata.client ? projectdata.client.name : 'NO CLIENT'}</List.Header>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="eur" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header style={{ marginLeft: "11px" }} as="h4">
              Honorar
            </List.Header>
            <List.Description style={{ marginLeft: "11px" }}>
              <strong style={{ color: "green" }}>
                {projectHonorar &&
                  projectHonorar.toLocaleString("de") + " €"}
              </strong>
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
            <Button
              disabled={projectdata.client === null ? true : false}
              icon="file word"
              content="create"
              onClick={() => setCreateOfferModel(true)}
            />
          </List.Content>
        </List.Item>
      </List>

      <Modal open={editModalOpen}>
        <ProjectEdit />
      </Modal>

      <Modal open={createOfferModel}>
        <CreateOffer />
      </Modal>
    </>
  );
}

export default ProjectDetail;
