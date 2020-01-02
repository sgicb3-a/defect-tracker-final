import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import ListAllItems from "./ListAllItems";
import RouteDetails from "./RouteDetails";
import { BrowserRouter as Router, Link } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Tooltip from "@material-ui/core/Tooltip";
import Brightness6Icon from "@material-ui/icons/Brightness6";
import MoreIcon from "@material-ui/icons/MoreVert";
import { deepOrange } from "@material-ui/core/colors";
import Axios from "axios";
import { EMPLOYEE_BASE_URL, APP_BASE_URL } from "../../api";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  avatar: {
    margin: 5
  },
  img: {
    marginRight: theme.spacing(5)
  },
  user: {
    marginTop: theme.spacing(1.8),
    marginRight: theme.spacing(1)
  },
  orange: {
    margin: 5,
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500]
  }
}));

export default function MainDrawer({ onToggleDark, isDark }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  let username = localStorage.getItem("username");
  if (username === null) {
    window.location.href = `${APP_BASE_URL}`;
  }
  const [userImage, setUserImage] = React.useState("");

  useEffect(() => {
    Axios.get(`${EMPLOYEE_BASE_URL}/employee/image/${username}`)
      .then(response => {
        setUserImage(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [username]);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const exitApp = () => {
    localStorage.clear();
    window.location.href = `${APP_BASE_URL}`;
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={onToggleDark}>
        <IconButton aria-label="dark" color="inherit">
          <Brightness6Icon />
        </IconButton>
        <p>Dark Mode</p>
      </MenuItem>
      <MenuItem onClick={exitApp}>
        <IconButton aria-label="help" color="inherit">
          <ExitToAppIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
      <MenuItem>
        <Avatar
          alt="User Image"
          src={userImage.length > 0 ? userImage : ""}
          className={classes.orange}
          component={Link}
          to={"/settings/user-profile"}
        >
          {userImage.length < 1 ? username.substr(0, 1).toUpperCase() : ""}
        </Avatar>
        <p>{username.toUpperCase()}</p>
      </MenuItem>
    </Menu>
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              Defect Tracker
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Typography className={classes.user} noWrap>
                Welcome {username.toUpperCase()}
              </Typography>
              <Tooltip title={"Switch Dark/Light Theme"}>
                <IconButton
                  aria-label="dark"
                  color="inherit"
                  onClick={onToggleDark}
                >
                  <Brightness6Icon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Logout"}>
                <IconButton aria-label="help" color="inherit" onClick={exitApp}>
                  <ExitToAppIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={username.toUpperCase()}>
                <Avatar
                  alt="User Image"
                  src={userImage.length > 0 ? userImage : ""}
                  className={classes.orange}
                  component={Link}
                  to={"/settings/user-profile"}
                  style={{
                    color: isDark ? "#FFF" : "",
                    textDecoration: "none"
                  }}
                >
                  {userImage.length < 1
                    ? username.substr(0, 1).toUpperCase()
                    : ""}
                </Avatar>
              </Tooltip>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open
            })
          }}
          open={open}
        >
          <div className={classes.drawerHeader}>
            <img
              className={classes.img}
              src="https://cdn2.iconfinder.com/data/icons/security-pro-1/512/Bug_Fixing-01-512.png"
              alt="Logo"
              height="50"
              width="50"
            />
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <ListAllItems isDark={isDark} />
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <div className={classes.drawerHeader} />
          {renderMobileMenu}
          <RouteDetails isDark={isDark} />
        </main>
      </div>
    </Router>
  );
}
