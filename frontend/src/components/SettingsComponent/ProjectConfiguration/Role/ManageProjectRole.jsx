import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import ProjectRoleCustomToolbar from "./ProjectRoleCustomToolbar";
import ProjectRoleCustomToolbarSelect from "./ProjectRoleCustomToolbarSelect";
import Axios from "axios";
import { PROJECT_BASE_URL } from "../../../../api";

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
    name: "id",
    label: "Role Id",
    options: {
      filter: true,
      sort: true,
      display: false
    }
  },
  {
    name: "name",
    label: "Role Name",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "description",
    label: "Role Description",
    options: {
      filter: true,
      sort: false
    }
  }
];

export default function ManageProjectRole() {
  const classes = useStyles();
  const [openBackDrop, setOpenBackDrop] = React.useState(true);
  const [roles, setRoles] = React.useState([]);
  const [showResult, setShowResult] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [trackAdd, setTrackAdd] = React.useState(false);
  const [trackEdit, setTrackEdit] = React.useState(false);
  const [trackDelete, setTrackDelete] = React.useState(false);
  const [values] = React.useState({
    id: ""
  });
  const handleTrackAdd = () => {
    setTrackAdd(!trackAdd);
  };

  const handleTrackEdit = () => {
    setTrackEdit(!trackEdit);
  };

  const handleTrackDelete = () => {
    setTrackDelete(!trackDelete);
  };

  const getId = () => {
    return values.id;
  };

  useEffect(() => {
    Axios.get(`${PROJECT_BASE_URL}/role`)
      .then(response => {
        console.log(response);
        setRoles(response.data.results.List);
        setOpenBackDrop(false);
      })
      .catch(error => {
        console.log(error);
        setOpenBackDrop(false);
        setShowResult("alert alert-danger");
        setMessage("Failed to Retrive Data");
      });
  }, [trackDelete, trackAdd, trackEdit]);

  const options = {
    filterType: "dropdown",
    selectableRows: "single",
    selectableRowsOnClick: true,
    responsive: "scrollFullHeight",
    textLabels: {
      body: {
        noMatch: module.length > 0 ? "Loading data..." : "No Records Found!"
      }
    },
    customToolbar: () => {
      return <ProjectRoleCustomToolbar onCreate={handleTrackAdd} />;
    },
    customToolbarSelect: () => {
      return (
        <ProjectRoleCustomToolbarSelect
          onDelete={handleDelete}
          onEdit={handleTrackEdit}
          id={getId}
        />
      );
    },
    onRowsSelect: allRows => {
      allRows.forEach(row => {
        const dataRow = roles[row.dataIndex];
        values.id = dataRow["id"];
        console.log(values.id);
      });
    }
  };

  const handleDelete = () => {
    Axios.delete(`${PROJECT_BASE_URL}/role/${values.id}`)
      .then(response => {
        console.log(response);
        setShowResult("alert alert-success");
        setMessage(response.data.message);
        handleTrackDelete();
      })
      .catch(error => {
        console.log(error);
        setShowResult("alert alert-danger");
        setMessage(
          error.response ? error.response.data.message : "Failed to Delete!"
        );
        handleTrackDelete();
      });
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
        <MUIDataTable data={roles} columns={columns} options={options} />
      </Container>
    </div>
  );
}
