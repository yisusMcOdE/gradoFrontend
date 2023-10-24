import { Button, Grid } from "@mui/material"
import { useNavigate } from "react-router-dom"

export const SuperUserBar = () => {

    const navigator = useNavigate();

    return(
        <Grid 
            container 
            justifyContent='space-evenly' 
            rowSpacing={1}
            style={{padding:'5px', background:'#E8E8E8'}}
        >
            <Grid item xs={12}>
                <h3 style={{textAlign:'center', margin:0}}>Menú de SuperUsuario</h3>
            </Grid>
            <Grid item xs='auto'>
                <Button
                    onClick={()=>{navigator('/admin')}}
                    variant='contained'
                >
                    Subs. Administrador
                </Button>
            </Grid>
            <Grid item xs='auto'>
                <Button
                    onClick={()=>{navigator('/recepcion')}}
                    variant='contained'
                >
                    Subs. Recepcion
                </Button>
            </Grid>
            <Grid item xs='auto' >
                <Button
                    onClick={()=>{navigator('/area')}}
                    variant='contained'
                >
                    Subs. Area
                </Button>
            </Grid>
            <Grid item xs='auto'>
                <Button 
                    onClick={()=>{navigator('/cliente')}}
                    variant='contained'
                >
                    Subs. Cliente
                </Button>
            </Grid>
            <Grid item xs='auto'>
                <Button
                    onClick={()=>{navigator('/direccion')}}
                    variant='contained'
                >
                    Subs. Direccion
                </Button>
            </Grid>
        </Grid>
    )
}