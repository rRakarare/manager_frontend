import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Image, Form, Dropdown } from "semantic-ui-react";
import convert from "image-file-resize";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../app.state";
import sample from '../../images/sample.svg'

import CreateCrop from "./CreateCrop";

function CreateClient() {
  const [cropModalOpen, setCropModalOpen] = useAppStore((state) => [
    state.cropModalOpen,
    state.setCropModalOpen,
  ]);
  const [clientName, setClientName] = useState("");
  const [clientShort, setClientShort] = useState("");
  const [error, setError] = useState({});
  const cropImage = useAppStore((state) => state.cropImage);
  const setOpenClient = useAppStore((state) => state.setOpenClient);
  const [artikels, setArtikels] = useState([])
  const [clientArtikel, setClientArtikel] = useState()

  const getArtikels = async () => {
    try {
      const res = await axiosInstance.get('/artikel/')
      console.log(res.data)
      setArtikels(res.data)

    } catch(err) {
      console.log(err)
    }
  }

  const postClient = async () => {
    console.log(cropImage);
    try {
      let formData = new FormData();
      if (cropImage != null) {
        const image = await fetch(cropImage)
          .then((r) => r.blob())
          .then(
            (blobFile) =>
              new File([blobFile], `${clientName.replace('.','-').replace(' ', '-')}.jpeg`, { type: "image/jpeg" })
          );

        const resizedImage = await convert({
          file: image,
          width: 300,
          height: 300,
          type: "jpeg",
        });
        formData.append("image", resizedImage);
      }
      formData.append("name", clientName);
      formData.append("short", clientShort);
      formData.append("artikel", clientArtikel);
      await axiosInstance.post("/kunden/", formData);

      setOpenClient(false);
    } catch (err) {
      console.log(err.response);
      setError(err.response.data);
    }
  };

  useEffect(() => {
    getArtikels()
  }, [])

  return (
    <div>
      <div style={{ width: "250px" }}>
        <Image
          fluid
          src={
            cropImage
              ? cropImage
              : sample
          }
          onClick={() => setCropModalOpen(true)}
          style={{ cursor: "pointer", padding: "1rem" }}
        />
        <Form>
          <Form.Field
            onChange={(e) => setClientName(e.target.value)}
            value={clientName}
            control={Input}
            error={error.name && { content: error.name, pointing: "below" }}
            placeholder="Name"
          />
          <Form.Field
            onChange={(e) => setClientShort(e.target.value)}
            value={clientShort}
            control={Input}
            error={error.short && { content: error.short, pointing: "below" }}
            placeholder="K??rzel (max. 5 Characters)"
          />
          <Form.Field
            selection
            control={Dropdown}
            error={
              error.artikel && {
                content: 'Artikel w??hlen',
                pointing: "below",
              }
            }
            onChange={(e, result) =>
              setClientArtikel(result.value)
            }
            fluid
            placeholder="Artikel (z.B. das Klinikum)"
            options={artikels.map(item => ({
              value:item.id,
              text:item.nominativ
            }))}
          />
        </Form>
        <Button
          onClick={() => postClient()}
          style={{ display: "block", width: "100%", marginTop: ".5rem" }}
          content="Erstellen"
        />
      </div>
      <Modal
        size="mini"
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
      >
        <Modal.Header>Trim Image</Modal.Header>
        <Modal.Content
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CreateCrop />
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default CreateClient;
