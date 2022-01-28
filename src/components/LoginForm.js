import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
} from "semantic-ui-react";
import jwtDecode from "jwt-decode";
import axiosInstance from "../axios/axios";
import { useHistory } from "react-router-dom";
import { useAppStore } from '../app.state'

function LoginForm() {

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL)
    console.log(process.env.REACT_APP_TEST)
    console.log(process.env.NODE_ENV)
  }, [])

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const setAuth = useAppStore(state=>state.setAuth)

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
        const name = jwtDecode(res.data.access).name
        localStorage.setItem("profile_name", name);
        setAuth(true);
        history.push("/")
        
      }
    } catch (err) {
      console.log(err.response.data);
      setError(err.response.data);
    }
  };




  return (
    <Grid textAlign="center" style={{ height: "80%", maxWidth:"100%" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 420 }}>
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
            error={error.detail && {content:error.detail}}
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
