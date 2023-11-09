import {Autocomplete, Backdrop, Box, Button, Card, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, Snackbar, TextField } from "@mui/material"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Main } from "../../../components/main"
import { createClient, createClientExternal, createEmployee } from "../../../utilities/allPostFetch"
import { useStyles } from "../recepcion.styles"

export const CreateClientRecepcion = () => {

    const initialInput = {error:false, value:''}

    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const [titleForm, setTitleForm] = useState(initialInput);
    const [ciForm, setCiForm] = useState(initialInput);
    const [nameForm, setNameForm] = useState(initialInput);
    const [phoneForm, setPhoneForm] = useState(initialInput);
    const [emailForm, setEmailForm] = useState(initialInput);
    const classes = useStyles();

    const createUser = async() => {

        ///Validation
        let error=false
        if(ciForm.value === ''){
            setCiForm({error:true, value:''})
            enqueueSnackbar('Ingrese el CI',{variant:'error'});
            error=true
        }
        if(ciForm.value.length < 8){
            setCiForm({error:true, value:ciForm.value})
            enqueueSnackbar('El CI no es correcto',{variant:'error'});
            error=true
        }
        if(nameForm.value === ''){
            setNameForm({error:true, value:''})
            enqueueSnackbar('Ingresa el nombre',{variant:'error'});
            error=true
        }
        if(titleForm.value === ''){
            setTitleForm({error:true, value:''})
            enqueueSnackbar('Ingrese el titulo de cortesia',{variant:'error'});
            error=true
        }

        if(!error){
            setLoading(true);
            const response = await createClientExternal({
                title:titleForm.value,
                name: nameForm.value,
                ci: ciForm.value,
                email: emailForm.value,
                phone:  phoneForm.value,
            });
            setLoading(false);
            handleResponse(response);
        }
    }

    const handleResponse = async(response) => {
        if(response.status === 201){
            enqueueSnackbar('Cliente creado correctamente',{variant:'success'});
            clearInputs();
        }
        if(response.status === 501){
            const data = await response.json();
            enqueueSnackbar(`${(data.reason || data.message)}`,{variant:'error'});
        }
    }

    const clearInputs = () => {
        setTitleForm(initialInput);
        setCiForm(initialInput);
        setNameForm(initialInput);
        setPhoneForm(initialInput);
        setEmailForm(initialInput);
    }

    return(
        <Main>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <Grid container justifyContent='center'>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    Crear Cliente Externo
                                </h1>
                            </Grid>

                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Titulo:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <Autocomplete
                                            
                                            fullWidth
                                            size='small'
                                            value={titleForm.value}
                                            onChange={(e)=>{setTitleForm({error:false, value:e.target.textContent})}}
                                            options={['Señor', 'Señora']}
                                            renderInput={(params) =><TextField
                                                                        error={titleForm.error}
                                                                        required
                                                                        label='Requerido'
                                                                        variant="standard"
                                                                        {...params}
                                                                    />}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Nombre Completo:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            value={nameForm.value}
                                            onChange={({target})=>{setNameForm({error:false, value:target.value})}}
                                            error={nameForm.error}
                                            required
                                            label='Requerido'
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>CI:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            value={ciForm.value}
                                            onChange={({target})=>{setCiForm({error:false, value:target.value})}}
                                            error={ciForm.error}
                                            required
                                            label='Requerido'
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Correo Electronico:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            type='email'
                                            value={emailForm.value}
                                            onChange={({target})=>{setEmailForm({error:false, value:target.value})}}
                                            label='Opccional'
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Telefono:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            value={phoneForm.value}
                                            onChange={({target})=>{setPhoneForm({error:false, value:target.value})}}
                                            label='Opccional'
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item container justifyContent='center'>
                                <Button variant='contained' onClick={()=>{createUser()}}>Crear</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
    </Main>
    )
}