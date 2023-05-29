import { makeStyles } from '@mui/styles';
import { mq } from '../../config/mq.js';
import { theme } from '../../theme/theme.js';


export const useStyles = makeStyles({
    logoArea:{
        background: theme.palette.neutro1.main,
        display:'flex',
        flexDirection:'column',
        placeItems:'center',
        placeContent:'center',
        '& img':{
            width:'50%'
        }
    },
    formArea:{
        height: '100vh',
        background: theme.palette.primary.main,
        placeItems: 'center',
        display: 'grid'
    },
    cardLogin:{
        height:'80vh',
        width:'50%',
        padding: '2rem',
        background: theme.palette.secondary.main,
    },
    textField:{
        '& label':{
            color: theme.palette.neutro1.main
        }
    }
});