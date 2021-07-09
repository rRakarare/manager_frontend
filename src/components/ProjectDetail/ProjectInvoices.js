import React, { useState, useEffect } from "react";
import {
  Icon,
  Dimmer,
  Loader,
  Popup,
  Modal,
  Button,
  Container,
} from "semantic-ui-react";
import MaterialTable from "material-table";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../app.state";
import WordTemplateReplace from "../WordTemplateReplace";
import CreateInvoice from "./CreateInvoice";
import EditInvoice from "./EditInvoice";
import re_vorlage from "../../vorlagen/re_vorlage.docx";

function ProjectInvoices({ projectID }) {
  var formatter = new Intl.NumberFormat("de", {
    style: "currency",
    currency: "EUR",
  });

  const [invoices, setInvoices] = useAppStore((state) => [
    state.invoices,
    state.setInvoices,
  ]);
  const [invoiceCreateModel, setInvoiceCreateModel] = useAppStore((state) => [
    state.invoiceCreateModel,
    state.setInvoiceCreateModel,
  ]);
  const [invoiceEditModel, setInvoiceEditModel] = useAppStore((state) => [
    state.invoiceEditModel,
    state.setInvoiceEditModel,
  ]);

  const [invoiceStati, setInvoiceStati] = useAppStore((state) => [
    state.invoiceStati,
    state.setInvoiceStati,
  ]);

  const [artikels, setArtikels] = useState([]);

  const projectdata = useAppStore((state) => state.projectdata);

  const getArtikels = async () => {
    try {
      const res = await axiosInstance.get("/artikel/");
      setArtikels(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getInvoiceStati = async () => {
    try {
      const res = await axiosInstance.get("/invoicestatus/");
      setInvoiceStati(
        res.data.map((item) => ({
          value: item.id,
          text: item.name,
          icon: item.icontext,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [openDel, setOpenDel] = useState(false);
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

  const deleteInvoice = async (id) => {
    try {
      await axiosInstance.delete(`invoices/${id}`);
    } catch (err) {
      return err.response;
    }
    setOpenDel(false);
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
    getInvoiceStati();
    getArtikels();
  }, []);

  useEffect(() => {
    getInvoice();
  }, [invoiceCreateModel, openDel, invoiceEditModel]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log(invoices);
  }, [invoices]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading ? (
        <Dimmer active inverted>
          <Loader size="medium">Loading</Loader>
        </Dimmer>
      ) : (
        <MaterialTable
          title="Rechnungen"
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
            {
              title: "Status",
              field: "status",
              render: (rowData) => {
                const status = invoiceStati.find(
                  (item) => item.value === rowData.status
                );
                return (
                  <>
                    <span style={{ marginRight: ".2rem" }}>
                      {status && status.text}
                    </span>
                    <Icon
                      color={
                        status && status.value === 3
                          ? "green"
                          : status && status.value === 2
                          ? "yellow"
                          : "black"
                      }
                      name={status && status.icon}
                    />
                  </>
                );
              },
            },
            { title: "Stellung", field: "date_of_invoicing", type: "date" },
            {
              title: "Eingang",
              field: "date_of_payment",
              type: "date",
              render: (rowData) => {
                const date = new Date(
                  rowData.date_of_payment
                ).toLocaleDateString("de");
                return (
                  <span
                    style={{
                      color: rowData.status === 3 ? "#016936" : "#FFD700",
                    }}
                  >
                    {date}
                  </span>
                );
              },
            },
          ]}
          actions={[
            {
              icon: "word",
              color: "grey",
              tooltip: "status",
              onClick: (event, rowData) => {
                upDateInvoiceStatus(rowData.id);
              },
            },
            {
              icon: "edit",
              color: "blue",
              tooltip: "Bearbeiten",
              onClick: (event, rowData) => {
                setClickedInvoice(rowData);
                setInvoiceEditModel(true);
              },
            },
            {
              icon: "delete",
              color: "red",
              tooltip: "Rechnung löschen",
              onClick: (event, rowData) => {
                setClickedInvoice(rowData);
                setOpenDel(true);
              },
            },
            {
              icon: "add",
              tooltip: "Neue Rechnung",
              color: "grey",
              isFreeAction: true,
              onClick: (event) => setInvoiceCreateModel(true),
            },
          ]}
          components={{
            Action: (props) => {
              const invoice = props.data;
              const artikel = artikels.find(
                (item) =>
                  projectdata.client && item.id === projectdata.client.artikel
              );

              let adresse = [];

              if (projectdata.part) {
                adresse.push({ item: projectdata.part });
              }
              if (projectdata.contact) {
                adresse.push({ item: projectdata.contact });
              }
              if (projectdata.street) {
                adresse.push({ item: projectdata.street });
              }
              if (projectdata.plz && projectdata.place) {
                adresse.push({
                  item: projectdata.plz + " " + projectdata.place,
                });
              }

              const newData = {
                date: new Date().toLocaleDateString("de"),
                logo: {
                  isImage: true,
                  url: projectdata.client && projectdata.client.image,
                  width: 20,
                  height: 20,
                },
                invoice_number: invoice.invoice_number,
                netto: formatter.format(invoice.amount),
                tax: formatter.format(invoice.amount * 0.19),
                brutto: formatter.format(invoice.amount * 1.19),
                clientname: projectdata.client && projectdata.client.name,
                project_number: projectdata.project_number,
                title: projectdata.title,
                artikel: artikel && artikel.nominativ,
                street: projectdata.street,
                plz: projectdata.plz,
                place: projectdata.place,
                contact: projectdata.contact,
                adresse: adresse,
                part: projectdata.part,
                contactSalut: projectdata.contact
                  ? projectdata.contact.substring(0, 4) === "Herr"
                    ? `sehr geehrter ${projectdata.contact}`
                    : projectdata.contact.substring(0, 4) === "Frau"
                    ? `sehr geehrte ${projectdata.contact}`
                    : ""
                  : "Sehr geehrte Damen und Herren",
              };
              return props.action.icon === "word" ? (
                <WordTemplateReplace
                  filepath={re_vorlage}
                  filename={`${invoice.invoice_number}.docx`}
                  data={newData}
                  render={(generateDocument) => {
                    return (
                      <Icon
                        name="file word"
                        size="large"
                        color="blue"
                        style={{ cursor: "pointer" }}
                        onClick={() => generateDocument()}
                      />
                    );
                  }}
                />
              ) : (
                <Popup
                  content={props.action.tooltip}
                  trigger={
                    <Icon
                      color={props.action.color}
                      style={{ cursor: "pointer" }}
                      size="large"
                      name={props.action.icon}
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
            showTitle: true,
            toolbar: true,
            pageSize: 4,
            search: false,
            pageSizeOptions: [],
          }}
        />
      )}
      <Modal open={openDel} onClose={() => setOpenDel(false)}>
        <Modal.Header>Rechnung löschen</Modal.Header>
        <Modal.Content>
          Rechnung {clickedInvoice.title} wirklich löschen ?
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpenDel(false)}>
            Disagree
          </Button>
          <Button positive onClick={() => deleteInvoice(clickedInvoice.id)}>
            Agree
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal open={invoiceEditModel} onClose={() => setInvoiceEditModel(false)}>
        <EditInvoice invoiceID={clickedInvoice.id} />
      </Modal>

      <Modal
        open={invoiceCreateModel}
        onClose={() => setInvoiceCreateModel(false)}
      >
        <CreateInvoice />
      </Modal>
    </>
  );
}

export default ProjectInvoices;
