import { Button, Card, Grid, TextField, Autocomplete, Dialog } from "@mui/material"
import { useState } from "react";
import { useStyles } from "./pedidos.styles";


export const Confirmar = () => {

    const clientes = require ('../../../__mock__/clientes_nombre.json');

    const classes = useStyles();

    const [modal, setModal] = useState(false);

    return (
        <>
        <Grid container>
            <Grid item xs className={classes.areaContainer}>
                <Card raised className={classes.confirmarPedidoContainer}>
                    <Grid container direction='column' rowSpacing={3}>
                        <Grid item>
                            <h1 className={classes.titlePage}>Confirmar Pedido</h1>
                        </Grid>

                        <Grid item container direction='column' rowSpacing={1}>
                            <Grid item xs='auto' container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Id de Pedido:</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField sx={{ width: '80%' }} size='small'/>
                                </Grid>
                            </Grid>
                            <Grid item xs='auto' container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Cliente:</label>
                                </Grid>
                                <Grid item xs>
                                    <Autocomplete
                                    size='small'
                                    disablePortal
                                    options={clientes}
                                    id="combo-box-demo"
                                    sx={{ width: '80%' }}
                                    renderInput={(params) => <TextField {...params}/>}/>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item display='flex' justifyContent='center'>
                            <Button onClick={()=>{setModal(prev => !prev)}}>Buscar</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
        <Dialog onClose={()=>{setModal(prev => !prev)}} open={modal}>
            <Card>
                <Grid container direction='column' rowSpacing={2}>
                    <Grid item>
                        <h1 style={{margin:'0', textAlign:'center'}}>AVISO</h1>
                    </Grid>
                    <Grid item>
                        <p>
                            ¿Esta seguro que desea confirmar el pago del siguiente pedido?
                        </p>
                    </Grid>
                    <Grid item container direction='column' rowSpacing={1}>
                        <Grid item container columnSpacing={2} alignItems='center'>
                            <Grid item xs={4}>
                                <label>Id de pedido</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small' disabled value='557733442'/>
                            </Grid>
                        </Grid>
                        <Grid item container columnSpacing={2} alignItems='center'>
                            <Grid item xs={4}>
                                <label>Id de pago</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small' disabled value='0011234'/>
                            </Grid>
                        </Grid>
                        <Grid item container columnSpacing={2} alignItems='center'>
                            <Grid item xs={4}>
                                <label>Cliente</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small' disabled value='Jesus Morales '/>
                            </Grid>
                        </Grid>
                        <Grid item container columnSpacing={2} alignItems='center'>
                            <Grid item xs={4}>
                                <label>Costo</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small' disabled value='Bs. 50'/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container justifyContent='space-evenly'>
                        <Grid item>
                            <Button>Sí</Button>
                        </Grid>
                        <Grid item>
                            <Button>No</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Dialog>
        </>
    )
}