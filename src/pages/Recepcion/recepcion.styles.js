import { makeStyles } from "@mui/styles"
import { theme } from "../../theme/theme"
export const useStyles = makeStyles({
    containerPage:{
        backgroundColor:'transparent',
        backdropFilter: 'blur(0px)',
        minHeight:'100vh'
    },
    titlePage:{
        textAlign:'center'
    }
})