import { Button, Card, Dialog, Grid, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Main } from "../../../components/main"

export const PedidosCliente = () => {

    const [modal, setModal] = useState(false);
    const navigator = useNavigate();

    return (
        <Main>
            <Card>
                <Grid container justifyContent='center' rowSpacing={3}>
                    <Grid item>
                        <h1>Buscar Pedidos</h1>
                    </Grid>
                    <Grid container item columnGap={3} alignItems='center'>
                        <Grid item><label>Id de Pedido</label></Grid>
                        <Grid item><TextField size='small'/></Grid>
                    </Grid>
                    <Grid item justifyContent='center'>
                        <Button onClick={()=>{navigator('1')}}>Buscar</Button>
                    </Grid>
                </Grid>
            </Card>
            
        </Main>
    )
}