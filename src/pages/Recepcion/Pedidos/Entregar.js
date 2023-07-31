import { Button, Card, Grid, TextField, Box, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useState } from "react";
import { Main } from "../../../components/main";
import { useStyles } from "./pedidos.styles";

export const Entregar = () => {

    const pedido = require('../../../__mock__/pedido_listo.json');

    const classes = useStyles();

    const [completo, setCompleto] = useState(true);


    return (
        <Main>
            <Grid container direction='column' rowGap={2} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <Grid container direction='column' rowGap={2}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Entregar Pedido</h1>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={3}>
                                    <label>Id de Pedido</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField size='small'/>
                                </Grid>
                            </Grid>
                            <Grid item display='flex' justifyContent='center'>
                                <Button>Buscar Pedido</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <Grid container direction='column'>
                            <Grid item container direction='column' rowGap={1}>
                                <Grid item container columnGap={3}>
                                    <Grid item xs={3}>
                                        <label>Cliente:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField size='small' disabled value={pedido[0].cliente}/>
                                    </Grid>
                                </Grid>

                                <Grid item container columnGap={3}>
                                    <Grid item xs={3}>
                                        <label>Fecha de entrega:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField size='small' disabled value={pedido[0].fecha_entrega}/>
                                    </Grid>
                                </Grid>

                                <Grid item container columnGap={3}>
                                    <Grid item xs={3}>
                                        <label>Entregado a:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField size='small' />
                                    </Grid>
                                </Grid>

                                <Grid item container columnGap={3}>
                                    <Grid item xs={3}>
                                        <label>Estado de entrega</label>
                                    </Grid>
                                    <Grid item xs>
                                        <Box >
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={completo}
                                                onChange={()=>{setCompleto(prev => !prev)}}
                                                row
                                            >
                                                <FormControlLabel value={true} control={<Radio />} label="Completo" />
                                                <FormControlLabel value={false} control={<Radio />} label="Parcial" />
                                            </RadioGroup>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Grid item>
                                    <Grid container>
                                        <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                                            <h3 style={{textAlign:'center'}}>DETALLE DE PEDIDO</h3>
                                        </Grid>
                                        <Grid item xs={12} className={classes.tableHeader} container>
                                            <Grid item xs={1}>
                                                <h3>N°</h3>
                                            </Grid>
                                            <Grid item xs={7}>
                                                <h3>Trabajo</h3>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <h3>Cant. Solicitada</h3>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <h3>Cant. Entregada</h3>
                                            </Grid>
                                        </Grid>
                                        {pedido[0].detalle.map((item,index)=>{
                                            return (
                                            <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                                <Grid item xs={1}>
                                                    {index+1}
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <TextField disabled fullWidth multiline id="filled-basic" variant="filled" size='small' value={item.trabajo}/>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <TextField disabled fullWidth multiline id="filled-basic" variant="filled" size='small' value={item.cantidad_solicitada}/>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <TextField disabled={completo} fullWidth multiline id="filled-basic" variant="filled" size='small' value={item.cantidad_solicitada}/>
                                                </Grid>
                                            </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Grid>

                                <Grid item display='flex' justifyContent='center'>
                                    <Button variant="contained">Entregar / Generar Acta</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
        
    )
}