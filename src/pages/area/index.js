import { SideBar } from "../../components/SideBar"
import { useStyles } from "./area.styles";
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import WidgetsIcon from '@mui/icons-material/Widgets';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AdfScannerIcon from '@mui/icons-material/AdfScanner';
import { Grid } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { BackgroundPage } from "../../components/background";
import { SuperUserBar } from "../../components/superUserBar";
import { useEffect, useState } from "react";
import { redirectRole, verifyTokenWithPath } from "../../utilities/pdfMake/redirectRole";


export const Area = () => {

    const navigator = useNavigate();

    const [isSuperUser, setIsSuperUser] = useState(false);

    const classes = useStyles();

    const menu= ['Trabajos', 'Materiales', 'Equipamiento', 'Reportes'];
    const subMenu= {
        Trabajos: [
            {name: 'Ver Trabajos', to:'trabajos'}, 
            {name: 'Ver Cronograma', to:'trabajos/cronograma'} 
        ],
        Materiales: [
            {name: 'Ver Materiales', to: 'material'}, 
        ],
        Reportes: [
            {name: 'Trabajos por Area', to: 'reporteArea'},
            {name: 'Uso de Material', to: 'reporteMaterial'},
            {name: 'Pedidos Realizados', to: 'reportePedidos'}
        ],
        Equipamiento:[
            {name: 'Ver Equipamiento', to: 'equipamiento'}
        ]
        
    }
    const icons= [<AutoAwesomeMotionIcon/>,<WidgetsIcon/>,<AdfScannerIcon/>,<FindInPageIcon/>,]

    useEffect(()=>{
        setIsSuperUser(verifyTokenWithPath('Area',navigator));
    },[])

    return (
        <Grid container >
            <BackgroundPage/>
            <Grid item xs='auto'>
                <SideBar role='Area' menu={menu} icons={icons} subMenu={subMenu}/>
            </Grid>
            <Grid item container direction='column' xs className={classes.containerPage}>
                {
                isSuperUser&&
                    <Grid item xs='auto' style={{margin:'auto', display:'block', marginTop:'0.5rem'}}>
                        <SuperUserBar/>
                    </Grid>
                }
                <Grid item xs>
                    <Outlet/>
                </Grid>
            </Grid>
        </Grid>
    )
}