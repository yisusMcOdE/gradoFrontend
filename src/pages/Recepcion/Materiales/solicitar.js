import { Box, RadioGroup, FormControlLabel, Radio, IconButton, Button } from "@mui/material";
import { Card, Grid, TextField, Autocomplete } from "@mui/material";
import { Main } from "../../../components/main";
import { useStyles } from "./materials.style";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from "react";



export const Solicitar = () => {

    const detalleInicial = {
        cantidadPedida: '',
        unidadDeMaterial: '',
        Descripcion: '',
        codigoPresupuestario: '',
        codigoMaterial: ''
    }
    const [form, setForm] = useState({
        estructura: '',
        fuente:'',
        paraEmplearse:'',
        detalle: [detalleInicial],
    });

    const DetailsBox = () => {
        return (
            <Grid container>

                <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                    <h3 style={{textAlign:'center'}}>DETALLE DE PEDIDO</h3>
                </Grid>

                <Box display='flex' className={classes.addRemoveBox} columnGap={2}>
                    <IconButton size="small" onClick={addDetail}>
                        <AddIcon fontSize="inherit"/>
                    </IconButton>
                    <IconButton size="small" onClick={removeDetail}>
                        <RemoveIcon fontSize="inherit"/>
                    </IconButton>
                </Box>

                <Grid item xs={12} className={classes.tableHeader} container>
                    <Grid item xs={1}>
                        <h3>N°</h3>
                    </Grid>
                    <Grid item xs={1}>
                        <h3>Cant. Pedida</h3>
                    </Grid>
                    <Grid item xs={2}>
                        <h3>Unid. de Medidad</h3>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Descripcion</h3>
                    </Grid>
                    <Grid item xs={2}>
                        <h3>Cod. Presupuestario</h3>
                    </Grid>
                    <Grid item xs={2}>
                        <h3>Cod. Material</h3>
                    </Grid>
                </Grid>

                {form.detalle.map((item,index)=>{
                    return (
                    <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                        <Grid item xs={1}>
                            {index+1}
                        </Grid>
                        <Grid item xs={1}>
                            <TextField fullWidth id="filled-basic" variant="filled" size='small' />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField fullWidth id="filled-basic" variant="filled" size='small' />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField fullWidth multiline id="filled-basic" variant="filled" size='small' />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField fullWidth id="filled-basic" variant="filled" size='small' />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField fullWidth id="filled-basic" variant="filled" size='small' />
                        </Grid>
                    </Grid>
                    )
                })}
            </Grid>
        )
    }
    const addDetail = () => {
        setForm({...form, detalle:[...form.detalle, detalleInicial]})
    }

    const removeDetail = () => {
        const details = [...form.detalle];
        if(details.length>1){
            details.pop();
        }
        setForm({...form, detalle:details});
    }
    


    const classes = useStyles();
    return (
        <Main>
            <Card raised style={{width:'700px'}}>
                <Grid container direction='column' rowSpacing={3}>
                    <Grid item>
                        <h1 className={classes.titlePage}>Pedido de Materiales</h1>
                    </Grid>

                    <Grid item container direction='column' rowSpacing={2}>
                        <Grid item container>
                            <Grid item xs={4}>
                                <label>Estructura Programatica:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small'/>
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={4}>
                                <label>Fuente de Financiamiento:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small'/>
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={4}>
                                <label>Para emplearse en:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField multiline/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <DetailsBox/>
                    </Grid>

                    <Grid item display='grid' justifyContent='center'>
                        <Button>
                            Generar Documento
                        </Button>
                    </Grid>

                </Grid>
            </Card>
        </Main>
    )
}