import React, { useState, useEffect } from 'react';
import useStyles from './styles';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createPost, updatePost } from '../../actions/posts';
import { useSelector } from 'react-redux';


const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    creator: '',
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  });
  const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);
  

  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) setPostData(post);

  },[post])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      dispatch(updatePost(currentId, postData));
    } else {
      dispatch(createPost(postData));
    }

    clear();
    setCurrentId(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPostData((prevData) => ({ ...prevData, selectedFile: reader.result }));
      };
    }
  };

  const clear = () => {
    setPostData({
      creator: '',
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    });
    setCurrentId(null);
  };

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
          <Typography variant="h6">{currentId ? 'Editing' : 'Creating'} a Stay-Story</Typography>
          <TextField name="creator" variant="outlined" label="Creator" fullWidth value={postData.creator} onChange={(e) => setPostData({ ...postData, creator: e.target.value })} />
          <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
          <TextField name="message" variant="outlined" label="Message" fullWidth value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
          <TextField name="tags" variant="outlined" label="Tags (comma-separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value })} />

          <div className={classes.fileInput}>
            <Typography variant="subtitle1">Choose a File:</Typography>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>
            Submit
          </Button>
          <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>
            Clear
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Form;
