import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Image, Modal, Button } from "semantic-ui-react";
import { useAppStore } from "../../app.state";
import axiosInstance from "../../axios/axios";

function ClientTable({ data, editPortal, updateSite }) {
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState({});
  const setOpenClient = useAppStore((state) => state.setOpenClient);
  const setEditClientData = useAppStore((state) => state.setEditClientData);

  const delClient = async (id) => {
    try {
      await axiosInstance.delete(`clients/${id}`);
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    updateSite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <MaterialTable
        test={open}
        title="Kundenliste"
        columns={[
          {
            title: "Logo",
            field: "image",
            render: (rowData) => {
              console.log(rowData.image);
              return (
                <Image
                  bordered
                  src={rowData.image}
                  style={{ height: "30px", background: "transparent" }}
                  rounded
                />
              );
            },
          },
          { title: "Kunde", field: "name" },
          { title: "Kurz", field: "short" },
        ]}
        data={data}
        options={{
          actionsColumnIndex: -1,
          sorting: true,
          exportButton: true,
          pageSize: 10,
          padding: "dense",
          pageSizeOptions: [10, 20, 50, { value: data.length, label: 'All' }]
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
              setClient(rowData);
              setOpen(true);
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Kunde löschen</Modal.Header>
        <Modal.Content>
          Das Project <strong>{client.name}</strong> wirklich löschen ?
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button positive onClick={() => delClient(client.id)}>
            Löschen
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ClientTable;
