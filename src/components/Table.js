import React from "react";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";

function Table({ data, status, isLoading }) {
  const history = useHistory();
  console.log(isLoading);

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
          icon: "rate_review",
          tooltip: "Projektdetails",
          onClick: (event, rowData) => {
            history.push(`/projects/${rowData.id}`);
          },
        },
        {
          icon: "delete",
          tooltip: "Projekt löschen",
          onClick: (event, rowData) => {
            console.log(rowData.id);
          },
        },
      ]}
    />
  );
}

export default Table;
