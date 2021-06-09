import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Dropdown } from "semantic-ui-react";
import axiosInstance from "../axios/axios";
import { useAppStore } from "../app.state";
import NumberFormat from "react-number-format";

function EditInvoice({ invoiceID }) {
  const invoices = useAppStore((state) => state.invoices);
  const invoice = invoices.find((item) => item.id === invoiceID);
  
  const [newdata, setNewdata] = useState({ ...invoice });
  const [error, setError] = useState({});
  const [invoiceEditModel, setInvoiceEditModel] = useAppStore((state) => [
    state.invoiceEditModel,
    state.setInvoiceEditModel,
  ]);

  const [invoiceStati, setInvoiceStati] = useState([])

  const getInvoiceStati = async () => {
    try {
      const res = await axiosInstance.get('/invoicestatus/')
      setInvoiceStati(res.data.map(item => ({
        value:item.id,
        text: item.name,
        icon: item.icontext
      })))
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getInvoiceStati()
  }, []);

  useEffect(() => {
    console.log(invoiceStati);
    console.log(invoice);
  }, [invoiceStati]);

  return (
    <>
      <Modal.Header>Neue Rechnung</Modal.Header>
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
                const { formattedValue, value } = values;
                setNewdata((state) => ({ ...state, amount: value }));
              }}
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
        <Button negative onClick={()=>setInvoiceEditModel(false)}>Disagree</Button>
        <Button positive>Agree</Button>
      </Modal.Actions>
    </>
  );
}

export default EditInvoice;
