import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(1),
    paddingRight: theme.spacing(0),
    backgroundColor: '#cccccc',
  },
  image: {
    marginRight: theme.spacing(1),
    width: 32,
  },
}));

export default function InfoPopover() {
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
        <Typography className={classes.typography}>
          <a target='_blank'
            href='https://github.com/choo/color-space-visualizer'>
            <img  className={classes.image}
              src={'GitHub-Mark-64px.png'} alt={'GitHub Link'} />
          </a>
          <a target='_blank'
            href='https://twitter.com/choo_s'>
            <img  className={classes.image}
              src={'Twitter_Social_Icon_Rounded_Square_Color.png'}
              alt={'twitter Link'} />
          </a>
        </Typography>
      </Popover>
    </div>
  );
}
