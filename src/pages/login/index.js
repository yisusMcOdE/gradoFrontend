import { Button, Card, Dialog, FormLabel, Grid, InputAdornment, TextField } from "@mui/material";
import { useStyles } from "./index.styles";
import logoUatf from '../../assets/images/uatf.png';
import { useNavigate } from "react-router-dom";
import { redirectRole, verifyToken, verifyTokenWithPath } from "../../utilities/pdfMake/redirectRole";
import { decodeToken } from "react-jwt";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../utilities/allGetFetch";
import { createUser } from "../../utilities/allPostFetch";
import { AccountCircle } from "@mui/icons-material";
import { Lock } from "@mui/icons-material";

export const Login = () => {

    const navigator = useNavigate();
    const [noUsers, setNoUsers] = useState(false);
    const [user, setUser] = useState({error:false, value:''});
    const [password, setPassword] = useState({error:false, value:''});
    const [userLogin, setUserLogin] = useState({error:false, value:''});
    const [passwordLogin, setPasswordLogin] = useState({error:false, value:''});

    const verifyNew = async () => {
        const response = await getAllUsers();
        if(response === 204){
            setNoUsers(true);
        }
    }

    const login = async() => {
        ///validation
        let error = false;
        if(userLogin.value===''){
            error = true;
            setUserLogin({error:true, value:userLogin.value})
        }
        if(passwordLogin.value===''){
            error = true;
            setPasswordLogin({error:true, value:passwordLogin.value})
        }

        if(!error){
            const user = userLogin.value;
            const password = passwordLogin.value;
            const url = 'http://localhost:5000/api/login/employee';
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    user,
                    password
                })
            })
            if(response.status === 204){
                setUserLogin({error:true, value:userLogin.value});
                setPasswordLogin({error:true, value:passwordLogin.value});
            }else{
                const token = await response.json();
                localStorage.setItem('token',token.token);
                    const decode = decodeToken(token.token);
                    redirectRole(decode.data.role, navigator);
            }
            
        }
    }

    const register = async() => {
        ///validation
        let error = false;
        if(user.value===''){
            error = true;
            setUser({error:true, value:user.value})
        }
        if(password.value===''){
            error = true;
            setPassword({error:true, value:user.value})
        }
        if(!error){
            const body = {
                user:user.value,
                password:password.value
            }
            const response = await createUser(body);
            setNoUsers(false);
        }
    }

    useEffect(()=>{
        verifyTokenWithPath('Login',navigator);
        verifyNew();
    })

    const classes = useStyles();
    return (
        <>
            <Dialog 
                open={noUsers}
                onClose={()=>{}}
            >
                <Card>
                    <Grid container direction='column' rowSpacing={2}>
                        <Grid item >
                            <h3 style={{textAlign:'center'}}>Configuracion Inicial</h3>
                            <p>Bienvenido al sistema de control de trabajos. Porfavor para iniciar registre una cuenta para el superUsuario</p>
                        </Grid>
                        <Grid item container alignItems='center'>
                            <Grid item xs={5}>
                                <label>Nombre de Usuario:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    size='small'
                                    value={user.value}
                                    onChange={(e)=>{setUser({error:false, value:e.target.value})}}
                                    error={user.error}
                                    required
                                    label='Requerido'
                                />
                            </Grid>
                        </Grid>
                        <Grid item container alignItems='center'>
                            <Grid item xs={5}>
                                <label>Contraseña:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    type='password'
                                    size='small'
                                    value={password.value}
                                    onChange={(e)=>{setPassword({error:false, value:e.target.value})}}
                                    error={password.error}
                                    required
                                    label='Requerido'
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs display='flex' justifyContent='center'>
                            <Button variant='contained' onClick={register}>
                                Registrar
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Dialog>
            <Grid container>
                <Grid item container xs={6} columnSpacing={3} className={classes.logoArea}>
                    <Grid item xs={5}>
                        <img src={logoUatf}/>
                    </Grid>
                    <Grid item xs>
                        <h1>Universidad Autonoma Tomas Frias</h1>
                    </Grid>
                </Grid>
                <Grid item xs={6} className={classes.formArea}>
                    <Card className={classes.cardLogin}>
                        <Grid container direction="column" alignItems="center" justifyContent="space-around" style={{height:'100%'}}>
                            <Grid item>
                                <h1>Inicio de Sesion</h1>
                            </Grid>
                            
                            <Grid item container direction="column" alignItems="center" spacing={2}>
                                <Grid item container direction='column' rowSpacing={1}>
                                    <Grid item>
                                        <label>Usuario: </label>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            size='small'
                                            value={userLogin.value}
                                            onChange={(e)=>{setUserLogin({error:false, value:e.target.value})}}
                                            error={userLogin.error}
                                            required
                                            label='Requerido'
                                            InputProps={{
                                                startAdornment: (
                                                  <InputAdornment position="start">
                                                    <AccountCircle />
                                                  </InputAdornment>
                                                ),
                                              }}
                                        />
                                    </Grid>
                                    
                                </Grid>
                                <Grid item container direction='column' rowSpacing={1}>
                                    <Grid item>
                                        <label>Contraseña: </label>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            type='password'
                                            size='small'
                                            value={passwordLogin.value}
                                            onChange={(e)=>{setPasswordLogin({error:false, value:e.target.value})}}
                                            error={passwordLogin.error}
                                            required
                                            label='Requerido'
                                            InputProps={{
                                                startAdornment: (
                                                  <InputAdornment position="start">
                                                    <Lock />
                                                  </InputAdornment>
                                                ),
                                              }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={login}>Iniciar Sesion</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}