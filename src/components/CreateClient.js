import React, { useState } from "react";
import {

  Modal,

  Button,
  Input,
  Image,
} from "semantic-ui-react";
import axios from "axios";
import convert from 'image-file-resize';
import axiosInstance from "../axios/axios";
import { useAppStore } from "../app.state";

import CreateCrop from "./CreateCrop";

function CreateClient() {
  const [cropModalOpen, setCropModalOpen] = useAppStore((state) => [
    state.cropModalOpen,
    state.setCropModalOpen,
  ]);
  const [clientName, setClientName] = useState("");
  const cropImage = useAppStore((state) => state.cropImage);
  const setOpenClient = useAppStore((state) => state.setOpenClient);

  const postClient = async () => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const URL = "http://127.0.0.1:8000/api/kunden/";
    const image = await fetch(cropImage)
      .then((r) => r.blob())
      .then(
        (blobFile) => new File([blobFile], `${clientName}.png`, { type: "image/png" })
      );

    const resizedImage = await convert({ 
        file: image,  
        width: 300, 
        height: 300, 
        type: 'png'
        })

    try {
      let formData = new FormData();
      formData.append("image", resizedImage);
      formData.append("name", clientName);
      await axiosInstance.post('/kunden/', formData);

      setOpenClient(false)
    } catch (err) {
      console.log(err.response);
    }
  };

  const addClient = () => {
    postClient();
  };

  return (
    <div>
      <div style={{ width: "250px" }}>
        <Image
          
          fluid
          src={
            cropImage
              ? cropImage
              : "https://react.semantic-ui.com/images/wireframe/image.png"
          }
          onClick={() => setCropModalOpen(true)}
          style={{ cursor: "pointer", padding: "1rem" }}
        />
        <Input
          onChange={(e) => setClientName(e.target.value)}
          fluid
          placeholder="Name"
        />
        <Button
          onClick={addClient}
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
