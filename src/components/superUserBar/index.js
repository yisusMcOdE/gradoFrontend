import { Button, Drawer, Grid, IconButton, Link } from "@mui/material"
import { useNavigate } from "react-router-dom"
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { useState } from "react";
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import ShowChartIcon from '@mui/icons-material/ShowChart';

export const SuperUserBar = () => {

    const [open, setOpen] = useState(true);

    return(
        <>
            <IconButton onClick={()=>{setOpen(true)}}>
                <KeyboardDoubleArrowDownIcon/>
            </IconButton>
            <Drawer
            anchor="top"
            variant='persistent'
            open={open}
            >
                <Grid 
                    container
                    direction='column'
                     
                    rowSpacing={1}
                    style={{padding:'5px', background:'#E8E8E8'}}
                >
                    
                    <Grid item style={{margin:'auto', display:'block'}}>
                        <IconButton  color="black" size="large" onClick={()=>{setOpen(false)}}>
                            <KeyboardDoubleArrowUpIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item container justifyContent='space-evenly'>
                        <Grid item xs='auto'>
                            <Link href='/admin' underline='none'>
                                <Button
                                    startIcon={<PermDataSettingIcon />}
                                    
                                    variant='contained'
                                >
                                    Subs. Administrador
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs='auto'>
                            <Link href='/recepcion' underline='none'>
                                <Button
                                    variant='contained'
                                    startIcon={<Diversity3Icon/>}
                                >
                                    Subs. Recepcion
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs='auto' >
                            <Link href='/area' underline='none'>
                                <Button
                                    variant='contained'
                                    startIcon={<ArchitectureIcon/>}
                                >
                                    Subs. Area
                                </Button>
                            </Link>
                        </Grid>
                        
                        <Grid item xs='auto'>
                            <Link href='/direccion' underline='none'>
                                <Button
                                    variant='contained'
                                    startIcon={<ShowChartIcon/>}
                                >
                                    Subs. Direccion
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Drawer>
        </>
    )
        
}