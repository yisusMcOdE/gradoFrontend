import { Autocomplete, Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Main } from "../../../components/main"
import { createClient, createEmployee } from "../../../utilities/allPostFetch"
import { useStyles } from "../admin.styles"

export const CreateUser = () => {

    const navigator = useNavigate();

    const [client, setClient] = useState(true);

    const classes = useStyles();

    const createUser = () => {
        if(client){
            const data = {
                user: document.getElementById('userForm').value,
                password: document.getElementById('passwordForm').value,
                institution: document.getElementById('nameForm').value,
                email: document.getElementById('emailForm').value,
                address: document.getElementById('addressForm').value,
                phone:  document.getElementById('phoneForm').value,
                status: true,
                role:'cliente'
            }
            createClient(data);
            navigator('/admin/usuarios');
        }else{
            const data = {
                user: document.getElementById('userForm').value,
                password: document.getElementById('passwordForm').value,
                name: document.getElementById('nameForm').value,
                email: document.getElementById('emailForm').value,
                phone: document.getElementById('phoneForm').value,
                role: document.getElementById('roleForm').value,
                status: true,
            }
            createEmployee(data);
            navigator('/admin/usuarios');
        }
    }

    return(
        <Main>
        <Card>
            <Grid container direction='column' rowSpacing={3}>
                {
                    ///------TITLE------///
                }
                <Grid item>
                    <h1 className={classes.titlePage}>
                        Crear Usuario
                    </h1>
                </Grid>

                <Grid item>
                    <Box display='flex' justifyContent= 'center' >
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={client}
                            onChange={()=>{setClient(prev => !prev)}}
                            row
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Clientes" />
                            <FormControlLabel value={false} control={<Radio />} label="Empleados" />
                        </RadioGroup>
                    </Box>
                </Grid>

                <Grid item container direction='column' rowSpacing={1}>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Usuario:</label>
                        </Grid>
                        <Grid item >
                            <TextField id="userForm" size='small' />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Password:</label>
                        </Grid>
                        <Grid item >
                            <TextField id="passwordForm" size='small' />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Institucion:</label>
                        </Grid>
                        <Grid item >
                            <TextField id="nameForm" size='small' />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Correo Electronico:</label>
                        </Grid>
                        <Grid item >
                            <TextField id="emailForm" size='small' />
                        </Grid>
                    </Grid>
                    {client&&<Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Direccion:</label>
                        </Grid>
                        <Grid item >
                            <TextField id='addressForm'  size='small' />
                        </Grid>
                    </Grid>}
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Telefono:</label>
                        </Grid>
                        <Grid item >
                            <TextField id='phoneForm'  size='small'/>
                        </Grid>
                    </Grid>
                    {!client&&<Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Role:</label>
                        </Grid>
                        <Grid item >
                            <Autocomplete
                            size='small'
                            id="roleForm"
                            options={['area','recepcion','direccion','admin']}
                            sx={{ width: 150 }}
                            renderInput={(params) => <TextField {...params}/>}
                            />
                        </Grid>
                    </Grid>}
                </Grid>

                <Grid item container justifyContent='center'>
                    <Button onClick={()=>{createUser()}}>Crear</Button>
                </Grid>
            </Grid>
        </Card>
    </Main>
    )
}