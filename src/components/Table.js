import React, { useState } from "react";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import { Portal, Segment, Header, Button } from "semantic-ui-react";

function Table({ data, status, isLoading }) {
  const [open, setOpen] = useState(false);
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
          <Header>This is a controlled portal</Header>
          <p>Portals have tons of great callback functions to hook into.</p>
          <p>To close, simply click the close button or click away</p>

          <Button
            content="Close Portal"
            negative
            onClick={() => setOpen(false)}
          />
        </Segment>
      </Portal>
    </>
  );
}

export default Table;
