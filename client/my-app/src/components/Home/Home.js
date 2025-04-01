import React from 'react'
import { Container, Grow, Grid } from '@mui/material'
import Posts from '../Posts/Posts'
import Form from '../Form/Form'
import { useState, useEffect } from 'react';
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { getPosts } from '../../actions/posts';



const Home = () => {
    const [currentId, setCurrentId] = useState(0);
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPosts());
    }, [currentId, dispatch]);

    return (
        <div>
            <Grow in>
                <Container>
                    <Grid container justify="space-between" alignItems="stretch" spacing={3} color='white'>
                        <Grid item xs={12} sm={7} >
                            <Posts setCurrentId={setCurrentId} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Form currentId={currentId} setCurrentId={setCurrentId} />
                        </Grid>
                    </Grid>
                </Container>

            </Grow>
        </div>
    )
}

export default Home