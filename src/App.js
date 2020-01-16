import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Checkbox from '@material-ui/core/Checkbox';

import useStyles from './style.js';
import ThreeColorSpace from './components/ThreeColorSpace';
import InfoPopover from './components/InfoPopover';
import {selectTextColor} from './ColorUtils';

const MODEL_NAMES = ['RGB', 'HSV'];


const App = (props) => {
  const classes = useStyles();
  const [model, setModel] = useState(MODEL_NAMES[0]);
  const [selecedColor, setColor] = useState('#ffffff');
  const [previewing, setPreviewing] = useState(false);
  const [showingAxes, setShowingAxes] = useState(false);
  return (
    <div className={classes.wrapper}>
      <Container maxWidth='md' className={classes.container}>

        <div className={classes.header}>
          <a href='/'>
            <img className={classes.logo} src={'logo_20_02.png'} alt={'logo'} />
          </a>
        </div>

        <div className={classes.infoButton}>
          <InfoPopover />
        </div>

        <ThreeColorSpace
          model={model}
          previewing={previewing}
          showingAxes={showingAxes}
          onSelectColor={rgb => {setColor(rgb)}}
          setPreviewing={setPreviewing}
        />

        <div className={classes.controlButtons}>
          <div className={classes.buttonBox}>
            <Button
              className={classes.colorPreview}
              style={{
                backgroundColor: selecedColor,
                color: selectTextColor(selecedColor),
              }}
              onClick={() => setPreviewing(!previewing)}
              aria-label="color preview"
            >
              <Checkbox
                checked={previewing}
                style={{
                  color: selectTextColor(selecedColor),
                }}
                value="color preview" />
              {selecedColor}
            </Button>
          </div>

          <div className={classes.buttonBox}>
            <Button
              className={`${classes.colorPreview} ${classes.showAxes}`}
              onClick={() => setShowingAxes(!showingAxes)}
              aria-label="show axes"
            >
              <Checkbox
                checked={showingAxes}
                value="show axes" />
              {'axis'}
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
                    key={modelName}
                    variant={model === modelName ? 'contained' : 'outlined'}
                    onClick={e => {setModel(modelName)}}
                  >
                    {modelName}
                  </Button>
                )
              })}
            </ButtonGroup>
          </div>
        </div>

      </Container>
    </div>
  );
};


export default App;
