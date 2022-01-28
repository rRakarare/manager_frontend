import React, {useEffect} from "react";
import { Step, Icon } from "semantic-ui-react";
import axiosInstance from "../../axios/axios";
import { useAppStore } from "../../app.state";

var _ = require("lodash/core");

function ProjectSteps({ projectID }) {
  const [projectdata, setProjectdata] = useAppStore((state) => [
    state.projectdata,
    state.setProjectdata,
  ]);
  const [projectsteps, setProjectsteps] = useAppStore((state) => [
    state.projectsteps,
    state.setProjectsteps,
  ]);

  const getStatus = async () => {
    try {
      const res = await axiosInstance.get("status");
      setProjectsteps(res.data);
    } catch (err) {
      return err.message;
    }
  };

  const setNewStatus = async (id) => {
    try {
      const res = await axiosInstance.put(`projects/${projectID}/`, {
        status: id,
        title: projectdata.title,
        project_number: projectdata.project_number,
      });
      setProjectdata(res.data);
    } catch (err) {
      console.log(err.response);
      return err.message;
    }
  };

  const Steps = projectsteps.map((item) =>
    !_.isEmpty(projectdata) ? (
      <Step
        key={item.id}
        completed={projectdata.status === 6 ? false : projectdata.status >= item.order ? true : false}
        active={projectdata.status < 5 ? projectdata.status + 1 === item.order : projectdata.status >= 5 && item.order >= 5 && projectdata.status === item.order ? true : false}
        onClick={() => {
          setNewStatus(item.order)
        }}
      >
        <Icon name={item.icontext} color={projectdata.status === 6 && item.order === 6 ? "red" : "black"} />
        <Step.Content>
          <Step.Title>{item.name}</Step.Title>
          <Step.Description>{item.subtext}</Step.Description>
        </Step.Content>
      </Step>
    ) : null
  );

  useEffect(() => {
    getStatus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{Steps}</>;
}

export default ProjectSteps;
