import React, { useEffect, useState } from 'react'
import {Button} from "semantic-ui-react"
import axiosInstance from "../../../axios/axios"

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;




function ExcelExport({data}) {

    const [invStatus, setInvStatus] = useState([]);

    const queryStatus = async () => {
        try {
            const res = await axiosInstance.get("/invoicestatus")
            setInvStatus(res.data)
        } catch(err) {
            return err.message
        }

    }

    useEffect(() => {
        queryStatus()
    }, [])

    useEffect(() => {
        console.log("asdasdasd",invStatus)
    }, [invStatus])



    const newData = data.map(item => {

        const invoiceString = item.invoices.map(item => item.id)

        return {
            ...item,
            invs: invoiceString.join(),
        }
    })

    useEffect(()=> {
        console.log("neuedaten",newData)
    },[data])

    let invoices_data = []
    let project_data = []

    useEffect(()=> {
        data.forEach(item => {
            if (item.invoices.length > 0) {
                item.invoices.forEach(inv => {
                    invoices_data.push({...inv, project_id: inv.project.id, status: invStatus.find(e => e.id === inv.status).name})
                })
            }
        })

        data.forEach(item => {
            if (item.invoices.length > 0) {
                item.invoices.forEach(inv => {
                    project_data.push({...inv.project,client_name: inv.project.client.name, project_status: inv.project.status.name})
                })
            }
        })

        project_data = [...new Set(project_data)]
        
    },[data,invStatus])

    
    

    useEffect(()=> {
        console.log("invs",invoices_data)
    },[invoices_data])

    

    

    

    useEffect(()=> {
        console.log("projs",project_data)
    },[project_data])

    const today = new Date().toLocaleDateString("de-DE")

    return (
        <ExcelFile element={<Button icon="file excel" label="Forecast" />} filename={`Forecast (${today})`}>
            <ExcelSheet data={newData} name="Forecast">
                <ExcelColumn label="Monat" value="date"/>
                <ExcelColumn label="Kosten p.m. [€]" value="costs"/>
                <ExcelColumn label="Einkommen p.m. [€]" value="income"/>
                <ExcelColumn label="Stand [€]" value="balance"/>
                <ExcelColumn label="Rechnungen [ID's]" value="invs"/>
            </ExcelSheet>
            <ExcelSheet data={invoices_data} name="Rechnungen">
                <ExcelColumn label="ID" value="id"/>
                <ExcelColumn label="Rechnungsname" value="title"/>
                <ExcelColumn label="Rechnungsnummer" value="invoice_number"/>
                <ExcelColumn label="Betrag [netto]" value="amount"/>
                <ExcelColumn label="Rechnungsstellung" value="date_of_invoicing"/>
                <ExcelColumn label="Status" value="status"/>
                <ExcelColumn label="Projekt ID" value="project_id"/>
            </ExcelSheet>
            <ExcelSheet data={project_data} name="Projekte">
                <ExcelColumn label="ID" value="id"/>
                <ExcelColumn label="Projektnamme" value="title"/>
                <ExcelColumn label="Projektnummer" value="project_number"/>
                <ExcelColumn label="Typ" value="project_type"/>
                <ExcelColumn label="Kunde" value="client_name"/>
                <ExcelColumn label="Status" value="project_status"/>
            </ExcelSheet>
        </ExcelFile>
    );
}

export default ExcelExport
