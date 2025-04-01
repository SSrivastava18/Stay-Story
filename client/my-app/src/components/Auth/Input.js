import React from 'react'
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const Input = ({name, handleChange, label, autoFocus, type, handleShowPassword, half}) => (
  
    <Grid item xs={12} sm={half ? 6 : 12}>
        <TextField
            name="firstName"
            variant="outlined"
            required
            fullWidth
            label={label}
            autoFocus = {autoFocus}
            onChange={handleChange}
            type={type}
            InputProps={ name === 'password' ? {
            endAdornment: (
                <InputAdornment position="end">
                <IconButton onClick={handleShowPassword}>
                    {type === 'password' ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                </InputAdornment>
            ),
        
            }:null}
        />


    </Grid>
  )


export default Input