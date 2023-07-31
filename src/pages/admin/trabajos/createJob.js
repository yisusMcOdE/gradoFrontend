import { IconButton, Autocomplete, Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, TextField, FilledInput, InputAdornment } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Main } from "../../../components/main"
import { createClient, createEmployee, createJob, createMaterial } from "../../../utilities/allPostFetch"
import { useStyles } from "../admin.styles"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { allMaterials } from "../../../utilities/allGetFetch"

export const CreateJob = () => {

    const costInitial = {
        lot : 0,
        price : 0,
        status: true
    }
    const materialInitial = {
        idMaterial : '',
        name : "",
        required : 0,
        produced : 0,
        status: true
    }

    const [costDetails, setCostDetails] = useState([costInitial]);
    const [materialDetails, setMaterialDetails] = useState([materialInitial]);
    const [materials, setMaterials] = useState();

    const navigator = useNavigate();

    const classes = useStyles();

    const addCost = () => {
        setCostDetails([...costDetails, costInitial]);
    }
    const addMaterial = () => {
        setMaterialDetails([...materialDetails, materialInitial]);
    }

    const removeCost = () => {
        const cost = [...costDetails];
        if(cost.length>1){
            cost.pop();
        }
        setCostDetails([...cost]);
    }
    const removeMaterial = () => {
        const material = [...materialDetails];
        if(material.length>1){
            material.pop();
        }
        setMaterialDetails([...material]);
    }

    const handleCreateJob = () => {
        const data = {
            name: document.getElementById('nameForm').value,
            description: document.getElementById('descriptionForm').value,
            time: document.getElementById('timeForm').value,
            area: document.getElementById('areaForm').value,
            cost : costDetails,
            materials: materialDetails,
            status: true,
        }
        createJob(data);

        document.getElementById('nameForm').value = "";
        document.getElementById('descriptionForm').value = "";
        setCostDetails([costInitial]);
        setMaterialDetails([materialInitial]);
    }

    const handleChange = (e, typeDetail, field, index) => {

        console.log(e);

        if(typeDetail==='cost'){
            const values = [...costDetails];
            values[index][field] = e.target.value;
            setCostDetails([...values]);
        }else{
            const values = [...materialDetails];
            if(typeDetail==='material' && field==='name'){
                values[index][field] = e?.target?.textContent;
                const idMaterial = materials.find(item=>item.name===e?.target?.textContent)?._id;
                values[index].idMaterial = idMaterial;
            }else{
                values[index][field] = e?.target?.value;
            }
            setMaterialDetails([...values]);
        }
    }

    const loadData  = async() => {
        const data = await allMaterials();
        ///const names = data.map(item=>item.name);
        setMaterials(data);
    }

    useEffect(()=>{loadData()},[]);


    return(
        materials&&
        <Main>
            <Grid container direction={'column'} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    Crear Trabajo
                                </h1>
                            </Grid>

                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Nombre del Trabajo:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="nameForm" size='small' />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>{'Tiempo de creacion en días:'}</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="timeForm" size='small' />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Descripcion:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField multiline id="descriptionForm" size='small' />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Area Correspondiente:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField multiline id="areaForm" size='small' />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid container>
                                    <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'5px 5px 0 0'}}>
                                        <h3 style={{textAlign:'center'}}>DETALLE DE COSTOS</h3>
                                    </Grid>

                                    <Box display='flex' className={classes.addRemoveBox} columnGap={2}>
                                        <IconButton size="small" onClick={addCost}>
                                            <AddIcon fontSize="inherit"/>
                                        </IconButton>
                                        <IconButton size="small" onClick={removeCost}>
                                            <RemoveIcon fontSize="inherit"/>
                                        </IconButton>
                                    </Box>

                                    <Grid item xs={12} className={classes.tableHeader} container>
                                        <Grid item xs={1}>
                                            <h3>N°</h3>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <h3>Cantidad:</h3>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <h3>Costo:</h3>
                                        </Grid>
                                    </Grid>

                                    {costDetails.map((item,index)=>{
                                        return (
                                        <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                            <Grid item xs={1}>
                                                {index+1}
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField 
                                                    fullWidth  
                                                    variant="filled" 
                                                    size='small'
                                                    value={item.lot} 
                                                    onChange={(e)=>{handleChange(e,'cost','lot',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField 
                                                    
                                                    fullWidth 
                                                    variant="filled" 
                                                    size='small' 
                                                    value={item.price} 
                                                    onChange={(e)=>{handleChange(e,'cost','price',index)}}
                                                />
                                            </Grid>
                                        </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid container>
                                    <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                                        <h3 style={{textAlign:'center'}}>DETALLE DE USO DE MATERIALES</h3>
                                    </Grid>

                                    <Box display='flex' className={classes.addRemoveBox} columnGap={2}>
                                        <IconButton size="small" onClick={addMaterial}>
                                            <AddIcon fontSize="inherit"/>
                                        </IconButton>
                                        <IconButton size="small" onClick={removeMaterial}>
                                            <RemoveIcon fontSize="inherit"/>
                                        </IconButton>
                                    </Box>

                                    <Grid item xs={12} className={classes.tableHeader} container>
                                        <Grid item xs={1}>
                                            <h3>N°</h3>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <h3>Material:</h3>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <h3>Cantidad requerida:</h3>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <h3>Cantidad producida:</h3>
                                        </Grid>
                                    </Grid>

                                    {materialDetails.map((item,index)=>{
                                        return (
                                        <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                            <Grid item xs={1}>
                                                {index+1}
                                            </Grid>
                                            <Grid item xs={3}> 
                                                <Autocomplete
                                                size='small'
                                                fullWidth
                                                options={materials.map(item=>item.name).concat([""])}
                                                renderInput={(params) =><TextField 
                                                                            variant="filled"
                                                                            {...params}
                                                                        />}
                                                value={item.name===undefined?'':item.name}
                                                onInputChange={(e)=>{handleChange(e,'material','name',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FilledInput
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            {((materials.find(element=>element.name===item.name))?.unit)||""}
                                                        </InputAdornment>}
                                                    fullWidth 
                                                    size='small'
                                                    value={item.required}
                                                    onChange={(e)=>{handleChange(e,'material','required',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField 
                                                    fullWidth 
                                                    id="filled-basic" 
                                                    variant="filled" 
                                                    size='small'
                                                    onChange={(e)=>{handleChange(e,'material','produced',index)}}
                                                    value={item.produced}
                                                />
                                            </Grid>
                                        </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>

                            <Grid item container justifyContent='center'>
                                <Button variant="contained" onClick={()=>{handleCreateJob()}}>Crear</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
    </Main>
    )
}