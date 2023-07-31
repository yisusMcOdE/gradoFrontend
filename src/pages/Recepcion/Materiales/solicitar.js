import { Box, RadioGroup, FormControlLabel, Radio, IconButton, Button } from "@mui/material";
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
        requiredQuantity: 0,
        unidadDeMaterial: '',
        descripcion: '',
        codigoPresupuestario: '000',
        codigoMaterial: '000'
    }

    const [dataMaterial, setDataMaterial] = useState();

    console.log(dataMaterial);

    const [form, setForm] = useState({
        estructura: '',
        fuente:'',
        paraEmplearse:'',
        detalle: [detalleInicial],
    });

    const handleChange = (e, field, index) => {
        const details = [...form.detalle];
        if(field==='descripcion'){
            const name = e?.target.textContent;
            details[index][field]=name;
            const id = dataMaterial?.find(item=>item.name===name)?._id;
            details[index]['idMaterial']=id
        }else{
            details[index][field]=e.target.value;
        }
        setForm({...form, detalle:details})
    }

    const generateOrder = () => {
        const data = {
            details:[...form.detalle]
        };
        createOrderMaterial(data);
    }

    const loadData = async() => {
        setDataMaterial(await allMaterials());
    }

    useEffect(()=>{
        loadData();
    },[]);

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
                                                    fullWidth 
                                                    id="filled-basic" 
                                                    variant="filled" 
                                                    size='small'
                                                    value={item.requiredQuantity}
                                                    onChange={(e)=>{handleChange(e,'requiredQuantity',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <TextField 
                                                    fullWidth 
                                                    id="filled-basic"
                                                    disabled
                                                    variant="filled" 
                                                    size='small'
                                                    value={
                                                        (dataMaterial.find(material=>
                                                            material.name===item.descripcion
                                                        )?.unit) || ''}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Autocomplete
                                                    size='small'
                                                    fullWidth
                                                    options={dataMaterial.map(item=>item.name)}
                                                    renderInput={(params) =><TextField 
                                                                                variant="filled"
                                                                                {...params}
                                                                            />}
                                                    value={item.descripcion===undefined?'':item.descripcion}
                                                    onChange={(e)=>{handleChange(e,'descripcion',index)}}
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