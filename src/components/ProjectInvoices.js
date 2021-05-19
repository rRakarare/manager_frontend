import React, { useState, useEffect } from "react";
import { Icon, Dimmer, Loader, Popup } from "semantic-ui-react";
import MaterialTable from "material-table";
import axiosInstance from "../axios/axios";
import { useAppStore } from "../app.state";
var _ = require("lodash/core");

function ProjectInvoices({projectID}) {

  const [invoices, setInvoices] = useState([]);

  const getInvoice = async () => {
    try {
      const res = await axiosInstance.get("invoices", {
        params: {
          id: projectID,
        },
      });
      setInvoices(res.data);
      console.log(res)
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
      console.log(err.response);
      return err.message;
    }
  };

  useEffect(() => {
    getInvoice()
  }, [])

  return invoices == [] ? (
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
        { title: "Datum", field: "date_of_payment", type: "date" },
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
          onClick: () => {},
        },
        {
          icon: "delete",
          color: "red",
          tooltip: "Rechnung löschen",
          onClick: () => {},
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
                    props.action.icon == "circle"
                      ? encode[props.data.status]
                      : props.action.icon
                  }
                  onClick={(event) => props.action.onClick(event, props.data)}
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
  );
}

export default ProjectInvoices;
