import { makeStyles } from '@material-ui/core/styles';

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
  };
};
const makeLogoStyle = (height) => {
  return {
    height: height,
  };
};

const makeInfoStyle = (theme, space) => {
  return {
    top: theme.spacing(space),
    right: theme.spacing(space),
  };
};
const makeButtonsStyle = (theme, space) => {
  return {
    bottom: theme.spacing(space),
    right: theme.spacing(space),
  };
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: '#262626',
    //backgroundColor: '#DDDDDD',
  },
  container: {
    position: 'relative',
    padding: 0,
    borderRight: '1px solid #f50057',
    borderLeft : '1px solid #f50057',
  },
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
  infoButton: {
    position: 'absolute',
    [theme.breakpoints.down('sm')]: makeInfoStyle(theme, SPACING.sm),
    [theme.breakpoints.up('sm')]  : makeInfoStyle(theme, SPACING.md),
    [theme.breakpoints.up('lg')]  : makeInfoStyle(theme, SPACING.lg),
  },
  controlButtons: {
    position: 'absolute',
    display: 'flex',
    justify: 'flex-end',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: makeButtonsStyle(theme, SPACING.sm),
    [theme.breakpoints.up('sm')]  : makeButtonsStyle(theme, SPACING.md),
    [theme.breakpoints.up('lg')]  : makeButtonsStyle(theme, SPACING.lg),
  },
  buttonBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  colorPreview: {
    marginBottom: 8,
    width: 127,
    padding: '0 8px',
  },
  showAxes: {
    backgroundColor: '#ffffff',
    "&:hover, &:focus": {
      backgroundColor: '#ffffff',
    },
  },
  buttons: {
    height: '42px',
    marginRight: '6px',
  }
}));

export default useStyles;
