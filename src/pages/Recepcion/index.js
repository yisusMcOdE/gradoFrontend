import { Grid } from "@mui/material";
import { SideBar } from "../../components/SideBar";
import { useStyles } from "./recepcion.styles";
import BallotIcon from '@mui/icons-material/Ballot';
import WidgetsIcon from '@mui/icons-material/Widgets';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { Outlet, useNavigate } from "react-router-dom";
import { BackgroundPage } from "../../components/background";
import { SuperUserBar } from "../../components/superUserBar";
import { useEffect, useState } from "react";
import { redirectRole, verifyTokenWithPath } from "../../utilities/pdfMake/redirectRole";

export const Recepcion = () => {
    
    const classes = useStyles();
    const navigator = useNavigate();

    const [isSuperUser, setIsSuperUser] = useState(false);

    const menu= ['Clientes','Pedidos', 'Materiales', 'Reportes'];
    const subMenu= {
        Clientes :[
            {name: 'Ver', to:'clientes'}, 
            {name: 'Crear', to:'clientes/crear'},
        ],
        Pedidos: [
            {name: 'Ver', to:'pedidos'}, 
            {name: 'Crear', to:'pedidos/nuevo'}, 
            {name: 'Confirmar / Cancelar', to:'pedidos/confirmar'}, 
            {name: 'Entregar', to:'pedidos/entrega'}
        ],
        Materiales: [
            {name: 'Ver', to: 'material'}, 
            {name: 'Solicitar', to: 'material/solicitar'}, 
            {name: 'Recepcionar', to: 'material/recepcionar'}],
        Reportes: [
            {name: 'generar', to: '/reportes'}
        ]
    }
    const icons= [<ContactPageIcon/>, <BallotIcon/>,<WidgetsIcon/>,<FindInPageIcon/>]

    useEffect(()=>{
        setIsSuperUser(verifyTokenWithPath('Recepcion',navigator));
    },[])

    return (
        <Grid container >
            <BackgroundPage/>
            <Grid item xs='auto'>
                <SideBar role='Recepcion' menu={menu} icons={icons} subMenu={subMenu}/>
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