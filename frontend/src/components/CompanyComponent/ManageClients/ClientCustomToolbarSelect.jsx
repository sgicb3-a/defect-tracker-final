import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

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

export default function CompanyCustomToolbarSelect({ id, onDelete }) {
  const classes = useStyles();
  let privileges = [];
  let privilege = [];
  let role = localStorage.getItem("role");
  privileges = JSON.parse(localStorage.getItem("privilege"));
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const isAllowed = feature => {
    privilege = privileges.find(({ name }) => name === feature);
    return privilege[role];
  };
  return (
    <div>
      {isAllowed("Edit Client") && (
        <Tooltip title={"Edit"}>
          <Fab
            color="secondary"
            aria-label="edit"
            className={classes.fab}
            size="small"
            component={Link}
            to={{
              pathname: "/company-administration/manage-client/edit-client",
              edit: { id }
            }}
            style={{ color: "#FFF" }}
          >
            <EditIcon className={classes.icon} />
          </Fab>
        </Tooltip>
      )}

      {isAllowed("Delete Client") && (
        <Tooltip title={"Delete"}>
          <Fab
            color="default"
            aria-label="delete"
            className={classes.fab}
            size="small"
            onClick={handleDeleteOpen}
          >
            <DeleteIcon className={classes.icon} />
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
        <DialogTitle id="delete-project-title">Delete Client</DialogTitle>
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
