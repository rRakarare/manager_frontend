import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import axiosInstance from "../axios/axios";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useAuth();
  const history = useHistory();

  const login = async () => {
    try {
      const res = await axiosInstance.post("token", {
        username,
        password,
      });
      if (res.status === 200) {
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        axiosInstance.defaults.headers["Authorization"] =
          "JWT " + localStorage.getItem("access_token");
        setStatus(true);
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          UBCDATA Log-in to your account
        </Header>
        <Form size="large">
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={() => login()} color="teal" fluid size="large">
            Login
          </Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default LoginForm;
