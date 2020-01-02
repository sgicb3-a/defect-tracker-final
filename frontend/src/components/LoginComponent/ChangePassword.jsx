import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Axios from "axios";
import { EMPLOYEE_BASE_URL, APP_BASE_URL } from "../../api";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const divStyle = {
  marginRight: "200px",
  marginLeft: "230px",
  marginTop: "40px"
};

export default function ChangePassword() {
  const classes = useStyles();
  const urlParams = new URLSearchParams(window.location.search);
  const eid = urlParams.get("id");
  const [showResult, setShowResult] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [values, setValues] = React.useState({
    id: eid,
    password: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (values.newPassword === values.confirmPassword) {
      Axios.put(`${EMPLOYEE_BASE_URL}/employee/password`, values)
        .then(response => {
          console.log(response);
          setShowResult("alert alert-success");
          setMessage(response.data.message);
          window.location.href = `${APP_BASE_URL}`;
        })
        .catch(error => {
          console.log(error);
          setShowResult("alert alert-danger");
          setMessage(
            error.response ? error.response.data.message : "Failed to Update!"
          );
        });
    } else {
      alert("New and Confirm Passwords do not Match!!");
    }
  };

  return (
    <div>
      <div style={divStyle} className={showResult} role="alert">
        {message}
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              id="temp-pw"
              label="Temporary Password"
              className={classes.textField}
              value={values.password}
              onChange={handleChange("password")}
              type="password"
              margin="normal"
              variant="outlined"
            />
            <TextField
              required
              fullWidth
              id="new-pw"
              label="New Password"
              className={classes.textField}
              value={values.newPassword}
              onChange={handleChange("newPassword")}
              type="password"
              margin="normal"
              variant="outlined"
            />
            <TextField
              required
              fullWidth
              id="verify-pw"
              label="Confirm Password"
              className={classes.textField}
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              type="password"
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
