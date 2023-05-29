import { Drawer, Grid, SvgIcon } from '@mui/material';
import { SwipeableDrawer, Slide, Button } from '@mui/material';
import { useState } from 'react';
import { useStyles } from './sidebar.styles';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {List} from '@mui/material';
import { ItemSideBar } from './ItemSideBar';
import { useNavigate } from 'react-router-dom';


export const SideBar = ({role,menu, icons, subMenu}) => {

    const navigator = useNavigate();

    const classes = useStyles();
    const [open, setOpen] = useState(true);

    const styleClose={
        width:'2rem',
    }
    const styleOpen={
        width:'12rem'
    }

    const logout = () => {
        localStorage.removeItem('token');
        navigator('/login');
    }

    return(
        <div className={open?classes.open:classes.close}>
            <Drawer variant='persistent' anchor='left' open={!open}>
                <div className={classes.slideCloseContainer}>
                    <ArrowCircleRightIcon className={classes.buttonToggle} onClick={()=>{setOpen(prev=>!prev)}}/>
                </div>
            </Drawer>
            <Drawer variant='persistent' anchor='left' open={open} style={{border:'none'}}>
                <div style={{height:'100vh'}} className={classes.slideOpenContainer}>
                    <div className={classes.iconToggle}>
                        <ArrowCircleLeftIcon className={classes.buttonToggle} onClick={()=>{setOpen(prev=>!prev)}}/>
                    </div>
                    <Grid container direction='column' style={{height:'100vh'}}>

                        <Grid item className={classes.headerSideBar}>
                            <AccountCircleIcon/>
                            <h2>{role}</h2>
                            <hr/>
                        </Grid>
                        
                        <Grid item className={classes.bodySideBar}>
                            <List
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                            >
                                {
                                    menu.map((item, index)=>{
                                        return <ItemSideBar icons={icons} indexIcon={index} label={item} subItems={subMenu[item]}/>
                                    })
                                }
                            </List>
                        </Grid>

                        <Grid item  className={classes.footerSideBar}>
                            <Button variant='outline' onClick={logout}>
                                Cerrar Sesion
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Drawer>
        </div>
        
    )
}