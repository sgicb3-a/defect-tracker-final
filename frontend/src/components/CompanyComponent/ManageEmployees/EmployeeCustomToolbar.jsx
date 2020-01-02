import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  fab: {
    marginLeft: theme.spacing(2)
  }
}));

export default function EmployeeCustomToolbar({ onCreate }) {
  const classes = useStyles();
  let privileges = [];
  let privilege = [];
  let role = localStorage.getItem("role");
  privileges = JSON.parse(localStorage.getItem("privilege"));

  const isAllowed = feature => {
    privilege = privileges.find(({ name }) => name === feature);
    return privilege[role];
  };

  return (
    <React.Fragment>
      {isAllowed("Add Employee") && (
        <Tooltip title={"Add"}>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.fab}
            size="small"
            component={Link}
            to={"/company-administration/manage-employee/add-employee"}
            style={{ color: "#FFF" }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}
    </React.Fragment>
  );
}
