import { SideBar } from "../../components/SideBar"
import { useStyles } from "./area.styles";
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import WidgetsIcon from '@mui/icons-material/Widgets';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import { BackgroundPage } from "../../components/background";


export const Area = () => {

    const classes = useStyles();

    const menu= ['Trabajos', 'Materiales', 'Reportes'];
    const subMenu= {
        Trabajos: [
            {name: 'Ver Trabajos', to:'trabajos'}, 
            {name: 'Ver Cronograma', to:'trabajos/cronograma'} 
        ],
        Materiales: [
            {name: 'Ver Materiales', to: 'material'}, 
        ],
        Reportes: [
            {name: 'Trabajos', to: 'reportesTrabajo'},
            {name: 'Trabajos', to: 'reportesMaterial'}
        ]
    }
    const icons= [<AutoAwesomeMotionIcon/>,<WidgetsIcon/>,<FindInPageIcon/>]

    return (
        <Grid container >
            <BackgroundPage/>
            <Grid item xs='auto'>
                <SideBar role='Area' menu={menu} icons={icons} subMenu={subMenu}/>
            </Grid>
            <Grid item xs className={classes.containerPage}>
                <Outlet/>
            </Grid>
        </Grid>
    )
}