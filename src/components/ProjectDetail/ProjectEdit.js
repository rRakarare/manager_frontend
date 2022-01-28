import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown, Input } from "semantic-ui-react";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../app.state";
import { useHistory } from "react-router-dom";

function ProjectEdit() {
  const history = useHistory();
  const projectdata = useAppStore((state) => state.projectdata);
  const setEditModalOpen = useAppStore((state) => state.setEditModalOpen);

  const [editData, setEditData] = useState({
    title: projectdata.title,
    place: projectdata.place,
    street: projectdata.street,
    plz: projectdata.plz,
    part: projectdata.part,
    contact: projectdata.contact && projectdata.contact.substring(5),
    client: projectdata.client && projectdata.client.id,
  });

  const salutoptions = [
    { value: 1, text: "Herr" },
    { value: 2, text: "Frau" },
  ];

  const [salut, setSalut] = useState(
    projectdata.contact && projectdata.contact.substring(0, 4) === "Herr"
      ? salutoptions[0]
      : salutoptions[1]
  );

  const [clients, setClients] = useState([]);
  const [error] = useState("");

  const queryClients = async () => {
    try {
      const res = await axiosInstance.get("/clients/");
      setClients(
        res.data.map((item) => {
          return {
            value: item.id,
            image: item.image,
            short: item.short,
            text: item.name,
          };
        })
      );
    } catch (err) {
      console.log(err.response);
    }
  };

  const updateProject = async () => {
    try {
      await axiosInstance.put(`/projectupdate/${projectdata.id}/`, {
        ...editData,
        title: editData.title,
        client: editData.client,
        contact: editData.contact ? salut.text + " " + editData.contact : null,
        place: editData.place ? editData.place : null,
        street: editData.street ? editData.street : null,
        plz: editData.plz ? editData.plz : null,
        part: editData.part ? editData.part : null,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        history.push("/login");
      }
      console.log(err.response);
    }

    setEditModalOpen(false);
  };

  useEffect(() => {
    queryClients();
  }, []);

  return (
    <>
      <Modal.Header>
        Projekt: <span style={{ color: "red" }}>{projectdata.title}</span>
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field
            label="Title"
            control={Input}
            value={editData.title}
            error={error.name && { content: error.name, pointing: "below" }}
            onChange={(e) =>
              setEditData((state) => ({ ...state, title: e.target.value }))
            }
            placeholder="Title"
          />

          <Form.Field
            search
            selection
            control={Dropdown}
            value={editData.client}
            label="Kunde"
            error={error.client && { content: error.client, pointing: "below" }}
            onChange={(e, result) =>
              setEditData((state) => ({ ...state, client: result.value }))
            }
            options={clients}
            fluid
            placeholder="Kunde auswählen"
          />

          <Form.Field
            label="Ort"
            control={Input}
            value={editData.place}
            onChange={(e) =>
              setEditData((state) => ({ ...state, place: e.target.value }))
            }
            placeholder="Ort"
          />
          <Form.Field
            label="Straße + Hausnummer"
            control={Input}
            value={editData.street}
            onChange={(e) =>
              setEditData((state) => ({ ...state, street: e.target.value }))
            }
            placeholder="Straße"
          />
          <Form.Group>
            <Form.Field
              width={4}
              selection
              control={Dropdown}
              value={salut.value}
              label="Anrede"
              error={
                error.client && { content: error.client, pointing: "below" }
              }
              onChange={(e, result) => {
                setSalut(
                  result.value === 1 ? salutoptions[0] : salutoptions[1]
                );
              }}
              options={[
                { value: 1, text: "Herr" },
                { value: 2, text: "Frau" },
              ]}
              fluid
            />
            <Form.Field
              width={12}
              label="Kontaktperson"
              control={Input}
              value={editData.contact}
              onChange={(e) =>
                setEditData((state) => ({ ...state, contact: e.target.value }))
              }
              placeholder="z.B. Dr. Müller"
            />
          </Form.Group>
          <Form.Field
            label="Abteilung"
            control={Input}
            value={editData.part}
            onChange={(e) =>
              setEditData((state) => ({ ...state, part: e.target.value }))
            }
            placeholder="z.B. Herr Dr. Müller"
          />
          <Form.Field
            label="Postleitzahl"
            control={Input}
            value={editData.plz}
            onChange={(e) =>
              setEditData((state) => ({ ...state, plz: e.target.value }))
            }
            placeholder="plz"
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setEditModalOpen(false)}>
          Abbrechen
        </Button>
        <Button positive onClick={() => updateProject()}>
          Projekt updated
        </Button>
      </Modal.Actions>
    </>
  );
}

export default ProjectEdit;
