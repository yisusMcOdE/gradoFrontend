import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { isExpired, decodeToken } from 'react-jwt';


export const Root = () => {

    const navigator = useNavigate();

    useEffect(()=>{

      const token = localStorage.token;

      if(token === undefined){
        navigator('/login');
      }else{
        const decode = decodeToken(token);
        switch (decode.data.role) {
          case 'admin':
            navigator('/admin');
            break;
        
          default:
            break;
        }
      }
    },[])

    return (
      <>
      </>
    )
}