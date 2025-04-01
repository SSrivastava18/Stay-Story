import React, { useState } from 'react'
import { Avatar, Button, Paper, Container, Grid, Typography, TextField } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from 'react-google-login';
import useStyle from './styles';
import Input from './Input';
import icon from './Icon';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const classes = useStyle();



  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit');
  };

  const handleChange = (e) => { }

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    handleShowPassword(false);
  }

  const googleSuccess = async (res) => {
    console.log(res);

  }
  const googleFailure = async(error) => {
    console.log(error);
    console.log('Google Sign In was unsuccessful. Try again later')

  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignup ? 'Sign Up' : 'Sign In'}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              isSignup && (
                <>

                  <Input name="firstName" variant="outlined" required fullWidth label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" variant="outlined" required fullWidth label="Last Name" handleChange={handleChange} half />
                </>

              )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          <GoogleLogin
            clientId="79889933678-lkpobk3kt5ftgh1eil16kc9bcfiahm53.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<img src={icon} style={{ width: '30px' }} />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy='single_host_origin'
          ></GoogleLogin>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}

              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>


    </Container>
  )
}

export default Auth