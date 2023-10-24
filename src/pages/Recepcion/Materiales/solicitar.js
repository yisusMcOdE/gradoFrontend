import { Box, RadioGroup, FormControlLabel, Radio, IconButton, Button, Backdrop, CircularProgress, Snackbar, Alert } from "@mui/material";
import { Card, Grid, TextField, Autocomplete } from "@mui/material";
import { Main } from "../../../components/main";
import { useStyles } from "./materials.style";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from "react";
import { allMaterials } from "../../../utilities/allGetFetch";
import { createOrderMaterial } from "../../../utilities/allPostFetch";



export const Solicitar = () => {


    const detalleInicial = {
        idMaterial :'',
        requiredQuantity: {error:false, value:0},
        unidadDeMaterial: '',
        descripcion: {error:false, value:''},
        codigoPresupuestario: '000',
        codigoMaterial: '000'
    }

    const [loading, setLoading] = useState(false);
    const [alert,setAlert] = useState({open:false, severity:'', message:''});


    const [dataMaterial, setDataMaterial] = useState();
    const [form, setForm] = useState({
        estructura: '',
        fuente:'',
        paraEmplearse:'',
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

    const handleChange = (e, field, index) => {
        const details = [...form.detalle];
        if(field==='descripcion'){
            const name = e?.target.textContent;
            if(details.findIndex(item=>{return item.descripcion.value===name})===-1){
                details[index][field].value=name;
                const id = dataMaterial?.find(item=>item.name===name)?._id;
                details[index]['idMaterial']=id
            }
        }else{
            details[index][field].value=e.target.value;
        }
        setForm({...form, detalle:details})
    }


    const generateOrder = async() => {
        ///Validation
        let details = [...form.detalle];
        let error = false;

        details = details.map(item => {
            
            if(item.requiredQuantity.value===0){
                item.requiredQuantity.error = true;
                error=true;
            }
            if(item.descripcion.value===''){
                item.descripcion.error = true;
                error=true;
            }
            return item
        })
        setForm({...form, detalle:details})

        if(!error){
            let details = [...form.detalle];
            details = details.map(item => {
                return {
                    ...item,
                    requiredQuantity: item.requiredQuantity.value,
                    descripcion: item.descripcion.value
                }
            });

            const data = {
                details:details
            };
            const response = await createOrderMaterial(data);
            handleResponse(response);
        }else{
            setAlert({open:true, severity:'error', message:'Formulario Invalido * '});
        }

    }

    const handleResponse = async(response) => {
        if(response.status === 201){
            setAlert({open:true, severity:'success', message:'201: Creado'});
            clearInputs();
        }
        if(response.status === 304){
            const data = await response.json();
            setAlert({open:true, severity:'warning', message: `501: No Implementado`})
        }
    }

    const clearInputs = () => {
        setForm({
            estructura: '',
            fuente:'',
            paraEmplearse:'',
            detalle: [{...detalleInicial}],
        });
    }

    const loadData = async() => {
        const response = await allMaterials();
        if(response != 204)
            setDataMaterial(response);
        else
            setDataMaterial(204);
    }

    useEffect(()=>{
        loadData();
    },[]);


    const classes = useStyles();
    return (
        <Main>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={alert.open}
                onClose={()=>{setAlert({...alert, open:false})}}
                autoHideDuration={3000}
            >
                <Alert variant='filled' severity={alert.severity}>
                    {alert.message}
                </Alert>
            </Snackbar>

            <Grid container justifyContent='center'>
                <Grid item style={{width:'80%'}}>
                    <Card raised >
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

                                    {dataMaterial&&form.detalle.map((item,index)=>{
                                        return (
                                        <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                            <Grid item xs={1}>
                                                {index+1}
                                            </Grid>
                                            <Grid item xs={1}>
                                                <TextField
                                                    type='number'
                                                    error={item.requiredQuantity.error}
                                                    required
                                                    label='Requerido'
                                                    fullWidth 
                                                    variant="standard" 
                                                    size='small'
                                                    value={item.requiredQuantity.value}
                                                    onChange={(e)=>{handleChange(e,'requiredQuantity',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <TextField 
                                                    fullWidth 
                                                    disabled
                                                    variant="filled" 
                                                    size='small'
                                                    value={
                                                        (dataMaterial.find(material=>
                                                            material.name===item.descripcion.value
                                                        )?.unit) || ''}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Autocomplete
                                                    value={item.descripcion.value===undefined?'':item.descripcion.value}
                                                    onChange={(e)=>{handleChange(e,'descripcion',index)}}
                                                    size='small'
                                                    fullWidth
                                                    options={dataMaterial.map(item=>item.name)}
                                                    renderInput={(params) =><TextField
                                                                                error={item.requiredQuantity.error}
                                                                                required
                                                                                label='Requerido'
                                                                                variant="standard"
                                                                                {...params}
                                                                            />}
                                                    
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <TextField 
                                                    fullWidth 
                                                    id="filled-basic" 
                                                    variant="filled" 
                                                    size='small' 
                                                    value={item.codigoPresupuestario}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <TextField 
                                                    fullWidth 
                                                    id="filled-basic" 
                                                    variant="filled" 
                                                    size='small' 
                                                    value={item.codigoMaterial}
                                                />
                                            </Grid>
                                        </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>

                            <Grid item display='grid' justifyContent='center'>
                                <Button 
                                    variant="contained"
                                    onClick={()=>{generateOrder()}}
                                >
                                    Generar Documento
                                </Button>
                            </Grid>

                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}