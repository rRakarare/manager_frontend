import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import { Gluejar } from "@charliewilco/gluejar";
import { Slider } from "react-semantic-ui-range";
import { Segment, Button } from "semantic-ui-react";
import getCroppedImg from "../components/cropimage";
import axiosInstance from "../axios/axios";
import Cropper from "react-easy-crop";

function CreateClient() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const asdqwe = useRef();

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    const img = asdqwe.current.imageRef.currentSrc;
    try {
      const croppedImage = await getCroppedImg(img, croppedAreaPixels);
      console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  const settings = {
    start: 0,
    min: 0,
    max: 3,
    step: 0.01,
    onChange: (value) => {
      setZoom(value);
    },
  };

  const postIt = async () => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const URL = "http://127.0.0.1:8000/api/kunden/";
    const asd = new File([asdqwe], "name.png", { type: "image/png" });
    console.log(asd);
    try {
      let formData = new FormData();
      formData.append("image", asd);
      formData.append("name", "yolo");
      const res = await axios.post(URL, formData, config);
      console.log(res);
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <>
      <Gluejar onError={(err) => console.error(err)}>
        {({ images }) => {
          const image = images.slice(-1);

          return (
            <>
              <Segment textAlign="center" compact style={{ padding: "1rem" }}>
                <Slider
                  style={{ marginBottom: "1rem" }}
                  value={zoom}
                  color="red"
                  settings={settings}
                />
                <div
                  style={{
                    position: "relative",
                    height: "250px",
                    width: "250px",
                  }}
                >
                  {images.length > 0 ? (
                    <>
                      <Cropper
                        ref={asdqwe}
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        min={1}
                        max={3}
                        restrictPosition={false}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                      />
                    </>
                  ) : null}
                </div>
                <Button
                  style={{ marginTop: "1rem" }}
                  onClick={() => showCroppedImage()}
                >
                  Cut Image
                </Button>
              </Segment>
              <button onClick={() => postIt()}>Post</button>

              <img src={croppedImage}></img>
            </>
          );
        }}
      </Gluejar>
    </>
  );
}

export default CreateClient;
