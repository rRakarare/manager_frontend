import React from "react";
import MaterialTable from "material-table";
import { Image } from "semantic-ui-react";
import { useAppStore } from "../../app.state";

function ClientTable({ data }) {


    const setOpenClient = useAppStore(state=>state.setOpenClient)

  return (
    <>
      <MaterialTable
        title="Projektliste"
        columns={[
        { title: "Logo", field: "image", render: rowData => <Image src={rowData.image} style={{height:"40px"}} rounded /> },
          { title: "Kunde", field: "name" },
          { title: "Kürzel", field: "short" },
          

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
                console.log(rowData);
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
              isFreeAction:true,
              onClick: () => {
                setOpenClient(true)
              }
          }
        ]}
      />



    </>
  );
}

export default ClientTable;
