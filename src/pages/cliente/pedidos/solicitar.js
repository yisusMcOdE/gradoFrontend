import { Button, Card, Collapse, Grid, Slide, TextField, Box, IconButton, Autocomplete,  } from "@mui/material"
import { useState } from "react";
import { Main } from "../../../components/main";
import { useStyles } from "../cliente.styles";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {Checkbox} from "@mui/material";


export const SolicitarCliente = () => {

    const detalleInicial = {
        trabajo: '',
        detalle: '',
        cantidad: '',
        costo: 0
    }
    const classes = useStyles();
    const [withMaterials, setWithMaterials] = useState(false);
    const [stepForm, setStepForm] = useState(1);
    const [form, setForm] = useState({
        institucion: '',
        detalle: [detalleInicial],
    });

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
                    <Grid item xs={3}>
                        <h3>Trabajo</h3>
                    </Grid>
                    <Grid item xs={5}>
                        <h3>Detalle</h3>
                    </Grid>
                    <Grid item xs={1.5}>
                        <h3>Cantidad</h3>
                    </Grid>
                    <Grid item xs={1.5}>
                        <h3>Costo</h3>
                    </Grid>
                </Grid>

                {form.detalle.map((item,index)=>{
                    return (
                    <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                        <Grid item xs={1}>
                            {index+1}
                        </Grid>
                        <Grid item xs={3}> 
                            <Autocomplete
                            size='small'
                            disablePortal
                            id="combo-box-demo"
                            fullWidth
                            renderInput={(params) => <TextField {...params}/>}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField fullWidth multiline id="filled-basic" variant="filled" size='small' />
                        </Grid>
                        <Grid item xs={1.5}>
                            <TextField fullWidth id="filled-basic" variant="filled" size='small' />
                        </Grid>
                        <Grid item xs={1.5}>
                            <TextField fullWidth id="filled-basic" variant="filled" size='small' />
                        </Grid>
                    </Grid>
                    )
                })}
            </Grid>
        )
    }

    return(
        <Main>
            <Card raised>
                <Grid container direction='column' rowGap={3}>
                    <Grid item>
                        <h1 className={classes.titlePage}>Solicitar Pedido</h1>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={12}>
                            <Collapse in={stepForm===1}>
                                <Grid container direction='column' rowGap={3}>
                                    <Grid item container columnSpacing={3} alignItems='center'>
                                        <Grid item xs={3}>
                                            <label>Institucion:</label>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <TextField size='small'/>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <DetailsBox/>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Grid>
                        <Grid item xs={12}>
                            <Collapse in={stepForm===2} orientation='vertical'>
                                <Grid container direction='column' rowSpacing={3}>
                                    <Grid item>
                                        <h2>Nota Importante:</h2>
                                        <p>
                                            Para garantizar una pronta ejecucion de su pedido debera recepcionar a 
                                            oficinas de la imprenta todo el material necesario para su trabajo, 
                                            el cual sera calculado automaticamente mediante este sistema, ademas de 
                                            que se le proporcionara un formulario listo para imprimir el cual debera ser entregado a almacenes
                                            de la Universidad Autonoma Tomas Frias.
                                        </p>
                                    </Grid>

                                    <Grid item container justifyContent='space-evenly'>
                                        <Grid item>
                                            <Checkbox
                                                checked={!withMaterials}
                                                onChange={()=>{setWithMaterials(prev => !prev)}}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <label>No llevare materiales</label>
                                        </Grid>
                                        <Grid item>
                                            <Checkbox
                                                checked={withMaterials}
                                                onChange={()=>{setWithMaterials(prev => !prev)}}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <label>Si les proporcionare materiales</label>
                                        </Grid>
                                    </Grid>
                                    <Grid item display='flex' justifyContent='center'>
                                        {
                                            !withMaterials?
                                                <label>*Si no existiese material necesario su pedido podria retrasarse*</label> :
                                                <label>*Su pedido sera agendado al momento de que recepcionemos su material*</label>
                                        }
                                    </Grid>
                                    {
                                        withMaterials&&
                                        <Grid item display='flex' justifyContent='center'>
                                            <Button>Calcular Material</Button>
                                        </Grid>
                                    }
                                </Grid>
                            </Collapse>
                        </Grid>
                        <Grid item xs={12}>
                            <Collapse in={stepForm===3}>
                                <Grid container direction='column' rowSpacing={2}>
                                    <Grid item container>
                                        <Grid item xs={2}>
                                            <label>Inttitucion:</label>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <TextField size='small'/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Grid item xs={2}>
                                            <label>Trabajo(s):</label>
                                        </Grid>
                                        <Grid item xs={9} container direction='column' rowSpacing={1}>
                                            <Grid item container columnSpacing={3}>
                                                <Grid item xs={4}>
                                                    <TextField size='small'/>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <TextField size='small'/>
                                                </Grid>
                                            </Grid>
                                            <Grid item container columnSpacing={3}>
                                                <Grid item xs={4}>
                                                    <TextField size='small'/>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <TextField size='small'/>
                                                </Grid>
                                            </Grid>
                                            <Grid item container columnSpacing={3}>
                                                <Grid item xs={4}>
                                                    <TextField size='small'/>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <TextField size='small'/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Grid item xs={2}>
                                            <label>Materiales Propios:</label>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <TextField size='small'/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Grid>
                    </Grid>
                    <Grid item container justifyContent='space-evenly'>
                        {
                            stepForm!==1&&
                            <Grid item xs='auto'>
                                <Button onClick={()=>{
                                    const value = stepForm===2?1:2;
                                    setStepForm(value);
                                }}>
                                    Anterior
                                </Button>
                            </Grid>
                        }
                        
                        <Grid item xs='auto'>
                            <Button onClick={()=>{
                                const value = stepForm===1?2:3;
                                setStepForm(value);
                            }}>
                                {
                                    stepForm===1 && 'Siguiente'
                                }
                                {
                                    stepForm===2 && 'Siguiente'
                                }
                                {
                                    stepForm===3 && 'Finalizar'
                                }
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Main>
    )
}