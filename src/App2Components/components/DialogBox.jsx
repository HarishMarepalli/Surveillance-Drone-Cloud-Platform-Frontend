import { Box, Typography, useTheme, Chip } from "@mui/material";
import * as React from 'react';
import { tokens } from "../theme";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogBox = ({selectedDroneFromMap, maxWidth, fullWidth, scroll, handleCloseDialog, children}) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Dialog 
        open={selectedDroneFromMap !== null} 
        TransitionComponent={Transition}
        keepMounted
        maxWidth= {maxWidth}
        fullWidth={fullWidth}
        scroll={scroll}
        onClose={handleCloseDialog}
        
      >
        <DialogTitle
          fontSize="26px"
          style={{
            color: '#000', 
            padding: '24px', 
            //backgroundColor: theme.palette.mode == "light" ? theme.palette.background.default: theme.palette.secondary.light}
            backgroundColor: theme.palette.background.default}
          }
        >
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            fontSize: 20,
            color: (theme) => theme.palette.neutral.dark,
          }}
        >
          <CloseIcon sx={{width: '1.5em', height:'1.5em'}} />
        </IconButton>
        <DialogContent
          sx={{
            backgroundColor: theme.palette.background.default
          }}
        >
          {children}
        </DialogContent>
    </Dialog>
  )
}

export default DialogBox