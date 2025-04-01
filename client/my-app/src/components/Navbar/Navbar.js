import React from 'react';
import { AppBar, Button } from '@mui/material';
import ss from '../../images/ss.png';
import useStyles from './styles.js';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const classes = useStyles();
    const user = null;

    return (
        <AppBar position="static" color="inherit" className={classes.appBar}>
           
            <div className={classes.box}>
                <Link to="/">
                    <img className={classes.image} src={ss} alt="SS" height="60" />
                </Link>
            <div className={classes.buttonContainer}>
                {user ? (
                    <Button variant="contained" color="secondary">Logout</Button>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
                )}
            </div>
            </div>
          
        </AppBar>
    );
}

export default Navbar;
