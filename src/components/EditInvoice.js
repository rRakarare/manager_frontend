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

  const [invoiceStati, setInvoiceStati] = useAppStore((state) => [
    state.invoiceStati,
    state.setInvoiceStati,
  ]);

  const putInvoice = async () => {
    try {
      const res = await axiosInstance.put(`invoices/${invoice.id}`, {...newdata})
      console.log(res.data)
    } catch(err) {
      console.log(err.response)
    }
    setInvoiceEditModel(false)
  }
  

  useEffect(() => {
    console.log(newdata);
  }, [newdata]);


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
                console.log(values)
                const { formattedValue, value } = values;
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
        <Button positive onClick={()=>putInvoice()}>Agree</Button>
      </Modal.Actions>
    </>
  );
}

export default EditInvoice;
