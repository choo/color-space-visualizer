import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import useStyles from './style.js'

import ThreeColorSpace from './components/ThreeColorSpace';


const App = (props) => {
  const classes = useStyles();
  const [model, setModel] = useState('RGB');
  const [selecedColor, setColor] = useState('#fff');
  const getVariant = (modelName) => {
    return model === modelName ? "contained" : "outlined";
  }
  return (
  <div className={classes.wrapper}>
    <Container maxWidth="md" className={classes.container}>
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
    </Container>
  </div>
  );
};


export default App;
