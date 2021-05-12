import React, { useState, useEffect } from "react";
import {
  Grid,
  Segment,
  Button,
  Statistic,
  Step,
  Icon,
  List,
  Item,
  Loader,
  Dimmer,
  Label,
  Popup,
} from "semantic-ui-react";
import axiosInstance from "../axios/axios";
import MaterialTable from "material-table";
var _ = require("lodash/core");

function ProjectDetail({ match }) {
  const projectID = match.params.id;
  const [data, setData] = useState({});
  const [status, setStatus] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const getProjectData = async () => {
    try {
      const res = await axiosInstance.get(`projects/${projectID}/`);
      setData(res.data);
    } catch (err) {
      return err.message;
    }
  };

  const getInvoice = async () => {
    try {
      const res = await axiosInstance.get("invoices", {
        params: {
          id: projectID,
        },
      });
      setInvoices(res.data);
    } catch (err) {
      return err.message;
    }
  };

  const getStatus = async () => {
    try {
      const res = await axiosInstance.get("status");
      setStatus(res.data);
    } catch (err) {
      return err.message;
    }
  };

  useEffect(() => {
    getProjectData();
    getStatus();
    getInvoice();
  }, []);

  useEffect(() => {
    console.log(invoices);
  }, [invoices, data]);

  const setNewStatus = async (id) => {
    try {
      const res = await axiosInstance.put(`projects/${projectID}/`, {
        status: id,
        title: data.title,
      });
      setData(res.data);
    } catch (err) {
      console.log(err.response);
      return err.message;
    }
  };

  const Steps = status.map((item) =>
    !_.isEmpty(data) ? (
      <Step
        key={item.id}
        completed={data.status >= item.order}
        active={data.status + 1 == item.order}
        onClick={() => setNewStatus(item.order)}
      >
        <Icon name={item.icontext} />
        <Step.Content>
          <Step.Title>{item.name}</Step.Title>
          <Step.Description>{item.subtext}</Step.Description>
        </Step.Content>
      </Step>
    ) : null
  );

  const date = new Date(data.created_at).toLocaleDateString("de", {
    hour: "numeric",
    minute: "numeric",
  });

  const Projekt = _.isEmpty(data) ? (
    <Dimmer active inverted>
      <Loader size="medium">Loading</Loader>
    </Dimmer>
  ) : (
    <Item>
      <Item.Content>
        <Item.Header style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
          {data.title}
        </Item.Header>
        <Item.Meta style={{ color: "grey", marginBottom: "1rem" }}>
          <span style={{ display: "block" }} className="cinema">
            <strong>Kunde: </strong>
            {data.client.name}
          </span>
          <span style={{ display: "block" }} className="cinema">
            <strong>Erstellt: </strong>
            {date}
          </span>
        </Item.Meta>

        <Item.Extra>
          <Button
            style={{ marginBottom: ".3rem" }}
            icon="edit"
            content="Bearbeiten"
          />
        </Item.Extra>
      </Item.Content>
    </Item>
  );

  const upDateInvoiceStatus = async (id, todo) => {
    try {
      const invoiceindex = invoices.findIndex((item) => item.id === id);
      const res = await axiosInstance.put(`invoices/${id}`, {
        ...invoices[invoiceindex],
        sent: todo == "sent" || todo == "got" ? true : false,
        got: todo == "got" ? true : false,
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

  const Invoice = _.isEmpty(data) ? (
    <Dimmer active inverted>
      <Loader size="medium">Loading</Loader>
    </Dimmer>
  ) : (
    <MaterialTable

      style={{boxShadow:'none'}}
      columns={[
        { title: 'Name', field: 'title' },
        { title: 'RN', field: 'invoice_number' },

      ]}
      data={invoices}        
      options={{
        sorting: true,
        showTitle: false,
        toolbar:false,
        pageSize: 4,
        pageSizeOptions : []
      }}
      
    />
  );

  return (
    <Grid stackable style={{ margin: "2rem" }} columns={3}>
      <Grid.Row style={{ minHeight: "343px" }} stretched>
        <Grid.Column computer={6} tablet={16}>
          <Segment>{Projekt}</Segment>
        </Grid.Column>
        <Grid.Column computer={6} tablet={16}>
          <Segment>{Invoice}</Segment>
        </Grid.Column>
        <Grid.Column computer={4} tablet={16}>
          <Step.Group fluid vertical>
            {Steps}
          </Step.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default ProjectDetail;
