import { IconButton, Autocomplete, Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, TextField, FilledInput, InputAdornment, Switch, Backdrop, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, Slide, DialogActions, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
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

    const initialInput = {error:false, value:''}

    const {id} = useParams();

    const costInitial = {
        lot : initialInput,
        price : initialInput,
        status: {error:false, value:true}
    }
    const materialInitial = {
        name : initialInput,
        required : initialInput,
        produced : initialInput,
        status: {error:false, value:true}
    }

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({open:false, severity:'', message:''});

    
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

    const handleResponse = async(response) => {
        if(response.status === 202){
            setAlert({open:true, severity:'success', message:'202: Actualizado'});
            await setEditionMode(false);
            await loadData();
        }
        if(response.status === 404){
            setAlert({open:true, severity:'error', message:'404: No encontrado'});
        }
        if(response.status === 409){
            setAlert({open:true, severity:'warning', message:'409: Conflicto'});
        }
        if(response.status === 304){
            setAlert({open:true, severity:'warning', message:'304: No Modificado'})
        }
    }


    const handleUpdateJob = async() => {
        
        ///VALIDACION
        let error = false
        let dataEditionAux = cloneDeep(dataEdition);

        if(dataEditionAux.name.value===''){
            dataEditionAux.name.error = true
            error=true
        }
        if(dataEditionAux.area.value===''){
            dataEditionAux.area.error = true
            error=true
        }
        dataEditionAux.cost = dataEditionAux.cost.map(item=>{
            if(item.lot.value === ''){
                item.lot.error = true
                error=true
            }
            if(item.price.value === ''){
                item.price.error = true
                error=true
            }
            return item
        })
        dataEditionAux.materials = dataEditionAux.materials.map(item=>{
            if(item.name.value === ''){
                item.name.error = true
                error=true
            }
            if(item.produced.value === ''){
                item.produced.error = true
                error=true
            }
            if(item.required.value === ''){
                item.required.error = true
                error=true
            }
            return item
        })
        setDataEdition({...dataEditionAux})

        if(!error){
            ///Diferenciacion
            const newData = {
                cost:[],
                materials:[]
            }
            const update = (oldValue, newValue, key, reference) =>{
                if(newValue !== oldValue)
                    reference[key]=newValue
            }
            for (const key in dataEdition) {
                if(key==='cost'){
                    for (let index = 0; index < dataEdition.cost.length; index++) {
                        const item = dataEdition.cost[index];
                        const newCost = {}
                            for (const keyCost in dataEdition.cost[index]) {
                                if(keyCost!=='_id')
                                    update(data.cost[index][keyCost].value, dataEdition.cost[index][keyCost].value, keyCost, newCost)
                            }
                        if(Object.keys(newCost).length!==0){
                            newCost._id = data.cost[index]._id;
                            newData.cost.push(newCost)
                        }
                    }
                }else{
                    if(key==='materials'){
                        for (let index = 0; index < dataEdition.materials.length; index++) {
                            const item = dataEdition.materials[index];
                            const newMaterial = {}
                                for (const keyMaterial in dataEdition.materials[index]) {
                                    if(keyMaterial!=='_id')
                                        update(data.materials[index][keyMaterial].value, dataEdition.materials[index][keyMaterial].value, keyMaterial, newMaterial)
                                }
                            if(Object.keys(newMaterial).length!== 0){
                                newMaterial._id = data.materials[index]._id;
                                newData.materials.push(newMaterial)
                            }
                        }
                    }else{
                        update(data[key].value, dataEdition[key].value, key, newData)
                    }
                }
            }

            if(newData.cost.length===0)
                delete newData.cost
            if(newData.materials.length===0)
                delete newData.materials

            setLoading(true);
            const response = await updateJob(id,newData);
            setLoading(false);
            handleResponse(response);
        }else{
            setAlert({open:true, severity:'error', message:'Formulario Invalido * '});
        }
    }

    const handleChange = (e, typeDetail, field, index) => {

        if(e==='status'){
            if(typeDetail==='cost'){
                const newCost = cloneDeep(dataEdition.cost);
                newCost[index][field].value = !newCost[index][field].value;
                setDataEdition({...dataEdition,cost:newCost})
            }
            else
            {
                const newMaterial = cloneDeep(dataEdition.materials);
                newMaterial[index][field].value = !newMaterial[index][field].value;
                setDataEdition({...dataEdition, materials:newMaterial});
            }
        }else{
            if(typeDetail==='cost'){
                const newCost = cloneDeep(dataEdition.cost);
                newCost[index][field].value = e.target.value;
                setDataEdition({...dataEdition,cost:newCost})
            }
            else
            {
                const newMaterial = cloneDeep(dataEdition.materials);
                if(typeDetail==='material' && field==='name'){
                    newMaterial[index][field].value = e?.target?.textContent;
                }else{
                    newMaterial[index][field].value = e?.target?.value;
                }
                setDataEdition({...dataEdition, materials:newMaterial});
            }
        }
    }

    const loadData  = async() => {
        const dataMaterial = await allMaterials();
        setMaterials(dataMaterial);

        let dataJob = await JobById(id);

        dataJob = {
                name:{error:false, value:dataJob.name},
                description:{error:false, value:dataJob.description},
                area:{error:false, value:dataJob.area},
                status:{error:false, value:dataJob.status},
                cost:dataJob.cost.map(dataJobCost=>{
                    return {
                        _id:dataJobCost._id,
                        lot:{error:false, value:dataJobCost.lot},
                        price:{error:false, value:dataJobCost.price},
                        status:{error:false, value:dataJobCost.status},
                    }
                }),
                materials:dataJob.materials.map(dataJobMaterial=>{
                    return {
                        _id:dataJobMaterial._id,
                        name:{error:false, value:dataJobMaterial.name},
                        required:{error:false, value:dataJobMaterial.required},
                        produced:{error:false, value:dataJobMaterial.produced},
                        status:{error:false, value:dataJobMaterial.status},
                    }
                })
            }
        
        setData({...dataJob});
        setDataEdition({...dataJob});
    }

    useEffect(()=>{loadData()},[]);


    return(
        (data&&materials)&&
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

            <Grid container direction={'column'} alignItems={'center'}>
                <Grid item style={{width:'90%'}}>
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
                                            error={dataEdition.name.error}
                                            required
                                            label='Requerido'
                                            value={dataEdition.name.value} 
                                            size='small'
                                            onChange={({target})=>{setDataEdition({...dataEdition, name:{...dataEdition.name, value:target.value}})}} 
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Descripcion:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField 
                                            value={dataEdition.description.value}
                                            label='Opccional'
                                            multiline 
                                            size='small'
                                            onChange={({target})=>{setDataEdition({...dataEdition, description:{error:false, value:target.value}})}} 
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Area:</label>
                                    </Grid>
                                    <Grid item >
                                        
                                        <Autocomplete
                                            onChange={({target})=>{setDataEdition({...dataEdition, area:{error:false, value:target.textContent}})}}
                                            size='small'
                                            fullWidth
                                            options={['Impresion Digital','Empastado', 'Tipografia']}
                                            sx={{ width: 200 }}
                                            value={dataEdition.area.value} 
                                            renderInput={(params) => <TextField 
                                                label='Requerido'
                                                required
                                                error={dataEdition.area.error}
                                                {...params}
                                            />}
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
                                            className={dataEdition.status.value?'activo':'inactivo'}
                                            onClick={()=>{setDataEdition({...dataEdition, status:{error:false, value:!dataEdition.status.value}})}}
                                        >
                                            {dataEdition.status.value?'Habilitado':'Suspendido'}
                                        </Button>
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
                                                    type='number'
                                                    fullWidth  
                                                    variant='standard'
                                                    error={item.lot.error}
                                                    required
                                                    label='Requerido'                                                    
                                                    size='small'
                                                    value={item.lot.value} 
                                                    onChange={(e)=>{handleChange(e,'cost','lot',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField
                                                    type='number'
                                                    fullWidth 
                                                    variant='standard'
                                                    error={item.price.error}
                                                    required
                                                    label='Requerido'
                                                    size='small' 
                                                    value={item.price.value} 
                                                    onChange={(e)=>{handleChange(e,'cost','price',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={3} style={{padding:'0.5rem'}}>
                                                <Button 
                                                    size='small' 
                                                    fullWidth 
                                                    className={item.status.value?'activo':'inactivo'}
                                                    onClick={()=>{handleChange('status','cost','status',index)}}
                                                >
                                                    {item.status.value?'Habilitado':'Suspendido'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid container>
                                    <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'5px 5px 0 0'}}>
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
                                                                                required
                                                                                error={item.name.error}
                                                                                label='Requerido'
                                                                                variant="standard"
                                                                                {...params}
                                                                            />}
                                                    value={item.name.value}
                                                    onChange={(e)=>{handleChange(e, 'material', 'name', index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={2.5}>
                                                <TextField
                                                    variant="standard"
                                                    type='number'
                                                    min='1'
                                                    InputProps={{
                                                        endAdornment:
                                                            <InputAdornment position='start'>
                                                                {((materials.find(element=>element.name===item.name.value))?.unit?.concat('(s)'))||''}
                                                            </InputAdornment>
                                                      }}
                                                    value={item.required.value}
                                                    onChange={(e)=>{handleChange(e,'material','required',index)}}
                                                    required
                                                    error={item.required.error}
                                                    label='Requerido'
                                                />
                                            </Grid>
                                            <Grid item xs={2.5}>
                                                <TextField
                                                    type='number'
                                                    error={item.produced.error}
                                                    required
                                                    label='Requerido'
                                                    variant='standard'
                                                    fullWidth 
                                                    size='small'
                                                    onChange={(e)=>{handleChange(e,'material','produced',index)}}
                                                    value={item.produced.value}
                                                />
                                            </Grid>
                                            <Grid item xs={2} style={{padding:'0.5rem'}}>
                                                <Button 
                                                    size='small' 
                                                    fullWidth 
                                                    className={item.status.value?'activo':'inactivo'}
                                                    onClick={()=>{handleChange('status','materials','status',index)}}
                                                >
                                                    {item.status.value?'Habilitado':'Suspendido'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>

                            <Grid item container justifyContent='center'>
                                <Button variant="contained" onClick={()=>{handleUpdateJob()}}>Editar</Button>
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
                                        <TextField value={data.name.value} disabled size='small' />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Descripcion:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField value={data.description.value} disabled multiline size='small' />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Area:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField 
                                            value={data.area.value}
                                            disabled
                                            multiline 
                                            size='small'
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
                                            disabled
                                            className={data.status.value?'activo':'inactivo'}
                                        >
                                            {data.status?'Habilitado':'Suspendido'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid container>
                                    <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'5px 5px 0 0'}}>
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
                                                    value={item.lot.value} 
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField 
                                                    disabled
                                                    fullWidth 
                                                    variant="filled" 
                                                    size='small' 
                                                    value={item.price.value} 
                                                />
                                            </Grid>
                                            <Grid item xs={3} style={{padding:'0.5rem'}}>
                                                <Button disabled size='small' fullWidth className={item.status.value?'activo':'inactivo'}>
                                                    {item.status.value?'Habilitado':'Suspendido'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid container>
                                    <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'5px 5px 0 0'}}>
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
                                                <TextField disabled value={item.name.value} variant='filled' fullWidth size='small' />
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
                                                    value={item.required.value}
                                                />
                                            </Grid>
                                            <Grid item xs={2.5}>
                                                <TextField 
                                                    disabled
                                                    fullWidth 
                                                    id="filled-basic" 
                                                    variant="filled" 
                                                    size='small'
                                                    value={item.produced.value}
                                                />
                                            </Grid>
                                            <Grid item xs={2} style={{padding:'0.5rem'}}>
                                                <Button disabled size='small' fullWidth className={item.status.value?'activo':'inactivo'}>
                                                    {item.status?'Habilitado':'Suspendido'}
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
                </Grid>
            </Grid>
    </Main>
    )
}