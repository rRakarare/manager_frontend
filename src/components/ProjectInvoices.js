import React, { useState, useEffect } from "react";
import { Icon, Dimmer, Loader, Popup, Modal, Button } from "semantic-ui-react";
import MaterialTable from "material-table";
import axiosInstance from "../axios/axios";
import { useAppStore } from "../app.state";

function ProjectInvoices({ projectID }) {
  const [invoices, setInvoices] = useAppStore((state) => [
    state.invoices,
    state.setInvoices,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDel, setOpenDel] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [clickedInvoice, setClickedInvoice] = useState({});

  const getInvoice = async () => {
    try {
      const res = await axiosInstance.get("invoices", {
        params: {
          id: projectID,
        },
      });
      setInvoices(res.data);
      setIsLoading(false);
    } catch (err) {
      return err.message;
    }
  };

  const upDateInvoiceStatus = async (id) => {
    try {
      const invoiceindex = invoices.findIndex((item) => item.id === id);
      const res = await axiosInstance.put(`invoices/${id}`, {
        ...invoices[invoiceindex],
        status:
          invoices[invoiceindex].status === 3
            ? 1
            : invoices[invoiceindex].status + 1,
      });
      setInvoices(
        invoices.map((item, index) =>
          index === invoiceindex ? res.data : item
        )
      );
    } catch (err) {
      return err.message;
    }
  };

  useEffect(() => {
    getInvoice();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading ? (
        <Dimmer active inverted>
          <Loader size="medium">Loading</Loader>
        </Dimmer>
      ) : (
        <MaterialTable
          style={{ boxShadow: "none" }}
          columns={[
            { title: "Name", field: "title" },
            { title: "RN", field: "invoice_number" },
            {
              title: "Betrag",
              field: "amount",
              type: "currency",
              currencySetting: { locale: "de", currencyCode: "EUR" },
            },
            { title: "Stellung", field: "date_of_invoicing", type: "date" },
            { title: "Eingang", field: "date_of_payment", type: "date" },
          ]}
          actions={[
            {
              icon: "circle",
              tooltip: "status",
              onClick: (event, rowData) => {
                upDateInvoiceStatus(rowData.id);
              },
            },
            {
              icon: "edit",
              tooltip: "Bearbeiten",
              onClick: (event, rowData) => {
                setClickedInvoice(rowData)
                setOpenEdit(true)
              },
            },
            {
              icon: "delete",
              color: "red",
              tooltip: "Rechnung löschen",
              onClick: (event, rowData) => {
                setClickedInvoice(rowData)
                setOpenDel(true)
              },
            },
          ]}
          components={{
            Action: (props) => {
              const encode = {
                1: "circle outline",
                2: "play circle outline",
                3: "check circle outline",
              };
              return (
                <Popup
                  content={props.action.tooltip}
                  trigger={
                    <Icon
                      style={{ cursor: "pointer" }}
                      size="large"
                      name={
                        props.action.icon === "circle"
                          ? encode[props.data.status]
                          : props.action.icon
                      }
                      onClick={(event) =>
                        props.action.onClick(event, props.data)
                      }
                    />
                  }
                />
              );
            },
          }}
          data={invoices}
          options={{
            actionsColumnIndex: -1,
            sorting: true,
            showTitle: false,
            toolbar: false,
            pageSize: 4,
            pageSizeOptions: [],
          }}
        />
      )}
      <Modal
        open={openDel}
        onClose={() => setOpenDel(false)}
      >
        <Modal.Header>Rechnung löschen</Modal.Header>
        <Modal.Content>
        Rechnung {clickedInvoice.title} wirklich löschen ?
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpenDel(false)}>
            Disagree
          </Button>
          <Button positive onClick={() => setOpenDel(false)}>
            Agree
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
      >
        <Modal.Header>Rechnung {clickedInvoice.title} bearbeiten</Modal.Header>
        <Modal.Content>
        Rechnung  wirklich löschen ?
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpenEdit(false)}>
            Disagree
          </Button>
          <Button positive onClick={() => setOpenEdit(false)}>
            Agree
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ProjectInvoices;
