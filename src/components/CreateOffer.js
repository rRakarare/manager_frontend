import React, { useEffect, useState } from "react";
import { Modal, Form, Dropdown, Input, Button } from "semantic-ui-react";
import { useAppStore } from "../app.state";
import WordTemplateReplace from "./WordTemplateReplace";
import axiosInstance from "../axios/axios";
import an_vorlage from "../vorlagen/an_vorlage.docx";

function CreateOffer() {
  const projectdata = useAppStore((state) => state.projectdata);
  const [createOfferModel, setCreateOfferModel] = useAppStore((state) => [
    state.createOfferModel,
    state.setCreateOfferModel,
  ]);

  const [crew, setCrew] = useState([]);
  const [artikel, setArtikel] = useState([]);
  const [skill, setSkill] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState([]);

  const today = new Date()
  const asd = today.setDate(today.getDate()+30)
  const dateTo = new Date(asd)

  const [data, setData] = useState({
    title: projectdata.title,
    place: projectdata.place,
    date: today.toLocaleDateString('de-DE'),
    dateTo: dateTo.toLocaleDateString('de-DE'),
    client_name: projectdata.client.name,
    client_image: {
      isImage: true,
      url: projectdata.client.image,
      width: 100,
      height: 100,
    },
    project_number: projectdata.project_number,
    project_numbers: projectdata.project_number,
  });

  const queryArtikels = async () => {
    try {
      const res = await axiosInstance.get("artikel/")
      setData(state => ({...state, ...res.data.find(item => item.id === projectdata.client.artikel)}))
    } catch(err) {
      console.log(err.response)
    }
  }

  const querySkills = async () => {
    try {
      const res = await axiosInstance.get("skill/");
      setSkill(res.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  const queryCrew = async () => {
    try {
      const res = await axiosInstance.get("crew/");
      setCrew(
        res.data.map((item) => {
          return {
            value: item.id,
            image: item.image,
            text: item.short,
            name: item.name,
            role: item.role,
            mobile: item.mobile,
          };
        })
      );
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    queryCrew();
    querySkills();
    queryArtikels()
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    console.log(skill);
  }, [skill]);

  useEffect(() => {
    const newData = crew.filter((item) => selectedCrew.includes(item.value));
    const rdyData = newData.map((item) => {
      return {
        crew_name: item.name,
        crew_role: item.role,
        crew_mobile: item.mobile,
        crew_image: { isImage: true, url: item.image, width: 120, height: 140 },
        crew_skills: skill.filter((e) => e.crew === item.value),
      };
    });
    setData((state) => ({ ...state, crew: rdyData }));
  }, [selectedCrew]);

  const dataold = {
    crew: [
      {
        name: "rene",
        laap: [{ short: "asd" }, { short: "qwe" }],
      },
      {
        name: "couti",
        laap: [{ short: "123" }, { short: "456" }],
      },
    ],
    qwe2: "Hello World",
  };

  return (
    <>
      <Modal.Header>
        Projekt: <span style={{ color: "red" }}>{projectdata.title}</span>
      </Modal.Header>
      <Modal.Content>
        <Form>
          {/* <Form.Field label="Title" control={Input} placeholder="Title" /> */}

          <Form.Field
            multiple
            selection
            control={Dropdown}
            label="Projektteam"
            fluid
            placeholder="Team auswählen"
            options={crew}
            value={selectedCrew}
            onChange={(e, { value }) => setSelectedCrew(value)}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setCreateOfferModel(false)}>
          Abbrechen
        </Button>
        <WordTemplateReplace
          filepath={an_vorlage}
          filename="asdqwe.docx"
          data={data}
          render={(generateDocument) => {
            return (
              <Button
                icon="file word"
                content="offer"
                color="blue"
                style={{ marginBottom: ".3rem" }}
                onClick={() => generateDocument()}
              />
            );
          }}
        />
      </Modal.Actions>
    </>
  );
}

export default CreateOffer;
