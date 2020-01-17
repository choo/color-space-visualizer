import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles(theme => ({
  version: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  linkBox: {
    padding: theme.spacing(1),
    paddingRight: theme.spacing(0),
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 32,
  },
}));

export default function InfoPopover(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'info-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} color="secondary" variant="outlined" onClick={handleClick}>
        <InfoIcon />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <ButtonGroup
          size="small"
          className={classes.version}
          color="secondary"
          aria-label="version buttons"
        >
          <Button
            key='basic'
            variant={!props.isLite ? 'contained' : 'outlined'}
            href="/"
          >
            basic
          </Button>
          <Button
            key='lite'
            variant={props.isLite ? 'contained' : 'outlined'}
            href="/?lite=true"
          >
            Lite
          </Button>
        </ButtonGroup>
        <div className={classes.linkBox}>
          <span>source code</span>
          <a target='_blank' rel="noopener noreferrer"
            href='https://github.com/choo/color-space-visualizer'>
            <img  className={classes.image}
              src={'GitHub-Mark-64px.png'} alt={'GitHub Link'} />
          </a>
        </div>
        <div className={classes.linkBox}>
          <span>author</span>
          <a target='_blank' rel="noopener noreferrer"
            href='https://twitter.com/choo_s'>
            <img  className={classes.image}
              src={'Twitter_Social_Icon_Rounded_Square_Color.png'}
              alt={'twitter Link'} />
          </a>
        </div>
      </Popover>
    </div>
  );
}
