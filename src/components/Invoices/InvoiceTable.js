import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import axiosInstance from "../../axios/axios";

function InvoiceTable() {
  const [invoices, setInvoices] = useState([]);

  const queryInvoices = async () => {
    try {
      const res = await axiosInstance.get("invoicesall/");
      setInvoices(res.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    queryInvoices();
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
          title: "Rechnungsstellung",
          field: "date_of_invoicing",
          render: (rowData) => rowData.date_of_invoicing,
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
