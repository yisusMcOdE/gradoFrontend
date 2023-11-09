import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    container:{
        position:'fixed',
        zIndex:'-100',
        bottom:'3vh',
        right:'3vw',
        '& img': {
            height : '70vh',
            filter: 'blur(5px)'
        }
    }
})