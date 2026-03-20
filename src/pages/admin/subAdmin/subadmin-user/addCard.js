import React, { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, Card, Stack, Paper, Button, Collapse, TextField, Typography, Checkbox,FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components

import Iconify from '../../../components/Iconify';



const AddCard = ({ cards, isOpen, onOpen, onCancel }) => {

    // store


  return (
    <div>
         <Typography variant="overline" sx={{ mb: 3, display: 'block', color: 'text.secondary' }}>
           Select Sidebar Menu
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 3, display: 'block', color: 'text.primary' }}>
          Add User Group
        </Typography>
         <Box sx={{ mt: 3 }}>
            <Button size="small" startIcon={<Iconify icon={'bi:arrow-down-circle'} />} onClick={onOpen}>
             Store
            </Button>
        </Box>
        <Collapse in={isOpen}>
        <Box
          sx={{
            padding: 3,
            marginTop: 3,
            borderRadius: 1,
            bgcolor: 'background.neutral',
          }}
        >
          <Stack spacing={0}>
                
          </Stack>

         
        </Box>
      </Collapse>
      <Box sx={{ mt: 3 }}>
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                <Button color="inherit" variant="outlined" endIcon={<Iconify icon={'cil:arrow-circle-top'} />} onClick={onCancel}>
                    close
                </Button>
                <LoadingButton type="submit" variant="contained" onClick={onCancel}>
                    Save Change
                </LoadingButton>
            </Stack>
        </Box>
    </div>
  )
}

export default AddCard