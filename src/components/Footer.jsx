import React from 'react'

import { Box, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="center" sx={{background: "#000", width: "100%", height:60, mt:20}}>
        <Typography variant='h8' sx={{color: "#fff"}}>© 2022 Medicine Hub. All Rights Reserved. | Email: helpdesk@medicinehub.com</Typography>

    </Box>
  )
}

export default Footer