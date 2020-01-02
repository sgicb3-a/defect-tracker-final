import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddDefectSeverityForm from "./AddDefectSeverityForm";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  input: {
    display: "none"
  },
  fab: {
    marginLeft: theme.spacing(1)
  }
}));

export default function DefectSeverityCustomToolbar({ onCreate }) {
  const classes = useStyles();
  let privileges = [];
  let privilege = [];
  let role = localStorage.getItem("role");
  privileges = JSON.parse(localStorage.getItem("privilege"));
  const [openAdd, setOpenAdd] = React.useState(false);

  const handleAddOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
    onCreate();
  };

  const isAllowed = feature => {
    privilege = privileges.find(({ name }) => name === feature);
    return privilege[role];
  };

  return (
    <React.Fragment>
      {isAllowed("Add Severity") && (
        <Tooltip title={"Add"}>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.fab}
            size="small"
            onClick={handleAddOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}

      <Dialog
        open={openAdd}
        onClose={handleAddClose}
        aria-labelledby="add-severity-title"
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="add-severity-title">Add Defect Severity</DialogTitle>
        <Divider />
        <DialogContent>
          <AddDefectSeverityForm onFinish={handleAddClose} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
