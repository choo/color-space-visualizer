import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import useStyles from './style.js';
import ThreeColorSpace from './components/ThreeColorSpace';
import {selectTextColor} from './ColorUtils';


const App = (props) => {
  const classes = useStyles();
  const [model, setModel] = useState('RGB');
  const [selecedColor, setColor] = useState('#ffffff');
  const [previewing, setPreviewing] = useState(false);

  const getVariant = (modelName) => {
    return model === modelName ? "contained" : "outlined";
  }
  const togglePreview = () => {
    setPreviewing(!previewing);
  };

  return (
    <div className={classes.wrapper}>
      <Container maxWidth="md" className={classes.container}>
        <div className={classes.header}>
          <img  className={classes.logo} src={'logo_20_02.png'} alt={'logo'} />
        </div>
        <ThreeColorSpace
          model={model}
          previewing={previewing}
          onSelectColor={rgb => {setColor(rgb)}}
        />

        <div className={classes.controlButtons}>
          {/*
          {
            previewing ? (
              <Typography>
                {selecedColor}
              </Typography>
            ) : null
          }
          */}
          <Button
            className={classes.colorPreview}
            style={{
              backgroundColor: selecedColor,
              color: selectTextColor(selecedColor),
            }}
            onClick={togglePreview}
            aria-label="color preview"
          >
            {selecedColor}
          </Button>

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
        </div>
      </Container>
    </div>
  );
};


export default App;
