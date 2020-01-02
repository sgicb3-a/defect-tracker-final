import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Axios from "axios";
import { PROJECT_BASE_URL, DEFECT_BASE_URL } from "../../api";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  paper: {
    color: theme.palette.text.secondary,
    borderRadius: "4px",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.1), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    marginTop: theme.spacing(5),
    margin: theme.spacing(3),
    padding: theme.spacing(5)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
    margin: theme.spacing(1),
    width: "230px"
  },
  textFieldCustom: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2.5),
    width: "230px"
  },
  descField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3),
    margin: theme.spacing(1),
    width: "490px"
  },
  formControl: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
    margin: theme.spacing(1),
    width: "230px",
    textAlign: "left"
  },
  buttonUpload: {
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(3.5),
    marginLeft: theme.spacing(1),
    width: "230px"
  },
  input: {
    display: "none"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    width: "120px"
  }
}));

const divStyle = {
  marginRight: "50px",
  marginLeft: "50px",
  marginTop: "20px"
};

export default function AddDefectForm() {
  const classes = useStyles();
  let empId = localStorage.getItem("id");
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);
  const [projects, setProjects] = React.useState([]);
  const [modules, setModules] = React.useState([]);
  const [submodules, setSubmodules] = React.useState([]);
  const [severities, setSeverities] = React.useState([]);
  const [priorities, setPriorities] = React.useState([]);
  const [types, setTypes] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [statuses, setStatuses] = React.useState([]);
  const [showResult, setShowResult] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [upload, setUpload] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [values, setValues] = React.useState({
    name: "",
    description: "",
    projectId: "",
    moduleId: "",
    submoduleId: "",
    typeId: "",
    severityId: "",
    priorityId: "",
    statusId: "",
    attachment: "",
    stepsToCreate: "",
    foundIn: "",
    fixedIn: null,
    assignedTo: "",
    assignedBy: empId,
    createdBy: empId
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clearValues = () => {
    setValues({
      name: "",
      description: "",
      projectId: "",
      moduleId: "",
      submoduleId: "",
      typeId: "",
      severityId: "",
      priorityId: "",
      statusId: "",
      attachment: "",
      stepsToCreate: "",
      foundIn: "",
      fixedIn: null,
      assignedTo: "",
      assignedBy: empId,
      createdBy: empId
    });
  };

  useEffect(() => {
    Axios.get(`${PROJECT_BASE_URL}/employee_submodule/projects`)
      .then(response => {
        console.log(response);
        setProjects(response.data.results.List);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    Axios.get(
      `${PROJECT_BASE_URL}/employee_submodule/modules/${values.projectId}`
    )
      .then(response => {
        console.log(response);
        setModules(response.data.results.List);
      })
      .catch(error => {
        console.log(error);
      });
  }, [values.projectId]);

  useEffect(() => {
    Axios.get(
      `${PROJECT_BASE_URL}/employee_submodule/submodules/${values.moduleId}`
    )
      .then(response => {
        console.log(response);
        setSubmodules(response.data.results.List);
      })
      .catch(error => {
        console.log(error);
      });
  }, [values.moduleId]);

  useEffect(() => {
    Axios.get(`${DEFECT_BASE_URL}/severity`)
      .then(response => {
        console.log("A");
        console.log(response);
        let result = response.data.results.listAllSeverity;
        setSeverities(result);
        checkSeverityEmpty(result);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${DEFECT_BASE_URL}/priority`)
      .then(response => {
        console.log("E");
        console.log(response);
        let result = response.data.results.listAllPriority;
        setPriorities(result);
        checkPriorityEmpty(result);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${DEFECT_BASE_URL}/type`)
      .then(response => {
        console.log("F");
        console.log(response);
        let result = response.data.results.listAllType;
        setTypes(result);
        checkTypeEmpty(result);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${DEFECT_BASE_URL}/status`)
      .then(response => {
        console.log("G");
        console.log(response);
        let result = response.data.results.listAllStatus;
        setStatuses(result);
        checkStatusEmpty(result);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const checkTypeEmpty = data => {
    if (data.length < 1) {
      setShowResult("alert alert-danger");
      setMessage(
        "Type Empty! Go to Settings -> Defect Configuration -> Type -> Add Type and Comeback"
      );
    }
  };

  const checkPriorityEmpty = data => {
    if (data.length < 1) {
      setShowResult("alert alert-danger");
      setMessage(
        "Priority Empty! Go to Settings -> Defect Configuration -> Priority -> Add Priority and Comeback"
      );
    }
  };

  const checkSeverityEmpty = data => {
    if (data.length < 1) {
      setShowResult("alert alert-danger");
      setMessage(
        "Severity Empty! Go to Settings -> Defect Configuration -> Severity -> Add Severity and Comeback"
      );
    }
  };

  const checkStatusEmpty = data => {
    if (data.length < 1) {
      setShowResult("alert alert-danger");
      setMessage(
        "Status Empty! Go to Settings -> Defect Configuration -> Status -> Add Status and Comeback"
      );
    }
  };

  useEffect(() => {
    Axios.get(
      `${PROJECT_BASE_URL}/employee_submodule/employees/${values.submoduleId}`
    )
      .then(response => {
        console.log(response);
        setEmployees(response.data.results.List);
      })
      .catch(error => {
        console.log(error);
      });
  }, [values.submoduleId]);

  const encodeImageFileAsURL = e => {
    setUpload(false);
    if (e.target.files[0].size > 2097152) {
      alert("File is too big! Maximum 2MB Allowed!!");
    } else {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function() {
        values.attachment = reader.result;
        setUpload(true);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (
      values.projectId !== "" &&
      values.moduleId !== "" &&
      values.submoduleId !== "" &&
      values.typeId !== "" &&
      values.priorityId !== "" &&
      values.severityId !== "" &&
      values.statusId !== "" &&
      values.assignedTo !== ""
    ) {
      Axios.post(`${DEFECT_BASE_URL}/defect`, values)
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
    } else {
      setHasError(true);
    }
  };

  return (
    <div>
      <div style={divStyle} className={showResult} role="alert">
        {message}
      </div>
      <Container className={classes.container}>
        <Paper
          className={classes.paper}
          components={{
            Container: props => <Paper {...props} elevation={4} />
          }}
        >
          <form
            className={classes.container}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Grid container direction="column" alignItems="center">
              <div>
                <TextField
                  required
                  id="defect-name"
                  label="Defect Name"
                  className={classes.textField}
                  value={values.name}
                  onChange={handleChange("name")}
                  margin="normal"
                  variant="outlined"
                />

                <FormControl required className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="project-name">
                    Project
                  </InputLabel>
                  <Select
                    id="project-name"
                    labelWidth={labelWidth}
                    value={values.projectId}
                    onChange={handleChange("projectId")}
                  >
                    {projects.map((project, i) => (
                      <MenuItem key={i} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {hasError && (
                    <FormHelperText>This is required!</FormHelperText>
                  )}
                </FormControl>

                <FormControl required className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="module-name">
                    Module
                  </InputLabel>
                  <Select
                    id="module-name"
                    value={values.moduleId}
                    onChange={handleChange("moduleId")}
                  >
                    {modules.map((module, i) => (
                      <MenuItem key={i} value={module.id}>
                        {module.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {hasError && (
                    <FormHelperText>This is required!</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div>
                <FormControl required className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="submodule-name">
                    Sub Module
                  </InputLabel>
                  <Select
                    id="submodule-name"
                    value={values.submoduleId}
                    onChange={handleChange("submoduleId")}
                  >
                    {submodules.map((submodule, i) => (
                      <MenuItem key={i} value={submodule.id}>
                        {submodule.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {hasError && (
                    <FormHelperText>This is required!</FormHelperText>
                  )}
                </FormControl>

                <FormControl required className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="defect-type">
                    Type
                  </InputLabel>
                  <Select
                    id="defect-type"
                    value={values.typeId}
                    onChange={handleChange("typeId")}
                  >
                    {types.map((type, i) => (
                      <MenuItem key={i} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {hasError && (
                    <FormHelperText>This is required!</FormHelperText>
                  )}
                </FormControl>

                <FormControl required className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="defect-severity">
                    Severity
                  </InputLabel>
                  <Select
                    id="defect-severity"
                    value={values.severityId}
                    onChange={handleChange("severityId")}
                  >
                    {severities.map((severity, i) => (
                      <MenuItem key={i} value={severity.id}>
                        {severity.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {hasError && (
                    <FormHelperText>This is required!</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div>
                <FormControl required className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="def">
                    Priority
                  </InputLabel>
                  <Select
                    id="defect-priority"
                    value={values.priorityId}
                    onChange={handleChange("priorityId")}
                  >
                    {priorities.map((priority, i) => (
                      <MenuItem key={i} value={priority.id}>
                        {priority.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {hasError && (
                    <FormHelperText>This is required!</FormHelperText>
                  )}
                </FormControl>

                <FormControl required className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="assigned-to">
                    Assigned To
                  </InputLabel>
                  <Select
                    id="assigned-to"
                    value={values.assignedTo}
                    onChange={handleChange("assignedTo")}
                  >
                    {employees.map((employee, i) => (
                      <MenuItem key={i} value={employee.id}>
                        {employee.firstName + " " + employee.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                  {hasError && (
                    <FormHelperText>This is required!</FormHelperText>
                  )}
                </FormControl>

                <FormControl required className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="defect-status">
                    Status
                  </InputLabel>
                  <Select
                    id="defect-status"
                    value={values.statusId}
                    onChange={handleChange("statusId")}
                  >
                    {statuses
                      .filter(status => status.name === "New")
                      .map((status, i) => (
                        <MenuItem key={i} value={status.id}>
                          {status.name}
                        </MenuItem>
                      ))}
                  </Select>
                  {hasError && (
                    <FormHelperText>This is required!</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div>
                <TextField
                  required
                  id="found-in"
                  label="Found In"
                  className={classes.textFieldCustom}
                  value={values.foundIn}
                  onChange={handleChange("foundIn")}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  id="defect-desc"
                  label="Description"
                  multiline
                  rows="2"
                  className={classes.descField}
                  value={values.description}
                  onChange={handleChange("description")}
                  margin="normal"
                  variant="outlined"
                />
              </div>
              <div>
                <TextField
                  required
                  id="defect-steps"
                  label="Steps to Re-create"
                  multiline
                  rows="2"
                  className={classes.descField}
                  value={values.stepsToCreate}
                  onChange={handleChange("stepsToCreate")}
                  margin="normal"
                  variant="outlined"
                />
                <input
                  accept="image/*"
                  className={classes.input}
                  id="defect-screenshot"
                  onChange={e => encodeImageFileAsURL(e)}
                  multiple
                  type="file"
                />
                <label htmlFor="defect-screenshot">
                  <Button
                    variant="outlined"
                    component="span"
                    className={classes.buttonUpload}
                  >
                    {upload ? "Uploaded" : "Upload Screenshot"}
                  </Button>
                </label>
              </div>
            </Grid>
            <Grid container justify="flex-end">
              <Button
                className={classes.button}
                color="primary"
                component={Link}
                to={"/manage-defect"}
              >
                Back
              </Button>
              <Button
                type="submit"
                className={classes.button}
                variant="contained"
                color="primary"
              >
                Add
              </Button>
            </Grid>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
