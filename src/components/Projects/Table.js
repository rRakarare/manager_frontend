import React, { useState } from "react";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../app.state";
import { Modal, Button, Popup } from "semantic-ui-react";

function Table({ data, status, isLoading, rerenderfunc }) {
  const [open, setOpen] = useState(false);
  const [delproject, setDelproject] = useState({});
  const history = useHistory();
  const setProjectModalOpen = useAppStore((state) => state.setProjectModalOpen);

  const deleteProject = async () => {
    try {
      await axiosInstance.delete(`/projects/${delproject.id}`);
      rerenderfunc();
      setOpen(false);
    } catch (err) {
      console.log(err.response);
    }
  };
  
  let lookupstatus = {};
  let tableData = [];
  if (!isLoading) {
    
    status.forEach((item) => {
      lookupstatus[item.id] = item.name;
    });
    tableData = data.map((item) => {
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
        honorar: item.honorar,
      };
    });
  } else {
    
  }

  return (
    <>
      <MaterialTable
        isLoading={isLoading}
        title="Projektliste"
        columns={[
          { title: "Ident", field: "id" },
          { title: "Nr.", field: "project_number" },
          { title: "Titel", field: "title", render: (rowData) => {

            return (
              <>
                {rowData.title.length > 17 ? (
                  <Popup
                    content={rowData.title}
                    trigger={<p>{rowData.title.slice(0, 17) + "..."}</p>}
                  />
                ) : (
                  <p>{rowData.title}</p>
                )}
              </>
            );
          }, },
          { title: "Kunde", field: "client" },
          { title: "Erstellt", field: "created_at", type: "datetime" },
          { title: "Status", field: "status", lookup: lookupstatus },
          {
            title: "Honorar",
            field: "honorar",
            type: "currency",
            currencySetting: { locale: "de", currencyCode: "EUR" },
          },
        ]}
        data={tableData}
        options={{
          actionsColumnIndex: -1,
          sorting: true,
          filtering: true,
          exportButton: true,
          pageSize: 10,
          padding: 'dense',
          pageSizeOptions: [10, 20, 50, { value: tableData.length, label: 'All' }]
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
