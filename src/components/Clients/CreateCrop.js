import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import { Gluejar } from "@charliewilco/gluejar";
import { Slider } from "react-semantic-ui-range";
import { Segment, Button } from "semantic-ui-react";
import getCroppedImg from "../cropimage";
import { useAppStore } from "../../app.state";
import axiosInstance from "../../axios/axios";
import Cropper from "react-easy-crop";

function CreateCrop() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [cropImage, setCropImage] = useAppStore((state) => [
    state.cropImage,
    state.setCropImage,
  ]);

  const setCropModalOpen = useAppStore((state) => state.setCropModalOpen);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    const img = window.imageq;
    try {
      const cropImage = await getCroppedImg(img, croppedAreaPixels);
      setCropImage(cropImage);
      setCropModalOpen(false);
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

  return (
    <>
      <Gluejar onError={(err) => console.error(err)}>
        {({ images }) => {
          window.imageq = images.slice(-1);

          return (
            <>
              <Segment textAlign="center" compact style={{ padding: "1rem" }}>
                {images.length > 0 ? (
                  <>
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
                      <>
                        <Cropper
                          cropSize={{ width: 200, height: 200 }}
                          image={window.imageq}
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
                    </div>
                    <Button
                      style={{ marginTop: "1rem" }}
                      onClick={() => showCroppedImage()}
                    >
                      Cut Image
                    </Button>
                  </>
                ) : (
                  <div
                    style={{
                      height: "200px",
                      width: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h4>Paste Image</h4>
                  </div>
                )}
              </Segment>
            </>
          );
        }}
      </Gluejar>
    </>
  );
}

export default CreateCrop;
