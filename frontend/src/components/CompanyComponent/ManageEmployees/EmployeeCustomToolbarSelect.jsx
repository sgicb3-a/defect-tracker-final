import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import ViewIcon from "@material-ui/icons/AspectRatio";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import ViewEmployeeForm from "./ViewEmployeeForm";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  fab: {
    marginTop: "4px",
    marginBottom: "4px",
    marginRight: theme.spacing(2)
  }
}));

export default function EmployeeCustomToolbarSelect({ id, onEdit, onDelete }) {
  const classes = useStyles();
  const [openView, setOpenView] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  let privileges = [];
  let privilege = [];
  let role = localStorage.getItem("role");
  privileges = JSON.parse(localStorage.getItem("privilege"));

  const isAllowed = feature => {
    privilege = privileges.find(({ name }) => name === feature);
    return privilege[role];
  };

  const handleViewOpen = () => {
    setOpenView(true);
  };

  const handleViewClose = () => {
    setOpenView(false);
    onEdit();
  };

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  return (
    <div>
      {isAllowed("View Employee") && (
        <Tooltip title={"View"}>
          <Fab
            color="secondary"
            aria-label="view"
            className={classes.fab}
            size="small"
            onClick={handleViewOpen}
          >
            <ViewIcon />
          </Fab>
        </Tooltip>
      )}

      <Dialog
        open={openView}
        onClose={handleViewClose}
        aria-labelledby="view-project-title"
        fullWidth={true}
        maxWidth={"xs"}
      >
        <DialogTitle id="view-project-title">View Employee</DialogTitle>
        <Divider />
        <DialogContent>
          <ViewEmployeeForm id={id} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {isAllowed("Edit Employee") && (
        <Tooltip title={"Edit"}>
          <Fab
            color="secondary"
            aria-label="edit"
            className={classes.fab}
            size="small"
            component={Link}
            to={{
              pathname: "/company-administration/manage-employee/edit-employee",
              edit: { id }
            }}
            style={{ color: "#FFF" }}
          >
            <EditIcon />
          </Fab>
        </Tooltip>
      )}

      {isAllowed("Delete Employee") && (
        <Tooltip title={"Delete"}>
          <Fab
            color="default"
            aria-label="delete"
            className={classes.fab}
            size="small"
            onClick={handleDeleteOpen}
          >
            <DeleteIcon />
          </Fab>
        </Tooltip>
      )}

      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="delete-project-title"
        fullWidth={true}
        maxWidth={"xs"}
      >
        <DialogTitle id="delete-project-title">Delete Employee</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to delete an item, are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={onDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
