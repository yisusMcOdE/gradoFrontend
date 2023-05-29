import { Box, Card, Grid, TextField, Button, RadioGroup, Radio,FormControlLabel } from "@mui/material"
import { useState } from "react";
import { Main } from "../../../components/main";
import { useStyles } from "./materials.style";


export const Recepcionar = () => {

    const pedido = require('../../../__mock__/pedido_listo.json');

    const [completo, setCompleto] = useState(true);

    const classes = useStyles();

    const DetailsBox = () => {
        return (
            <Grid container>
                <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                    <h3 style={{textAlign:'center'}}>DETALLE DE PEDIDO</h3>
                </Grid>
                <Grid item xs={12} className={classes.tableHeader} container>
                    <Grid item xs={1}>
                        <h3>N°</h3>
                    </Grid>
                    <Grid item xs={7}>
                        <h3>Material</h3>
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
        )
    }

    return (
        <Main>
            <Grid container direction='column' rowSpacing={3}>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            <h1>Recepcionar Material</h1>
                            <Grid item container columnGap={3} alignItems='center'>
                                <label>Id de pedido:</label>
                                <TextField size='small'/>
                            </Grid>
                            <Grid item display='flex' justifyContent='center'>
                                <Button>Buscar</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <Grid container direction='column'>
                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container>
                                    <Grid item xs={4}><label>Fecha de solicitud:</label></Grid>
                                    <Grid item xs><TextField size='small'/></Grid>
                                </Grid>
                                <Grid item container>
                                    <Grid item xs={4}><label>Fecha de entrega:</label></Grid>
                                    <Grid item xs><TextField size='small'/></Grid>
                                </Grid>
                                <Grid item container rowSpacing={3}>
                                    <Grid item xs={4}>
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
                                    <Grid item>
                                        <DetailsBox/>
                                    </Grid>
                                    <Grid item justifyContent='center'>
                                            <Button>Recepcionar</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}