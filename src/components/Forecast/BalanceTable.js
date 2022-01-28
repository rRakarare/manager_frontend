import React from "react";
import { Table } from "semantic-ui-react";

function BalanceTable({ data }) {


  let sumCharges = 0

  const newData = data.map(item => ({...item, amount_per_month: parseFloat(item.amount_per_month)}))

  newData.forEach(item => {
      sumCharges += item.amount_per_month
  })

  const Data = newData.map((item) => {
    return (
        <Table.Row key={item.id}>
        <Table.Cell>{item.region}</Table.Cell>
        <Table.Cell>{item.amount_per_month.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Table.Cell>
        <Table.Cell>{parseFloat(item.amount_per_month/sumCharges * 100).toFixed(2) + " %"}</Table.Cell>
        </Table.Row>
    );
  });

  return (
    <Table basic="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Bereich</Table.HeaderCell>
          <Table.HeaderCell>Kosten / Monat</Table.HeaderCell>
          <Table.HeaderCell>Anteil [%]</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {Data}
      </Table.Body>
    </Table>
  );
}

export default BalanceTable;
