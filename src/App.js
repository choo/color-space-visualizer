import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { makeStyles } from '@material-ui/core/styles';


import Header from './components/Header';
import ThreeColorSpace from './components/ThreeColorSpace';

const SPACING = {
  'sm': 1,
  'md': 2,
  'lg': 2,
};
const logoSize = {
  'sm': 48,
  'md': 56,
  'lg': 64,
};

const makeHeaderStyle = (theme, space) => {
  return {
    top: theme.spacing(space),
    left: theme.spacing(space),
    //right: theme.spacing(space),
  };
};
const makeLogoStyle = (height) => {
  return {
    height: height,
  };
};
const makeButtonsStyle = (theme, space) => {
  return {
    bottom: theme.spacing(space),
    left: theme.spacing(space),
  };
};

const useStyles = makeStyles(theme => ({
  header: {
    position: 'absolute',
    flexGrow: 1,
    display: 'flex',
    [theme.breakpoints.down('sm')]: makeHeaderStyle(theme, SPACING.sm),
    [theme.breakpoints.up('sm')]  : makeHeaderStyle(theme, SPACING.md),
    [theme.breakpoints.up('lg')]  : makeHeaderStyle(theme, SPACING.lg),
  },
  logo: {
    [theme.breakpoints.down('sm')]: makeLogoStyle(logoSize.sm),
    [theme.breakpoints.up('sm')]  : makeLogoStyle(logoSize.md),
    [theme.breakpoints.up('lg')]  : makeLogoStyle(logoSize.lg),
  },
  buttons: {
    position: 'absolute',
    [theme.breakpoints.down('sm')]: makeButtonsStyle(theme, SPACING.sm),
    [theme.breakpoints.up('sm')]  : makeButtonsStyle(theme, SPACING.md),
    [theme.breakpoints.up('lg')]  : makeButtonsStyle(theme, SPACING.lg),
  },
  colorPreview: {
    position: 'absolute',
    width: '100px',
    height: '100px',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));


const App = (props) => {
  const classes = useStyles();
  const [model, setModel] = useState('RGB');
  const [selecedColor, setColor] = useState('#fff');
  const getVariant = (modelName) => {
    return model === modelName ? "contained" : "outlined";
  }
  return (
    <>
      <div className={classes.header}>
        <img  className={classes.logo} src={'logo_20_02.png'} alt={'logo'} />
      </div>
      <ThreeColorSpace
        model={model}
        onSelectColor={rgb => {setColor(rgb)}}
      />
      <ButtonGroup
        className={classes.buttons}
        orientation="vertical"
        color="secondary"
        aria-label="vertical outlined primary button group"
      >
        <Button
          variant={getVariant('RGB')}
          onClick={e => {setModel('RGB')}}
        >
          RGB
        </Button>
        <Button
          variant={getVariant('HSV')}
          onClick={e => {setModel('HSV')}}
        >
          HSV
        </Button>
      </ButtonGroup>

      <Box
        className={classes.colorPreview}
        style={{backgroundColor: selecedColor}}
        aria-label="selected color"
      />
    </>
  );
};


export default App;
