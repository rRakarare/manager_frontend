import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Icon, Modal, Popup } from "semantic-ui-react";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../app.state";
import { Link } from "react-router-dom";

import EditInvoice from "../ProjectDetail/EditInvoice";

function InvoiceTable() {
  const [invoices, setInvoices] = useAppStore((state) => [
    state.invoices,
    state.setInvoices,
  ]);
  const [projectdata, setProjectdata] = useState([]);
  const [invoiceStati, setInvoiceStati] = useAppStore((state) => [
    state.invoiceStati,
    state.setInvoiceStati,
  ]);

  const [invoiceEditModel, setInvoiceEditModel] = useAppStore((state) => [
    state.invoiceEditModel,
    state.setInvoiceEditModel,
  ]);
  const [clickedInvoice, setClickedInvoice] = useState();
  const [isLoading, setIsLoading] = useState({
    projects: true,
    invoices: true,
  });

  const createProjectData = async () => {
    try {
      const res = await axiosInstance.get("projects/");
      setProjectdata(res.data);
      setIsLoading((state) => ({ ...state, projects: false }));
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const queryInvoices = async () => {
    try {
      const res = await axiosInstance.get("invoicesall/");
      setInvoices(res.data);
      setIsLoading((state) => ({ ...state, invoices: false }));
    } catch (err) {
      console.log(err.response);
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

  useEffect(() => {
    queryInvoices();
    getInvoiceStati();
    createProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceEditModel]);

  return (
    <>
      <MaterialTable
        isLoading={isLoading.projects || isLoading.invoices}
        title="Rechnungen"
        columns={[
          {
            title: "ID",
            field: "id",
          },
          {
            title: "Name",
            field: "title",
            render: (rowData) => {
              return (
                <>
                  {rowData.title.length > 10 ? (
                    <Popup
                      content={rowData.title}
                      trigger={<p>{rowData.title.slice(0, 10) + "..."}</p>}
                    />
                  ) : (
                    <p>{rowData.title}</p>
                  )}
                </>
              );
            },
          },
          {
            title: "Rechnungsnummer",
            field: "invoice_number",
          },

          {
            title: "Projekt",
            field: "project",
            render: (rowData) => {
              const project = projectdata.find(
                (item) => item.id === rowData.project
              );
              return (
                <>
                  {project && project.title.length > 17 ? (
                    <Popup
                      content={project && project.title}
                      trigger={
                        <Link to={`/projects/${project && project.id}`}>
                          {project.title.slice(0, 17) + "..."}
                        </Link>
                      }
                    />
                  ) : (
                    project && (
                      <Link to={`/projects/${project && project.id}`}>
                        {project.title}
                      </Link>
                    )
                  )}
                </>
              );
            },
          },
          {
            title: "Kunde",
            field: "invoice_number",
            render: (rowData) => {
              const project = projectdata.find(
                (item) => item.id === rowData.project
              );
              return <p>{project && project.client.name}</p>;
            },
          },
          {
            title: "Status",
            field: "status",
            lookup: { 1: "angelegt", 2: "gestellt", 3: "erhalten" },
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
          {
            title: "Offen (Tagen)",
            field: "date_of_invoicing",
            filtering: false,
            render: (rowData) => {
              const today = new Date();
              const invoicedate = new Date(rowData.date_of_invoicing);
              const dateDif = today.getTime() - invoicedate.getTime();
              const DifDays = dateDif / (1000 * 3600 * 24);
              return rowData.status !== 3
                ? rowData.date_of_invoicing
                  ? Math.trunc(DifDays)
                  : "-"
                : "-";
            },
          },
          {
            title: "Rechnungsstellung",
            field: "date_of_invoicing",
            type: "date",
            dateSetting: { locale: "de" },
            render: (rowData) =>
              rowData.date_of_invoicing
                ? new Date(rowData.date_of_invoicing).toLocaleDateString("de")
                : "-",
          },
          {
            title: "Zahlungseingang",
            field: "date_of_payment",
            render: (rowData) => (
              <span
                style={{ color: rowData.status === 3 ? "#016936" : "#CFCCD6" }}
              >
                {rowData.date_of_payment
                  ? new Date(rowData.date_of_payment).toLocaleDateString("de")
                  : "-"}
              </span>
            ),
          },
          {
            title: "Betrag",
            field: "amount",
            type: "currency",
            currencySetting: { locale: "de", currencyCode: "EUR" },
          },
        ]}
        actions={[
          {
            icon: "edit",
            color: "grey",
            tooltip: "edit",
            onClick: (event, rowData) => {
              setClickedInvoice(rowData.id);
              setInvoiceEditModel(true);
            },
          },
        ]}
        data={invoices}
        options={{
          filtering: true,
          actionsColumnIndex: -1,
          sorting: true,
          exportButton: true,
          pageSize: 10,
          padding: "dense",
          pageSizeOptions: [10, 20, 50, { value: invoices.length, label: 'All' }]
        }}
      />
      <Modal open={invoiceEditModel} onClose={() => setInvoiceEditModel(false)}>
        <EditInvoice invoiceID={clickedInvoice} />
      </Modal>
    </>
  );
}

export default InvoiceTable;
