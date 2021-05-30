import React, { useState } from "react";
import { Modal, Button, Input, Image, Form } from "semantic-ui-react";
import axios from "axios";
import convert from "image-file-resize";
import axiosInstance from "../axios/axios";
import { useAppStore } from "../app.state";

import CreateCrop from "./CreateCrop";

function CreateClient() {
  const [cropModalOpen, setCropModalOpen] = useAppStore((state) => [
    state.cropModalOpen,
    state.setCropModalOpen,
  ]);
  const [clientName, setClientName] = useState("");
  const [error, setError] = useState({});
  const cropImage = useAppStore((state) => state.cropImage);
  const setOpenClient = useAppStore((state) => state.setOpenClient);

  const postClient = async () => {
    console.log(cropImage);
    try {
      let formData = new FormData();
      if (cropImage != null) {
        const image = await fetch(cropImage)
          .then((r) => r.blob())
          .then(
            (blobFile) =>
              new File([blobFile], `${clientName}.png`, { type: "image/png" })
          );

        const resizedImage = await convert({
          file: image,
          width: 300,
          height: 300,
          type: "png",
        });
        formData.append("image", resizedImage);
      }
      formData.append("name", clientName);
      await axiosInstance.post("/kunden/", formData);

      setOpenClient(false);
    } catch (err) {
      console.log(err);
      setError(err.response.data);
    }
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
        <Form>
          <Form.Field
            onChange={(e) => setClientName(e.target.value)}
            control={Input}
            error={error.name && { content: error.name, pointing: "below" }}
            placeholder="Name"
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
