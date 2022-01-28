import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input } from "semantic-ui-react";
import { useAppStore } from "../../app.state";
import NumberFormat from "react-number-format";
import axiosInstance from "../../axios/axios";

function CreateInvoice() {
  const [newdata, setNewdata] = useState({});
  const [error, setError] = useState({});

  const setInvoiceCreateModel = useAppStore(
    (state) => state.setInvoiceCreateModel
  );

  const projectdata = useAppStore((state) => state.projectdata);

  const postInvoice = async () => {
    try {
      const res = await axiosInstance.post("/invoices/", {
        ...newdata,
        project: projectdata.id,
        status: 1,
      });
      console.log(res.data);
      setInvoiceCreateModel(false);
    } catch (err) {
      console.log(err.response);
      setError(err.response.data);
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal.Header>Neue Rechnung</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field
            label="Rechnungsname"
            control={Input}
            error={error.title && { content: error.title, pointing: "below" }}
            onChange={(e) =>
              setNewdata((state) => ({ ...state, title: e.target.value }))
            }
            placeholder="Title"
          />

          <Form.Field
            error={error.amount && { content: error.amount, pointing: "below" }}
          >
            <label>Rechnungsbetrag</label>
            <NumberFormat
              placeholder="Betrag in € (netto)"
              value={newdata.amount}
              onValueChange={(values) => {
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
            label="Vorraussichtliche Rechnungsstellung"
            control={Input}
            error={
              error.date_of_payment && {
                content: error.date_of_payment,
                pointing: "below",
              }
            }
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
        <Button negative onClick={() => setInvoiceCreateModel(false)}>
          Disagree
        </Button>
        <Button positive onClick={() => postInvoice()}>
          Agree
        </Button>
      </Modal.Actions>
    </>
  );
}

export default CreateInvoice;
