import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Axios from "axios";
import { DEFECT_BASE_URL } from "../../../../api";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  textField: {
    marginRight: theme.spacing(3),
    width: "250px"
  },
  input: {
    display: "none"
  },
  table: {
    minWidth: 700
  },
  buttonCustom: {
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(2),
    width: "250px",
    height: "56px"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    width: "120px"
  }
}));

const divStyle = {
  marginRight: "22px",
  marginTop: "10px"
};

export default function AddDefectPriorityForm({ onFinish }) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: "",
    description: ""
  });
  const [showResult, setShowResult] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clearValues = () => {
    setValues({
      name: "",
      description: ""
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    Axios.post(`${DEFECT_BASE_URL}/priority`, values)
      .then(response => {
        console.log(response);
        setShowResult("alert alert-success");
        setMessage(response.data.message);
        clearValues();
      })
      .catch(error => {
        console.log(error);
        setShowResult("alert alert-danger");
        setMessage("Failed to Save!!");
      });
  };

  return (
    <div>
      <div style={divStyle} className={showResult} role="alert">
        {message}
      </div>
      <form
        className={classes.container}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Grid container justify="space-between">
          <TextField
            required
            id="priority-name"
            label="Defect Priority"
            className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
            variant="outlined"
          />
          <TextField
            required
            id="project-desc"
            label="Priority Description"
            className={classes.textField}
            value={values.description}
            onChange={handleChange("description")}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid container justify="flex-end">
          <Button
            color="primary"
            size="large"
            className={classes.button}
            onClick={onFinish}
          >
            Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
          >
            Add
          </Button>
        </Grid>
      </form>
    </div>
  );
}
