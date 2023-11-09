import { Autocomplete, Backdrop, Box, Button, Card, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, Snackbar, TextField } from "@mui/material"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Main } from "../../../components/main"
import { createClient, createEmployee, createMaterial } from "../../../utilities/allPostFetch"
import { useStyles } from "../admin.styles"

export const CreateMaterial = () => {

    const initialInput = {error:false, value:''};
    const { enqueueSnackbar } = useSnackbar();


    const [loading, setLoading] = useState(false);

    const [nameForm, setNameForm] = useState(initialInput);
    const [unitForm, setUnitForm] = useState(initialInput);

    const classes = useStyles();

    const createUser = async() => {

        ///Validacion
        let error = false;

        if((nameForm.value==='')){
            setNameForm({error:true, value:''})
            enqueueSnackbar('Ingresa el nombre del material',{variant:'error'});            
            error=true
        }
        if((unitForm.value==='')){
            setUnitForm({error:true, value:''})
            enqueueSnackbar('Ingresa la unidad de medida',{variant:'error'});            
            error=true
        }

        if(!error){
            setLoading(true);
            const response = await createMaterial({
                name:nameForm.value,
                unit:unitForm.value
            });
            setLoading(false);
            handleResponse(response);
        }
    }

    const handleResponse = async(response) => {
        if(response.status === 201){
            enqueueSnackbar('Material creado correctamente',{variant:'success'});            

            clearInputs();
        }
        if(response.status === 501){
            const data = await response.json();
            enqueueSnackbar(`${(data.reason || data.message)}`,{variant:'warning'});            

        }
    }

    const clearInputs = () => {
        setNameForm(initialInput);
        setUnitForm(initialInput);
    }

    return(
        <Main>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container direction={'column'} rowGap={2} alignItems={'center'}>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    Crear Material
                                </h1>
                            </Grid>

                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Nombre:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField 
                                            value={nameForm.value}
                                            onChange={({target})=>setNameForm({...nameForm, value:target.value})}
                                            required
                                            label='Requerido'
                                            error={nameForm.error}
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Unidad de medida:</label>
                                    </Grid>
                                    <Grid item >
                                    <TextField 
                                            value={unitForm.value}
                                            onChange={({target})=>setUnitForm({...unitForm, value:target.value})}
                                            required
                                            label='Requerido'
                                            error={unitForm.error}
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item container justifyContent='center'>
                                <Button variant="contained" onClick={()=>{createUser()}}>Crear</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}