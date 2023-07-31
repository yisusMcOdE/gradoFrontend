import { Drawer, Grid, SvgIcon } from '@mui/material';
import { SwipeableDrawer, Slide, Button } from '@mui/material';
import { useState } from 'react';
import { useStyles } from './sidebar.styles';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import {List} from '@mui/material';
import { ItemSideBar } from './ItemSideBar';
import { useNavigate } from 'react-router-dom';


export const SideBar = ({role,menu, icons, subMenu}) => {

    const navigator = useNavigate();

    const classes = useStyles();
    const [open, setOpen] = useState(true);

    const logout = () => {
        localStorage.removeItem('token');
        navigator('/login');
    }

    return(
        <div className={open?classes.open:classes.close}>
            <Drawer variant='persistent' anchor='left' open={open}>
                <div style={{height:'100vh', overflowY:'hidden'}} className={classes.slideOpenContainer}>
                    <div className={classes.iconToggle}>
                        <MenuOpenIcon className={classes.buttonToggle} onClick={()=>{setOpen(prev=>!prev)}}/>
                    </div>
                    <Grid container direction='column' wrap='nowrap' style={{height:'100vh'}}>

                        <Grid item xs={'auto'} className={classes.headerSideBar}>
                            <AccountCircleIcon/>
                            <h2>{role}</h2>
                            <hr/>
                        </Grid>
                        
                        <Grid item xs className={classes.bodySideBar}>
                            <List
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                            >
                                {
                                    menu.map((item, index)=>{
                                        return <ItemSideBar key={index} icons={icons} indexIcon={index} label={item} subItems={subMenu[item]}/>
                                    })
                                }
                            </List>
                        </Grid>

                        <Grid item xs={'auto'} className={classes.footerSideBar}>
                            <Button variant='contained' onClick={logout}>
                                Cerrar Sesion
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Drawer>
            <Drawer variant='persistent' anchor='left' open={!open}>
                <div className={classes.slideCloseContainer}>
                    <MenuIcon className={classes.buttonToggle} onClick={()=>{setOpen(prev=>!prev)}}/>
                </div>
            </Drawer>
        </div>
        
    )
}