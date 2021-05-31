import React, { useState, useEffect } from 'react'
import {
    Portal, Button, Segment, Header
  } from "semantic-ui-react";

import axios from 'axios';
import axiosInstance from "../axios/axios";
import { useAppStore } from '../app.state'
import CreateClient from '../components/CreateClient'
import ClientTable from '../components/ClientTable'

function ClientScreen() {


    const [data, setData] = useState([])
    const clientImage = useAppStore(state=>state.cropImage)
    const [openClient, setOpenClient] = useAppStore((state) => [
        state.openClient,
        state.setOpenClient,
      ]);

    const getClients = async () => {
        try{
            const res = await axiosInstance.get('/clients/')
            setData(res.data)
        } catch(err) {
            console.log(err.response)
        }
    }

    

    useEffect(() => {
        getClients()
    }, [openClient])


    return (
        <div>
            <ClientTable data={data}/>
            <Portal open={openClient}>
            <Segment
              style={{
                left: 0,
                right: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'fixed',
                width: "280px",
                top: '20%',
                zIndex: 1000,
              }}
            >
              <Header>Neuen Kunden anlegen</Header>
              <CreateClient/>

              <Button
              style={{marginTop:".5rem"}}
                fluid
                content='Abbrechen'
                negative
                onClick={()=>setOpenClient(false)}
              />
            </Segment>
          </Portal>
        </div>
    )
}

export default ClientScreen
