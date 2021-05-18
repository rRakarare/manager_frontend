import React, { useState } from "react";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import { Portal, Segment, Header, Button } from "semantic-ui-react";

function Table({ data, status, isLoading }) {
  const [open, setOpen] = useState(false);
  const [delproject, setDelproject] = useState({});
  const history = useHistory();
  console.log(data);

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
      <Portal onClose={() => setOpen(false)} open={open}>
        <Segment
          style={{
            left: "40%",
            position: "fixed",
            top: "30%",
            zIndex: 1000,
          }}
        >
          <Header>Projekt löschen</Header>
          <p>
            Das Project{" "}
            <strong>
              {delproject.title} ({delproject.client})
            </strong>{" "}
            wirklich löschen ?
          </p>

          <Button content="Löschen" negative onClick={() => setOpen(false)} />
          <Button content="Abbrechen" primary onClick={() => setOpen(false)} />
        </Segment>
      </Portal>
    </>
  );
}

export default Table;
