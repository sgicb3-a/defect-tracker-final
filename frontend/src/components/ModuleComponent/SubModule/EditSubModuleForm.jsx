import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Axios from "axios";
import { PROJECT_BASE_URL } from "../../../api";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  textField: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3),
    margin: theme.spacing(1),
    width: "230px"
  },
  formControl: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3),
    margin: theme.spacing(1),
    width: "230px"
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

export default function EditSubModuleForm({ id, onFinish }) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: "",
    projectId: "",
    moduleId: ""
  });
  const [projects, setProjects] = React.useState([]);
  const [modules, setModules] = React.useState([]);
  const [showResult, setShowResult] = React.useState("");
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    Axios.get(`${PROJECT_BASE_URL}/submodule/${id()}`)
      .then(response => {
        console.log(response);
        let result = response.data.results.Object;
        updateData(result);
      })
      .catch(error => {
        console.log(error);
        setShowResult("alert alert-danger");
        setMessage("Failed to Retrive Data!!");
      });
  }, [id]);

  useEffect(() => {
    Axios.get(`${PROJECT_BASE_URL}/project`)
      .then(response => {
        console.log(response);
        setProjects(response.data.results.List);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${PROJECT_BASE_URL}/module/byproject/${values.projectId}`)
      .then(response => {
        console.log(response);
        setModules(response.data.results.List);
      })
      .catch(error => {
        console.log(error);
      });
  }, [values.projectId]);

  const updateData = data => {
    setValues({
      id: data.id,
      name: data.name,
      projectId: data.projectId,
      moduleId: data.moduleId
    });
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    Axios.put(`${PROJECT_BASE_URL}/submodule`, values)
      .then(response => {
        console.log(response);
        setShowResult("alert alert-success");
        setMessage(response.data.message);
      })
      .catch(error => {
        console.log(error);
        setShowResult("alert alert-danger");
        setMessage("Failed to Update!!");
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
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="project-name">Project</InputLabel>
            <Select
              id="project-name"
              value={values.projectId}
              onChange={handleChange("projectId")}
            >
              {projects.map((project, i) => (
                <MenuItem key={i} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="submodule-name">Module Name</InputLabel>
            <Select
              id="module-name"
              value={values.moduleId}
              onChange={handleChange("moduleId")}
            >
              {modules.map((el, i) => (
                <MenuItem key={i} value={el.id}>
                  {el.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            required
            id="submodule-name"
            label="Submodule Name"
            value={values.name}
            onChange={handleChange("name")}
            className={classes.textField}
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
            Update
          </Button>
        </Grid>
      </form>
    </div>
  );
}
