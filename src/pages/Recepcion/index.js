import { Grid } from "@mui/material";
import { SideBar } from "../../components/SideBar";
import { useStyles } from "./recepcion.styles";
import BallotIcon from '@mui/icons-material/Ballot';
import WidgetsIcon from '@mui/icons-material/Widgets';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { Outlet } from "react-router-dom";
import { BackgroundPage } from "../../components/background";

export const Recepcion = () => {
    
    const classes = useStyles();

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

    return (
        <Grid container >
            <BackgroundPage/>
            <Grid item xs='auto'>
                <SideBar role='Recepcion' menu={menu} icons={icons} subMenu={subMenu}/>
            </Grid>
            <Grid item xs className={classes.containerPage}>
                <Outlet/>
            </Grid>
        </Grid>
    )
}