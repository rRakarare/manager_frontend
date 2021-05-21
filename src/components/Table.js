import React, { useState } from "react";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "semantic-ui-react";

function Table({ data, status, isLoading }) {
  const [open, setOpen] = useState(false);
  const [delproject, setDelproject] = useState({});
  const history = useHistory();

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
      client: item.client.name,
      created_at: date,
      status: item.status.id,
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
          { title: "Erstellt", field: "created_at" },
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


      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
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
