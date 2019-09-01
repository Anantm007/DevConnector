import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from './type';

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create or update profile
export const createProfile = (FormData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.post('/api/profile', FormData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit? 'Profile Updated': 'Profile Created', 'success'));

    history.push('/dashboard');

  } catch (err) {
    
    const errors = err.response.errors;

    if(errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
} 


// Add experience

export const addExperience = (formData, history) => async dispatch => {
  
  try
  {
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const res = await axios.put('/api/profile/experience', formData, config);

  dispatch({
    type: UPDATE_PROFILE,
    payload: res.data
  });

  dispatch(setAlert('Experience Added', 'success'));

  history.push('/dashboard');
} 

catch(err)
{
  const errors = err.response.errors;

  if(errors)
  {
    errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
  }

  dispatch({
    type: PROFILE_ERROR,
    payload: {msg: err.response.statusText, status: err.response.status}
  });
  }
}


// Add Education

export const addEducation = (formData, history) => async dispatch => {
  
  try
  {
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const res = await axios.put('/api/profile/education', formData, config);

  dispatch({
    type: UPDATE_PROFILE,
    payload: res.data
  });

  dispatch(setAlert('Education Added', 'success'));

  history.push('/dashboard');
} 

catch(err)
{
  const errors = err.response.errors;

  if(errors)
  {
    errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
  }

  dispatch({
    type: PROFILE_ERROR,
    payload: {msg: err.response.statusText, status: err.response.status}
  });
  }
}