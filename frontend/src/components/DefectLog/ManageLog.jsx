import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Axios from "axios";
import { DEFECT_BASE_URL } from "../../api";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  container: {
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}));

const divStyle = {
  marginRight: "35px",
  marginLeft: "35px",
  marginTop: "30px"
};

const columns = [
  {
    name: "projectName",
    label: "Project Name",
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: "name",
    label: "Defect Name",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "assignedToName",
    label: "Assigned To",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "assignedByName",
    label: "Assigned By",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "createdByName",
    label: "Created By",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "updatedByName",
    label: "Updated By",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "statusName",
    label: "Status",
    options: {
      filter: true,
      sort: false
    }
  }
];

export default function ManageLog() {
  const classes = useStyles();
  const [openBackDrop, setOpenBackDrop] = React.useState(true);
  const [defectLog, setDefectLog] = React.useState([]);
  const [showResult, setShowResult] = React.useState("");
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    Axios.get(`${DEFECT_BASE_URL}/defect-log`)
      .then(response => {
        console.log(response);
        setDefectLog(response.data.results.listAllDefectLog);
        setOpenBackDrop(false);
      })
      .catch(error => {
        console.log(error);
        setOpenBackDrop(false);
        setShowResult("alert alert-danger");
        setMessage("Failed to Retrive Data");
      });
  }, []);

  const options = {
    filterType: "dropdown",
    selectableRows: "none",
    responsive: "scrollMaxHeight",
    textLabels: {
      body: {
        noMatch: defectLog.length > 0 ? "Loading data..." : "No Records Found!"
      }
    }
  };

  return (
    <div>
      <div style={divStyle} className={showResult} role="alert">
        {message}
      </div>
      <Container className={classes.container}>
        <Backdrop className={classes.backdrop} open={openBackDrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <MUIDataTable data={defectLog} columns={columns} options={options} />
      </Container>
    </div>
  );
}
