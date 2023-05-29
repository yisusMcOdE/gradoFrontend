import { IconButton, Autocomplete, Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, TextField, FilledInput, InputAdornment, Switch } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Main } from "../../../components/main"
import { createClient, createEmployee, createJob, createMaterial } from "../../../utilities/allPostFetch"
import { useStyles } from "../admin.styles"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { allMaterials, JobById } from "../../../utilities/allGetFetch";
import { cloneDeep } from "lodash"
import { updateJob } from "../../../utilities/allPutFetch"

export const DetailsJobAdmin = () => {

    const {id} = useParams();

    const costInitial = {
        lot : 0,
        price : 0,
        status: true
    }
    const materialInitial = {
        name : "",
        required : 0,
        produced : 0,
        status: true
    }

    
    const [materials, setMaterials] = useState();
    const [editionMode, setEditionMode] = useState(false);

    const [data, setData] = useState();
    const [dataEdition, setDataEdition] = useState();


    const navigator = useNavigate();

    const classes = useStyles();


    const addCost = () => {
        const newCost = [...dataEdition.cost];
        newCost.push(costInitial);
        setDataEdition({...dataEdition, cost:newCost});
    }
    const addMaterial = () => {
        const newMaterial = [...dataEdition.materials];
        newMaterial.push(materialInitial);
        setDataEdition({...dataEdition, materials:newMaterial});
    }
    const removeCost = () => {
        const newCost = [...dataEdition.cost];
        if(newCost.length > data.cost.length){
            newCost.pop();
        }
        setDataEdition({...dataEdition, cost:newCost});
    }
    const removeMaterial = () => {
        const newMaterial = [...dataEdition.materials];
        if(newMaterial.length > data.materials.length){
            newMaterial.pop();
        }
        setDataEdition({...dataEdition, materials:newMaterial});
    }


    const handleUpdateJob = () => {
        updateJob(id,dataEdition);
        setEditionMode(false);
        loadData();
    }

    const handleChange = (e, typeDetail, field, index) => {

        if(e==='status'){
            if(typeDetail==='cost'){
                const newCost = cloneDeep(dataEdition.cost);
                newCost[index][field] = !newCost[index][field];
                setDataEdition({...dataEdition,cost:newCost})
            }
            else
            {
                const newMaterial = cloneDeep(dataEdition.materials);
                newMaterial[index][field] = !newMaterial[index][field];
                setDataEdition({...dataEdition, materials:newMaterial});
            }
        }else{
            if(typeDetail==='cost'){
                const newCost = cloneDeep(dataEdition.cost);
                newCost[index][field] = e.target.value;
                setDataEdition({...dataEdition,cost:newCost})
            }
            else
            {
                const newMaterial = cloneDeep(dataEdition.materials);
                if(typeDetail==='material' && field==='name'){
                    newMaterial[index][field] = e?.target?.textContent;
                }else{
                    newMaterial[index][field] = e?.target?.value;
                }
                setDataEdition({...dataEdition, materials:newMaterial});
            }
        }
    }

    const loadData  = async() => {
        const dataMaterial = await allMaterials();
        setMaterials(dataMaterial);
        const dataJob = await JobById(id);
        setData({...dataJob});
        setDataEdition({...dataJob});
    }

    useEffect(()=>{loadData()},[]);


    return(
        (data&&materials)&&<Main>
        <Card>
            <Grid container direction='column' rowSpacing={3}>
                {
                    ///------TITLE------///
                }
                <Grid item>
                    <h1 className={classes.titlePage}>
                        Detalles de trabajo
                    </h1>
                </Grid>

                <Grid item container alignItems='center' justifyContent='flex-end'>
                    <Grid item >
                        <label>Modo Edicion</label>
                    </Grid>
                    <Grid item >
                        <Switch 
                            checked = {!editionMode}
                            onChange={()=>{
                                setEditionMode(prev => !prev);
                                setDataEdition({...data});
                            }}
                        />
                    </Grid>
                </Grid>
                
                {editionMode?<>
                <Grid item container direction='column' rowSpacing={1}>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Nombre del Trabajo:</label>
                        </Grid>
                        <Grid item >
                            <TextField 
                                value={dataEdition.name} 
                                id="nameForm" 
                                size='small'
                                onChange={({target})=>{setDataEdition({...dataEdition, name:target.value})}} 
                            />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Descripcion:</label>
                        </Grid>
                        <Grid item >
                            <TextField 
                                value={dataEdition.description} 
                                multiline 
                                id="descriptionForm" 
                                size='small'
                                onChange={({target})=>{setDataEdition({...dataEdition, description:target.value})}} 
                            />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Estado de trabajo:</label>
                        </Grid>
                        <Grid item >
                            <Button
                                fullWidth 
                                className={dataEdition.status?'activo':'inactivo'}
                                onClick={()=>{setDataEdition({...dataEdition, status:!dataEdition.status})}}
                            >
                                {dataEdition.status?'Habilitado':'Inhabilitado'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Grid container>
                        <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
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
                            <Grid item xs={3}>
                                <h3>Estado:</h3>
                            </Grid>
                        </Grid>

                        {dataEdition.cost.map((item,index)=>{
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
                                <Grid item xs={3} style={{padding:'0.5rem'}}>
                                    <Button 
                                        size='small' 
                                        fullWidth 
                                        className={item.status?'activo':'inactivo'}
                                        onClick={()=>{handleChange('status','cost','status',index)}}
                                    >
                                        {item.status?'Habilitado':'Inhabilitado'}
                                    </Button>
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
                            <Grid item xs={4}>
                                <h3>Material:</h3>
                            </Grid>
                            <Grid item xs={2.5}>
                                <h3>Cantidad requerida:</h3>
                            </Grid>
                            <Grid item xs={2.5}>
                                <h3>Cantidad producida:</h3>
                            </Grid>
                            <Grid item xs={2}>
                                <h3>Estado:</h3>
                            </Grid>
                        </Grid>

                        {dataEdition.materials.map((item,index)=>{
                            return (
                            <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                <Grid item xs={1}>
                                    {index+1}
                                </Grid>
                                <Grid item xs={4}> 
                                    <Autocomplete
                                    size='small'
                                    fullWidth
                                    options={materials.map(item=>item.name).concat([""])}
                                    renderInput={(params) =><TextField 
                                                                variant="filled"
                                                                {...params}
                                                            />}
                                    value={item.name}
                                    onChange={(e)=>{handleChange(e, 'material', 'name', index)}}
                                    />
                                </Grid>
                                <Grid item xs={2.5}>
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
                                <Grid item xs={2.5}>
                                    <TextField 
                                        fullWidth 
                                        variant="filled" 
                                        size='small'
                                        onChange={(e)=>{handleChange(e,'material','produced',index)}}
                                        value={item.produced}
                                    />
                                </Grid>
                                <Grid item xs={2} style={{padding:'0.5rem'}}>
                                    <Button 
                                        size='small' 
                                        fullWidth 
                                        className={item.status?'activo':'inactivo'}
                                        onClick={()=>{handleChange('status','materials','status',index)}}
                                    >
                                        {item.status?'Habilitado':'Inhabilitado'}
                                    </Button>
                                </Grid>
                            </Grid>
                            )
                        })}
                    </Grid>
                </Grid>

                <Grid item container justifyContent='center'>
                    <Button onClick={()=>{handleUpdateJob()}}>Editar</Button>
                </Grid>
                </>
                
                :

                ///-----EDITION MODE-----///

                <>
                <Grid item container direction='column' rowSpacing={1}>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Nombre del Trabajo:</label>
                        </Grid>
                        <Grid item >
                            <TextField value={data.name} disabled size='small' />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Descripcion:</label>
                        </Grid>
                        <Grid item >
                            <TextField value={data.description} disabled multiline size='small' />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Estado de trabajo:</label>
                        </Grid>
                        <Grid item >
                            <Button
                                fullWidth 
                                disabled
                                className={data.status?'activo':'inactivo'}
                            >
                                {data.status?'Habilitado':'Inhabilitado'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Grid container>
                        <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                            <h3 style={{textAlign:'center'}}>DETALLE DE COSTOS</h3>
                        </Grid>

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
                            <Grid item xs={3}>
                                <h3>Estado:</h3>
                            </Grid>
                        </Grid>

                        {data.cost.map((item,index)=>{
                            return (
                            <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                <Grid item xs={1}>
                                    {index+1}
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        disabled
                                        fullWidth  
                                        variant="filled" 
                                        size='small'
                                        value={item.lot} 
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField 
                                        disabled
                                        fullWidth 
                                        variant="filled" 
                                        size='small' 
                                        value={item.price} 
                                    />
                                </Grid>
                                <Grid item xs={3} style={{padding:'0.5rem'}}>
                                    <Button disabled size='small' fullWidth className={item.status?'activo':'inactivo'}>
                                        {item.status?'Habilitado':'Inhabilitado'}
                                    </Button>
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

                        <Grid item xs={12} className={classes.tableHeader} container>
                            <Grid item xs={1}>
                                <h3>N°</h3>
                            </Grid>
                            <Grid item xs={4}>
                                <h3>Material:</h3>
                            </Grid>
                            <Grid item xs={2.5}>
                                <h3>Cantidad requerida:</h3>
                            </Grid>
                            <Grid item xs={2.5}>
                                <h3>Cantidad producida:</h3>
                            </Grid>
                            <Grid item xs={2}>
                                <h3>Estado:</h3>
                            </Grid>
                        </Grid>

                        {data.materials.map((item,index)=>{
                            return (
                            <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                <Grid item xs={1}>
                                    {index+1}
                                </Grid>
                                <Grid item xs={4}> 
                                    <TextField disabled value={item.name} variant='filled' fullWidth size='small' />
                                </Grid>
                                <Grid item xs={2.5}>
                                    <FilledInput
                                        disabled
                                        startAdornment={
                                            <InputAdornment position="start">
                                                {((materials.find(element=>element.name===item.name))?.unit)||""}
                                            </InputAdornment>}
                                        fullWidth 
                                        size='small'
                                        value={item.required}
                                    />
                                </Grid>
                                <Grid item xs={2.5}>
                                    <TextField 
                                        disabled
                                        fullWidth 
                                        id="filled-basic" 
                                        variant="filled" 
                                        size='small'
                                        value={item.produced}
                                    />
                                </Grid>
                                <Grid item xs={2} style={{padding:'0.5rem'}}>
                                    <Button disabled size='small' fullWidth className={item.status?'activo':'inactivo'}>
                                        {item.status?'Habilitado':'Inhabilitado'}
                                    </Button>
                                </Grid>
                            </Grid>
                            )
                        })}
                    </Grid>
                </Grid>

                </>
            }
            </Grid>
        </Card>
    </Main>
    )
}