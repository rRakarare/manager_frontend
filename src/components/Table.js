import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import useForceUpdate from 'use-force-update';
import axiosInstance from '../axios/axios'
import { Modal, Button, Form, Checkbox, Select } from "semantic-ui-react";

function Table({ data, status, isLoading }) {
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [delproject, setDelproject] = useState({});
  const [newdata, setNewdata] = useState({});
  const [clients, setClients] = useState([])
  const forceUpdate = useForceUpdate();
  const history = useHistory();

  const AddProject = async () => {
    try {
      const res = await axiosInstance.post('/addProject/',{...newdata, project_number:newdata.title + "220"})
      setOpenNew(false)


    } catch(err) {
      console.log(err.response)
    }
  }

  const queryClients = async () => {
    try {
      const res = await axiosInstance.get('/clients/')
      setClients(res.data.map(item => {
        return {
          value : item.id,
          image : item.image,
          text:item.name
        }
      }))
    } catch(err) {
      console.log(err.response)
    }
  }

  useEffect(() => {
    queryClients()

  }, [])

  const lookupstatus = {};
  status.forEach((item) => {
    lookupstatus[item.id] = item.name;
  });
  const tableData = data.map((item) => {
    const date = new Date(item.created_at).toLocaleDateString("de", {
      hour: "numeric",
      minute: "numeric",
    });
    return {
      id: item.id,
      title: item.title,
      client: item.client && item.client.name,
      created_at: date,
      status: item.status && item.status.id,
    };
  });
  return (
    <>
      <MaterialTable
        isLoading={isLoading.dataLoaded || isLoading.statusLoaded}
        title="Projektliste"
        columns={[
          { title: "Titel", field: "title" },
          { title: "Kunde", field: "client" },
          { title: "Erstellt", field: "created_at", type: "date" },
          { title: "Status", field: "status", lookup: lookupstatus },
        ]}
        data={tableData}
        options={{
          actionsColumnIndex: -1,
          sorting: true,
          filtering: true,
          exportButton: true,
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Projektdetails",
            onClick: (event, rowData) => {
              history.push(`/projects/${rowData.id}`);
            },
          },
          {
            icon: "add",
            tooltip: "Neues Projekt",
            isFreeAction: true,
            onClick: () => {
              setOpenNew(true);
            },
          },
          {
            icon: "delete",
            tooltip: "Projekt löschen",
            onClick: (event, rowData) => {
              console.log(rowData);
              setDelproject(rowData);
              setOpen(true);
            },
          },
        ]}
      />
      <Modal open={openNew} onClose={() => setOpenNew(false)}>
        <Modal.Header>Neues Projekt</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Title</label>
              <input onChange={(e)=>setNewdata(state => ({...state, title:e.target.value}))} placeholder="Title" />
            </Form.Field>
            <Form.Field>
              <label>Kunde</label>
              <Select onChange={(e, result)=>setNewdata(state => ({...state, client:result.value}))} fluid placeholder='Kunde auswählen' options={clients} />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpenNew(false)}>
            Abbrechen
          </Button>
          <Button positive onClick={() => AddProject()}>
            Projekt anlegen
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Projekt löschen</Modal.Header>
        <Modal.Content>
          Das Project{" "}
          <strong>
            {delproject.title} ({delproject.client})
          </strong>{" "}
          wirklich löschen ?
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpen(false)}>
            Disagree
          </Button>
          <Button positive onClick={() => setOpen(false)}>
            Agree
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default Table;
