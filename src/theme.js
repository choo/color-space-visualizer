import { indigo, pink }   from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

/* A custom theme for this app */
/* as to color variation, see https://material-ui.com/customization/color/ */
const theme = createMuiTheme({
  palette: {
    // primary: {
    //   main: '#80D8FF',
    // },
    // secondary: {
    //   main: '#80CBC4',
    // },
    // error: {
    //   main: red.A400,
    // },
    primary: indigo,
    secondary: pink,
    background: {
      default: '#fff',
    },
  },
});

export default theme;
