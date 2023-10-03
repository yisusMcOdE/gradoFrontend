import { Grid } from "@mui/material";
import { SideBar } from "../../components/SideBar"
import { Outlet } from "react-router-dom";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import WidgetsIcon from '@mui/icons-material/Widgets';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import StorageIcon from '@mui/icons-material/Storage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FindInPageIcon from '@mui/icons-material/FindInPage';

import { useStyles } from "./admin.styles";
import { useEffect } from "react";
import { BackgroundPage } from "../../components/background";

export const Admin = () => {

    const menu= ['Usuarios', 'Materiales', 'Trabajos', 'Backups', 'Bitacora', 'Reportes'];
    const subMenu= {
        Usuarios: [
            {name: 'Informacion de Usuario', to:'usuarios'},
            {name: 'Cuentas de Usuario', to:'cuentaUsuarios'},
            {name: 'Crear', to:'usuarios/crear'},
        ],
        Materiales: [
            {name: 'Ver', to: 'materiales'},
            {name: 'Crear', to: 'materiales/crear'}, 
        ],
        Trabajos: [
            {name: 'Ver', to: 'trabajos'},
            {name: 'Crear', to: 'trabajos/crear'}, 
        ],
        Backups: [
            {name: 'Ver', to: 'backup'},
            {name: 'Configurar', to: 'backup/configurar'}, 
        ],
        Bitacora: [
            {name: 'Ver', to: 'bitacora'}
        ],
        Reportes:[
            {name:'Reporte de Bitacora', to: 'reporteBitacora'}
        ]
        
    };

    const icons= [
        <SupervisedUserCircleIcon/>,
        <WidgetsIcon/>,
        <AutoAwesomeMotionIcon/>,
        <StorageIcon/>,
        <VisibilityIcon/>,
        <FindInPageIcon/>
    ];

    const classes=useStyles();

    return (
    <Grid container direction={'row'} wrap='nowrap'>
        <BackgroundPage/>
        <Grid item xs='auto'>
            <SideBar role='Administrador' menu={menu} icons={icons} subMenu={subMenu}/>
        </Grid>
        <Grid item xs className={classes.containerPage}>
            <Outlet/>
        </Grid>
    </Grid>)
}