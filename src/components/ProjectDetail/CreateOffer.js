import React, { useEffect, useState } from "react";
import { Modal, Form, Dropdown, Input, Button } from "semantic-ui-react";
import NumberFormat from "react-number-format";
import { useAppStore } from "../../app.state";
import WordTemplateReplace from "../WordTemplateReplace";
import axiosInstance from "../../axios/axios";

function CreateOffer() {
  const projectdata = useAppStore((state) => state.projectdata);
  const honorar = useAppStore((state) => state.projectHonorar);
  const setCreateOfferModel = useAppStore((state) => state.setCreateOfferModel);

  const [crew, setCrew] = useState([]);
  const [skill, setSkill] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState([]);
  const [art, setArt] = useState();
  const [modal, setModal] = useState();
  const [code, setCode] = useState();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState({});

  const today = new Date();
  const asd = new Date().setDate(today.getDate() + 30);
  const dateTo = new Date(asd);

  const suply = 350;

  const [data, setData] = useState({
    title: projectdata.title,
    place: projectdata.place,
    date: today.toLocaleDateString("de-DE"),
    dateTo: dateTo.toLocaleDateString("de-DE"),
    client_name: projectdata.client.name,
    client_image: {
      isImage: true,
      url: projectdata.client.image,
      width: 100,
      height: 100,
    },
    project_number: projectdata.project_number,
    project_numbers: projectdata.project_number,
    honorar,
    honorarstring: honorar.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    }),
    suply: suply,
    suplystring: suply.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    }),
  });

  const queryTemplates = async () => {
    try {
      const res = await axiosInstance.get("templates/");
      setTemplates(
        res.data.map((item) => ({
          value: item.id,
          text: item.name,
          code: item.code,
          template: item.template,
        }))
      );
    } catch (err) {
      console.log(err.response);
    }
  };

  const queryArtikels = async () => {
    try {
      const res = await axiosInstance.get("artikel/");
      setData((state) => ({
        ...state,
        ...res.data.find((item) => item.id === projectdata.client.artikel),
      }));
    } catch (err) {
      console.log(err.response);
    }
  };

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
    queryArtikels();
    queryTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCrew]);

  return (
    <>
      <Modal.Header>
        Projekt: <span style={{ color: "red" }}>{projectdata.title}</span>
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field
            selection
            control={Dropdown}
            label="Projektart"
            fluid
            placeholder="Art auswählen"
            options={templates}
            value={art}
            onChange={(e, { value, code }) => {
              setCode(e.target.getAttribute("code"));
              setArt(value);
              setSelectedTemplate(
                templates.find((item) => item.value === value)
              );
            }}
          />

          <Form.Field>
            <label>Honorar</label>
            <NumberFormat
              placeholder="Betrag in € (netto)"
              value={data.honorar}
              onValueChange={(values) => {
                console.log(values);
                const { value, floatValue } = values;
                setData((state) => ({
                  ...state,
                  honorar: value,
                  honorarstring:
                    floatValue &&
                    floatValue.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }),
                }));
              }}
              isNumericString={true}
              decimalScale={2}
              thousandSeparator={"."}
              decimalSeparator={","}
              prefix={"€ "}
              customInput={Input}
            />
          </Form.Field>

          <Form.Field>
            <label>Reisekosten</label>
            <NumberFormat
              placeholder="Betrag in € (netto)"
              value={data.suply}
              onValueChange={(values) => {
                const { value, floatValue } = values;
                setData((state) => ({
                  ...state,
                  suply: value,
                  suplystring:
                    floatValue &&
                    floatValue.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }),
                }));
              }}
              isNumericString={true}
              decimalScale={2}
              thousandSeparator={"."}
              decimalSeparator={","}
              prefix={"€ "}
              customInput={Input}
            />
          </Form.Field>
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
          <Form.Field
            selection
            control={Dropdown}
            label="Zahlung"
            fluid
            placeholder="Zahlungsmodalität auswählen"
            options={[
              {
                value: 0,
                text: "Rein netto, 14 Tage nach Rechnungseingang.",
              },
              {
                value: 1,
                text: "50% des Honorars werden nach Erstellung der Vergabeunterlagen, die verbleibenden 50% bei Projektabschluss (Zuschlagserteilung) berechnet. Rein netto, 14 Tage nach Rechnungseingang.",
              },
              {
                value: 2,
                text: "50% des Honorars werden nach Fertigstellung der IST-Analyse, die verbleibenden 50% bei Projektabschluss berechnet. Rein netto, 14 Tage nach Rechnungseingang.",
              },
            ]}
            value={modal}
            onChange={(e, { value }) => {
              setModal(value);
              setData((state) => ({
                ...state,
                modalstring: e.target.innerText,
              }));
            }}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setCreateOfferModel(false)}>
          Abbrechen
        </Button>
        <WordTemplateReplace
          filepath={selectedTemplate.template}
          filename={`Angebot-${code}-${projectdata.project_number}.docx`}
          data={data}
          render={(generateDocument) => {
            return (
              <Button
                disabled={
                  code != null && selectedCrew.length > 0 && modal != null
                    ? false
                    : true
                }
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
