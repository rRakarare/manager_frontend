import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import axiosInstance from '../axios/axios'
import { useAppStore } from "../app.state";
import { Modal, Button, Form, Dropdown } from "semantic-ui-react";

function Table({ data, status, isLoading, rerenderfunc }) {
  const [open, setOpen] = useState(false);
  const [delproject, setDelproject] = useState({});
  const history = useHistory();
  const setProjectModalOpen = useAppStore(state => state.setProjectModalOpen)

  
  const deleteProject = async () => {
    try {
      await axiosInstance.delete(`/projects/${delproject.id}`)
      rerenderfunc()
      setOpen(false)
      
    } catch(err) {
      console.log(err.response)
    }
  }


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
      project_number: item.project_number,
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
          { title: "Nr.", field: "project_number" },
          { title: "Titel", field: "title" },
          { title: "Kunde", field: "client" },
          { title: "Erstellt", field: "created_at", type: "datetime" },
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
              setProjectModalOpen(true);
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
            Abbrechen
          </Button>
          <Button positive onClick={() => deleteProject()}>
            Löschen
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default Table;
