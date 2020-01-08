import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import useStyles from './style.js';
import ThreeColorSpace from './components/ThreeColorSpace';
import {selectTextColor} from './ColorUtils';

const MODEL_NAMES = ['RGB', 'HSV'];


const App = (props) => {
  const classes = useStyles();
  const [model, setModel] = useState(MODEL_NAMES[0]);
  const [selecedColor, setColor] = useState('#ffffff');
  const [previewing, setPreviewing] = useState(false);
  const [showingAxes, setShowingAxes] = useState(false);

  const getVariant = (modelName) => {
    return model === modelName ? 'contained' : 'outlined';
  }

  return (
    <div className={classes.wrapper}>
      <Container maxWidth='md' className={classes.container}>

        <div className={classes.header}>
          <img  className={classes.logo} src={'logo_20_02.png'} alt={'logo'} />
        </div>

        <ThreeColorSpace
          model={model}
          previewing={previewing}
          showingAxes={showingAxes}
          onSelectColor={rgb => {setColor(rgb)}}
        />

        <div className={classes.controlButtons}>
          <Button
            className={classes.colorPreview}
            style={{
              backgroundColor: selecedColor,
              color: selectTextColor(selecedColor),
            }}
            onClick={() => setPreviewing(!previewing)}
            aria-label="color preview"
          >
            {selecedColor}
          </Button>

          <Button
            className={classes.showingAxes}
            onClick={() => setShowingAxes(!showingAxes)}
            aria-label="show axes"
          >
            {showingAxes ? 'show' : 'hide'} axes
          </Button>

          <ButtonGroup
            className={classes.buttons}
            orientation="vertical"
            color="secondary"
            aria-label="color model buttons"
          >
            {MODEL_NAMES.map(modelName => {
              return (
                <Button
                  variant={getVariant(modelName)}
                  onClick={e => {setModel(modelName)}}
                >
                  {modelName}
                </Button>
              )
            })}
          </ButtonGroup>
        </div>

      </Container>
    </div>
  );
};


export default App;
