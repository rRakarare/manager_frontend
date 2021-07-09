import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Icon } from 'semantic-ui-react'
import axiosInstance from "../../axios/axios";
import { useAppStore } from '../../app.state';
import { Link } from 'react-router-dom'

function InvoiceTable() {
  const [invoices, setInvoices] = useState([]);
  const [projectdata, setProjectdata] = useState([]);
  const [invoiceStati, setInvoiceStati] = useAppStore((state) => [
    state.invoiceStati,
    state.setInvoiceStati,
  ]);

  const createProjectData = async () => {
    try {
      const res = await axiosInstance.get("projects/");
      setProjectdata(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const queryInvoices = async () => {
    try {
      const res = await axiosInstance.get("invoicesall/");
      setInvoices(res.data);
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
  }, []);

  useEffect(() => {
    console.log(invoices);
  }, [invoices]);

  return (
    <MaterialTable
      title="Projektliste"
      columns={[
        {
          title: "Name",
          field: "title",
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
              <Link to={`/projects/${project && project.id}`}>{project && project.title}</Link>
            )
          }
        },
        {
          title: "Kunde",
          field: "invoice_number",
          render: (rowData) => {
            const project = projectdata.find(
              (item) => item.id === rowData.project
            );
            return (
              <p>{project && project.client.name}</p>
            )
          }
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
        {
          title: "Rechnungsstellung",
          field: "date_of_invoicing",
          render: (rowData) => rowData.date_of_invoicing ? rowData.date_of_invoicing: '-',
        },
        { title: "Zahlungseingang", field: "date_of_payment" },
        {
          title: "Betrag",
          field: "amount",
          type: "currency",
          currencySetting: { locale: "de", currencyCode: "EUR" },
        },
      ]}
      data={invoices}
      options={{
        actionsColumnIndex: -1,
        sorting: true,
        exportButton: true,
      }}
    />
  );
}

export default InvoiceTable;
