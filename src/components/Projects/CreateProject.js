import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown, Input, Portal, Segment, Header } from "semantic-ui-react";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../app.state";
import CreateClient from '../Clients/CreateClient'

function CreateProject() {
  
  const [clients, setClients] = useState([]);
  const [newdata, setNewdata] = useState({});
  const [openClient, setOpenClient] = useAppStore((state) => [
    state.openClient,
    state.setOpenClient,
  ]);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState({});
  const setProjectModalOpen = useAppStore((state) => state.setProjectModalOpen);

  const AddProject = async () => {
    try {
      await axiosInstance.post("/addProject/", {
        ...newdata,
        status: 1,
      });
      setProjectModalOpen(false);
    } catch (err) {
      console.log(err.response);
      setError(err.response.data);
    }
  };

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
      setNewdata(state=>({...state, client: Math.max(...res.data.map(item=>item.id))}))
    } catch (err) {
      console.log(err.response);
    }
  };

  const queryTypes = async () => {
    try {
      const res = await axiosInstance.get("/types/");
      console.log(res);
      setTypes(
        res.data.map((item) => {
          return {
            value: item.id,
            text: item.name,
            short: item.short,
          };
        })
      );
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    queryClients();
    queryTypes();
  }, [openClient]);


  return (
    <>
    <Portal open={openClient}>
        <Segment
          style={{
            left: 0,
            right: 0,
            marginLeft: "auto",
            marginRight: "auto",
            position: "fixed",
            width: "280px",
            top: "20%",
            zIndex: 1000,
          }}
        >
          <Header>Neuen Kunden anlegen</Header>
          <CreateClient/>

          <Button
            style={{ marginTop: ".5rem" }}
            fluid
            content="Abbrechen"
            negative
            onClick={() => setOpenClient(false)}
          />
        </Segment>
      </Portal>
      <Modal.Header>Neues Projekt</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field
            label="Title"
            control={Input}
            error={error.title && { content: error.title, pointing: "below" }}
            onChange={(e) =>
              setNewdata((state) => ({ ...state, title: e.target.value }))
            }
            placeholder="Title"
          />

          <Form.Field
            selection
            label="Typ"
            control={Dropdown}
            error={
              error.project_type && {
                content: error.project_type,
                pointing: "below",
              }
            }
            onChange={(e, result) =>
              setNewdata((state) => ({ ...state, project_type: result.value }))
            }
            fluid
            placeholder="Projekttyp wählen"
            options={types}
          />

          <Form.Field
            search
            selection
            control={Dropdown}
            label="Kunde"
            value={newdata.client}
            error={error.client && { content: error.client, pointing: "below" }}
            onChange={(e, result) =>{
              setNewdata((state) => ({ ...state, client: result.value }))
            }}
            fluid
            placeholder="Kunde auswählen"
            options={clients}
          />
          <Button onClick={()=>{
            setOpenClient(true)
          }} icon="add" label="Neuer Kunde"/>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setProjectModalOpen(false)}>
          Abbrechen
        </Button>
        <Button positive onClick={() => AddProject()}>
          Projekt anlegen
        </Button>
      </Modal.Actions>
    </>
  );
}

export default CreateProject;
