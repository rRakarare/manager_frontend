import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Dropdown } from "semantic-ui-react";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../app.state";
import NumberFormat from "react-number-format";

function EditInvoice({ invoiceID }) {
  const invoices = useAppStore((state) => state.invoices);
  const invoice = invoices.find((item) => item.id === invoiceID);
  const [invoiceNumber, setInvoiceNumber] = useState({});
  const [newdata, setNewdata] = useState({ ...invoice });
  const [error] = useState({});
  const setInvoiceEditModel = useAppStore((state) => state.setInvoiceEditModel);

  const invoiceStati = useAppStore((state) => state.invoiceStati);

  const putInvoice = async () => {
    try {
      if (newdata.status === 2 && invoice.invoice_number === null) {
        const number =
          invoiceNumber.number.toString().length < 4
            ? "0" + invoiceNumber.number
            : `${invoiceNumber.number}`;
        const uniqnumber = `${invoiceNumber.short}-${invoiceNumber.year}-${number}`;

        await axiosInstance.put(`invoices/${invoice.id}`, {
          ...newdata,
          invoice_number: uniqnumber,
        });
        await axiosInstance.put(`invoice-number/${invoiceNumber.id}/`, {
          ...invoiceNumber,
          number: invoiceNumber.number + 1,
        });
      } else {
        await axiosInstance.put(`invoices/${invoice.id}`, {
          ...newdata,
          invoice_number: invoice.invoice_number,
        });
      }
    } catch (err) {
      console.log(err.response);
    }
    setInvoiceEditModel(false);
  };

  const getInvoiceNumber = async () => {
    try {
      const res = await axiosInstance.get("/invoice-number/");
      const data = res.data[0];
      setInvoiceNumber(data);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    getInvoiceNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <>
      <Modal.Header>Rechnung Bearbeiten</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field
            label="Rechnungsname"
            control={Input}
            value={newdata.title}
            error={error.name && { content: error.name, pointing: "below" }}
            onChange={(e) =>
              setNewdata((state) => ({ ...state, title: e.target.value }))
            }
            placeholder="Title"
          />

          <Form.Field>
            <label>Rechnungsbetrag</label>
            <NumberFormat
              placeholder="Betrag in € (netto)"
              value={newdata.amount}
              onValueChange={(values) => {
                console.log(values);
                const { value } = values;
                setNewdata((state) => ({ ...state, amount: value }));
              }}
              isNumericString={true}
              decimalScale={2}
              thousandSeparator={"."}
              decimalSeparator={","}
              prefix={"€ "}
              customInput={Input}
            />
          </Form.Field>

          <Form.Field
            selection
            label="Status"
            control={Dropdown}
            value={newdata.status}
            error={
              error.project_type && {
                content: error.project_type,
                pointing: "below",
              }
            }
            onChange={(e, result) =>
              setNewdata((state) => ({ ...state, status: result.value }))
            }
            fluid
            placeholder="Projekttyp wählen"
            options={invoiceStati}
          />

          <Form.Field
            label="Rechnungsstellung"
            control={Input}
            disabled={newdata.status === 1 ? true : false}
            value={newdata.date_of_invoicing}
            error={error.name && { content: error.name, pointing: "below" }}
            onChange={(e) =>
              setNewdata((state) => ({
                ...state,
                date_of_invoicing: e.target.value,
              }))
            }
            placeholder="Title"
            type="date"
          />

          <Form.Field
            label="Vorraussichtlicher Zahlungseingang"
            control={Input}
            value={newdata.date_of_payment}
            error={error.name && { content: error.name, pointing: "below" }}
            onChange={(e) =>
              setNewdata((state) => ({
                ...state,
                date_of_payment: e.target.value,
              }))
            }
            placeholder="Title"
            type="date"
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setInvoiceEditModel(false)}>
          Disagree
        </Button>
        <Button positive onClick={() => putInvoice()}>
          Agree
        </Button>
      </Modal.Actions>
    </>
  );
}

export default EditInvoice;
