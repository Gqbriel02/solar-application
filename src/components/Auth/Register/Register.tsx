import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ChangeEvent, useState} from 'react';
import {signUp} from '../../../services/AuthService';
import {useNavigate} from "react-router-dom";
import {doc, setDoc} from "firebase/firestore";
import {auth, db} from '../../../config/Firebase';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                SOLAR
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function Register() {
    const [userCredentials, setUserCredentials] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleCredentials(e: ChangeEvent<HTMLInputElement>) {
        setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
        //console.log(userCredentials);
    }

    async function handleRegister(e: any): Promise<void> {
        e.preventDefault();
        const {firstName, lastName, email, password, confirmPassword} = userCredentials;
        if (!firstName) {
            setError("Please enter your first name.");
            return;
        }
        if (!lastName) {
            setError("Please enter your last name.");
            return;
        }
        if (!email) {
            setError("Please enter your email.");
            return;
        }
        if (!password) {
            setError("Please enter your password.");
            return;
        }
        if (!confirmPassword) {
            setError("Please confirm your password.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        
        try {
            await signUp(userCredentials, setError);
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, "users", user.uid), {
                    firstName,
                    lastName,
                    email
                });
                navigate('/login');
            } else {
                setError('Failed to get the current user after registration.');
            }
        } catch (error) {
            console.log(error);
            setError('Failed to register. Please try again.');
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleRegister} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={handleCredentials}
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={handleCredentials}
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={handleCredentials}
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={handleCredentials}
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={handleCredentials}
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>


                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign Up
                    </Button>


                    {
                        error &&
                        <div className="error">
                            {error}
                        </div>
                    }

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{mt: 5}}/>
        </Container>
    );
}

export default Register;


