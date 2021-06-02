import React, {useState, useEffect} from 'react'
import { Modal, Button, Form, Dropdown,Input } from "semantic-ui-react";
import axiosInstance from '../axios/axios'
import { useAppStore } from "../app.state";
import axios from 'axios';

function CreateProject() {

    const [newdata, setNewdata] = useState({})
    const [clients, setClients] = useState([])
    const [types, setTypes] = useState([])
    const [error, setError] = useState({})
    const setProjectModalOpen = useAppStore(state => state.setProjectModalOpen)

    const AddProject = async () => {
        try {


          const res = await axiosInstance.post('/addProject/',{...newdata, status:1})
          setProjectModalOpen(false)
    
        } catch(err) {
          console.log(err.response)
          setError(err.response.data)
        }
      }
    
      const queryClients = async () => {
        try {
          const res = await axiosInstance.get('/clients/')
          setClients(res.data.map(item => {
            return {
              value : item.id,
              image : item.image,
              short : item.short,
              text:item.name
            }
          }))
        } catch(err) {
          console.log(err.response)
        }
      }

      const queryTypes = async () => {
        try {
          const res = await axiosInstance.get('/types/')
          console.log(res)
          setTypes(res.data.map(item => {
            return {
              value : item.id,
              text: item.name,
              short: item.short
            }
          }))
        } catch(err) {
          console.log(err.response)
        }
      }

      useEffect(() => {
        queryClients()
        queryTypes()
      }, [])


    return (
        <>
        <Modal.Header>Neues Projekt</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field
              label="Title"
              control={Input}
              error={error.name && {content:error.name, pointing:"below"}}
              onChange={(e)=>setNewdata(state => ({...state, title:e.target.value}))}
              placeholder="Title"
            />


            <Form.Field
            selection
              label="Typ"
              control={Dropdown}
              error={error.project_type && {content:error.project_type,pointing:"below"}}
              onChange={(e, result)=>setNewdata(state => ({...state, project_type:result.value}))}
              fluid placeholder='Projekttyp wählen' options={types}
            />


            <Form.Field
            search
            selection
            control={Dropdown}
            label="Kunde"
            error={error.client && {content:error.client,pointing:"below"}}
            onChange={(e, result)=>setNewdata(state => ({...state, client:result.value}))}
            fluid placeholder='Kunde auswählen' options={clients}
            />


          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setProjectModalOpen(false)}>
            Abbrechen
          </Button>
          <Button positive onClick={() => AddProject()}>
            Projekt anlegen
          </Button>
        </Modal.Actions></>
    )
}

export default CreateProject
