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
import axiosInstance from "../axios/axios";
import { useAppStore } from "../app.state";
import WordTemplateReplace from "../components/WordTemplateReplace";
import CreateInvoice from '../components/CreateInvoice'
import EditInvoice from '../components/EditInvoice'

function ProjectInvoices({ projectID }) {
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
  const [isLoading, setIsLoading] = useState(true);
  const [openDel, setOpenDel] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [clickedInvoice, setClickedInvoice] = useState({});


  const dataold = {
    loop: [
      {
        name: "rene",
        image: { isImage: true, url: "/smile.png", width: 200, height: 200 },
      },
      {
        name: "couti",
        image: { isImage: true, url: "/logo512.png", width: 200, height: 200 },
      },
    ],
    asdqwe: { isImage: true, url: "/logo512.png", width: 200, height: 200 },
    qwe2: "Hello World",
  };

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
      await axiosInstance.delete(`invoices/${id}`)
    } catch(err) {
      return err.response
    }
    setOpenDel(false)
  }

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
  }, [invoiceCreateModel, openDel, invoiceEditModel]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {

    console.log(invoices)
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
            { title: "Status", field: "status" },
            { title: "Stellung", field: "date_of_invoicing", type: "date" },
            { title: "Eingang", field: "date_of_payment", type: "date" },
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
              return props.action.icon === "word" ? (
                <WordTemplateReplace
                  filepath="/test.docx"
                  filename="asdqwe.docx"
                  data={dataold}
                  render={(generateDocument) => {
                    return (
                      <Icon
                        name="file word"
                        size='large'                
                        color="blue"
                        style={{ cursor:'pointer' }}
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
        <EditInvoice invoiceID={clickedInvoice.id}/>
      </Modal>

      <Modal open={invoiceCreateModel} onClose={() => setInvoiceCreateModel(false)}>
        <CreateInvoice/>
      </Modal>
    </>
  );
}

export default ProjectInvoices;
