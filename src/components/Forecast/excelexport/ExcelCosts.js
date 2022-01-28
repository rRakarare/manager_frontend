import React from 'react'
import {Button} from "semantic-ui-react"

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


function ExcelCosts({data}) {




    return (
        <ExcelFile element={<Button icon="file excel" label="Kosten" />}>
            <ExcelSheet data={data} name="Kosten">
                <ExcelColumn label="Bereich" value="region"/>
                <ExcelColumn label="Kosten p.m. [€]" value="amount_per_month"/>
            </ExcelSheet>
        </ExcelFile>
    );
}

export default ExcelCosts
