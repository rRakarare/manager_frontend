import React from 'react'
import MaterialTable from 'material-table';

function Table( {data, isLoading}) {
    console.log(data)
    const tableData = data.map(item => {
        return {
            title:item.title,
            client:item.client.name
        }
    })
    return (
        <MaterialTable
            isLoading={isLoading}
            title="Projektliste"
            columns={[
                { title: 'Titel', field: 'title' },
                { title: 'Kunde', field: 'client' },

            ]}
            data={tableData}        
            options={{
                sorting: true,
                exportButton: true
                
            }}
            />
    )
}

export default Table
