import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import ls from 'local-storage';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import AspectRatio from '@material-ui/icons/AspectRatio';

import './styles/app.scss';

import * as templates from "./templates";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";


const drawerWidth = 350;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    textAlign: 'right'
  }
}));

const dimensions = [
  {
    className: 'dim_full',
    name: 'full'
  },
  {
    className: 'dim_320',
    name: '320'
  },
  {
    className: 'dim_375',
    name: '375'
  },
  {
    className: 'dim_425',
    name: '425'
  },
  {
    className: 'dim_480',
    name: '480'
  },
  {
    className: 'dim_768',
    name: '768'
  },
  {
    className: 'dim_1024',
    name: '1024'
  },
  {
    className: 'dim_1440',
    name: '1440'
  }
];

const ToolbarToggler = ({title, onClick, isTop, isActive, children}) => (
  <div
    className={classnames(`floating-toolbar`, `floating-toolbar__${isTop ? 'top' : 'bottom'}`, `floating-toolbar${!isActive ? '__open' : '__closed'}`)}>
    <Button onClick={onClick} size="small">
      <span className="button-label">{title}</span>
      {children}
    </Button>
  </div>
);

const DimensionDrawer = ({open, onSelect, selected}) => (
  <div className={classnames('dimension-drawer', `dimension-drawer__${open ? 'open' : 'closed'}`)}>
    <ButtonGroup variant="contained" size="small">
      {dimensions.map(({className, name}) => (
        <Button key={className} variant="contained"
                color={selected === className ? 'primary' : 'default'}
                onClick={onSelect.bind(this, className)}>{name}</Button>
      ))}
    </ButtonGroup>
  </div>
);

const App = () => {
  const classes = useStyles();
  const viewerRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [dimension, setDimension] = useState('dim_full');
  const [dimensionDrawerOpen, setDimensionDrawerOpen] = useState(false);

  useEffect(() => {
    const active = ls('active-template');
    if (active && active !== selected) {
      if (typeof templates.default[active] !== 'undefined') {
        onSelectTemplate(active);
      }
    }

    const activeDimension = ls('active-dimension') || dimension;
    if (activeDimension && activeDimension !== dimension) {
      setDimension(activeDimension);
    }

    return () => {};
  });

  const onSelectTemplate = (templateName) => {
    setSelected(templateName);
    if (templateName) {
      const Component = templates.default[templateName].default;
      ReactDOM.render(<Component/>, viewerRef.current);
    } else {
      ReactDOM.render(<div/>, viewerRef.current);
    }

    ls('active-template', templateName);
    setOpen(false);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleDimensionDrawer = () => {
    setDimensionDrawerOpen(!dimensionDrawerOpen);
  };

  const onDimensionSelect = (selectedDimension) => {
    ls('active-dimension', selectedDimension);

    setDimension(selectedDimension);
    setDimensionDrawerOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline/>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={toggleDrawer}>
            {!open ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
          </IconButton>
        </div>
        <Divider/>
        <List>
          {Object.keys(templates.default).map((templateName, index) => (
            <ListItem button selected={selected === templateName} key={templateName}
                      onClick={onSelectTemplate.bind(this, templateName)}>
              <ListItemIcon style={{minWidth: '30px'}}>
                <InsertDriveFile/>
              </ListItemIcon>
              <ListItemText primary={templateName}/>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <ToolbarToggler onClick={toggleDrawer} title={'TEMPLATES'} isActive={open} isTop={true}>
        <MenuIcon fontSize="small"/>
      </ToolbarToggler>

      <ToolbarToggler onClick={toggleDimensionDrawer} title={'DIMENSIONS'} isActive={open} isTop={false}>
        <AspectRatio fontSize="small"/>
      </ToolbarToggler>

      <DimensionDrawer open={dimensionDrawerOpen} onSelect={onDimensionSelect} selected={dimension}/>

      <div className="content">
        <div ref={viewerRef} className={classnames('viewer', `viewer__${dimension}`)}/>
      </div>
    </div>
  );
};

export default App;
