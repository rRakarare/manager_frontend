import React from "react";
import MaterialTable from "material-table";
import { Image } from "semantic-ui-react";
import { useAppStore } from "../../app.state";

function ClientTable({ data, editPortal }) {
  const setOpenClient = useAppStore((state) => state.setOpenClient);
  const [editClientData, setEditClientData] = useAppStore((state) => [
    state.editClientData,
    state.setEditClientData,
  ]);

  return (
    <>
      <MaterialTable
        title="Projektliste"
        columns={[
          {
            title: "Logo",
            field: "image",
            render: (rowData) => (
              <Image src={rowData.image} style={{ height: "40px" }} rounded />
            ),
          },
          { title: "Kunde", field: "name" },
        ]}
        data={data}
        options={{
          actionsColumnIndex: -1,
          sorting: true,
          exportButton: true,
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Projektdetails",
            onClick: (event, rowData) => {
              editPortal(true);
              console.log(rowData);
              setEditClientData(rowData);
            },
          },
          {
            icon: "delete",
            tooltip: "Projekt löschen",
            onClick: (event, rowData) => {
              console.log(rowData);
            },
          },
          {
            icon: "add",
            isFreeAction: true,
            onClick: () => {
              setOpenClient(true);
            },
          },
        ]}
      />
    </>
  );
}

export default ClientTable;
