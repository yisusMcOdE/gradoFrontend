import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { json, Outlet, useNavigate } from "react-router-dom";
import { isExpired, decodeToken } from 'react-jwt';


export const Root = () => {

    const navigator = useNavigate();

    useEffect(()=>{
        const token = localStorage.token;
        if(token === undefined){
            navigator('/login');
        }
        /*else{
            const decode = decodeToken(token);
            if(decode.data.role!=='SuperUsuario'){
                switch (decode.data.role) {
                    case 'Cliente':
                        navigator('/cliente');
                    break;
                    case 'Administracion':
                    navigator('/admin');
                    break;
                    case 'Area':
                    navigator('/area');
                    break;
                    case 'Recepcion':
                    navigator('/recepcion');
                    break;
                    case 'Direccion':
                    navigator('/direccion');
                    break;
                    default:
                    navigator('/login');
                    break;
                }
            }
        }*/
    },[])

    return (
        <Outlet/>
    )
}