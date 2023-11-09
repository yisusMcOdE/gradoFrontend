import { useStyles } from "./direccion.styles";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import { Grid } from "@mui/material";
import { SideBar } from "../../components/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { SuperUserBar } from "../../components/superUserBar";
import { useEffect, useState } from "react";
import { redirectRole, verifyTokenWithPath } from "../../utilities/pdfMake/redirectRole";
import { BackgroundPage } from "../../components/background";

export const Direccion = () => {

    const classes = useStyles();
    const navigator = useNavigate();

    const [isSuperUser, setIsSuperUser] = useState(false);


    const menu= ['Trabajos','Reportes'];
    const subMenu= {
        Trabajos:[
            {name: 'Cronograma', to:'cronograma'}
        ],
        Reportes: [
            {name: 'Uso de materiales', to:'reporteMaterial'}
        ]
        
    }

    const icons= [<AutoAwesomeMotionIcon/>,<FindInPageIcon/>];

    useEffect(()=>{
        setIsSuperUser(verifyTokenWithPath('Direccion',navigator));
    },[])

    return (
        <Grid container>
            <BackgroundPage/>
            <Grid item xs='auto'>
                <SideBar role={'Direccion'} menu={menu} icons={icons} subMenu={subMenu}/>
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