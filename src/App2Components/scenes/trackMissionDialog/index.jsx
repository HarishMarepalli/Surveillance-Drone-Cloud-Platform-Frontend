import React, { useState } from 'react';
import { Box, Button, Typography, useTheme, CircularProgress } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TablePagination, 
    TableSortLabel, 
    Paper, 
    TableContainer,
    Select,
    MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {useNavigate} from 'react-router-dom';

const TrackMissionDialog = ({missionsFromDroneID, selectedDroneFromMap, handleCloseDialog}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('mission_id');
    const [order, setOrder] = useState('asc');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    //const colors = tokens(theme.palette.mode);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const handleRequestSort = (property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleTrackMissionClick = (mission) => {
        // console.log(mission);
        //setSelectedMissionID(mission.mission_id);
        navigate(`/tracking/${selectedDroneFromMap}/mission/${mission.mission_id}`);
        window.location.reload();
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: "#73BD07",
          color: theme.palette.common.white,
          fontSize: 20
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 18,
        },
    }));

    const typeOptions = ['Delivery', 'Campus Surveillance', 'Inspection', 'Photography', 'Mapping', 'Security Patrol'];
    const statusOptions = ['Planned', 'Completed', 'In Progress', 'Failed'];

    // Filter missions based on type and status
    const filteredMissions = missionsFromDroneID.filter(mission => {
        const typeMatch = typeFilter === '' || mission.mission_type.toLowerCase() === typeFilter.toLowerCase();
        const statusMatch = statusFilter === '' || mission.mission_status.toLowerCase() === statusFilter.toLowerCase();
        return typeMatch && statusMatch;
    });
  
    const sortedMissions = filteredMissions.slice().sort((a, b) => {
      const isAsc = order === 'asc';
      if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
      return 0;
    });
  
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, missionsFromDroneID.length - page * rowsPerPage);

    return (
        <Paper
            style={{borderRadius: '25px', padding: '2em', backgroundColor: theme.palette.neutral.light}}
        >
            <div
                style={{display: "flex", justifyContent: 'space-between', alignItems:'center'}}
            >
                <div>
                    <span style={{fontSize: '18px', marginRight: '10px'}}>Filter By Type:</span>
                    <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        variant="outlined"
                        displayEmpty
                    >
                        <MenuItem style={{fontSize: '16px'}} value="">All Types</MenuItem>
                        {typeOptions.map((type, index) => (
                        <MenuItem style={{fontSize: '16px'}} key={index} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div style={{color: theme.palette.neutral.dark, fontSize: '22px'}}>Missions for Drone {selectedDroneFromMap}</div>
                <div>
                    <span style={{fontSize: '18px', marginRight: '10px'}}>Filter By Status:</span>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        variant="outlined"
                        displayEmpty
                    >
                        <MenuItem style={{fontSize: '16px'}} value="">All Statuses</MenuItem>
                        {statusOptions.map((status, index) => (
                        <MenuItem style={{fontSize: '16px'}} key={index} value={status}>{status}</MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
            {/* <TableContainer
                style={{marginTop:'2em'}}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'mission_id'}
                                    direction={orderBy === 'mission_id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('mission_id')}
                                >
                                    Mission ID
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'mission_type'}
                                    direction={orderBy === 'mission_type' ? order : 'asc'}
                                    onClick={() => handleRequestSort('mission_type')}
                                >
                                    Type
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'mission_location'}
                                    direction={orderBy === 'mission_location' ? order : 'asc'}
                                    onClick={() => handleRequestSort('mission_location')}
                                >
                                    Location
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'mission_status'}
                                    direction={orderBy === 'mission_status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('mission_status')}
                                >
                                    Status
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell>
                                Action
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {sortedMissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((mission) => (
                        <TableRow key={mission.mission_id}>
                        <StyledTableCell>{mission.mission_id}</StyledTableCell>
                        <StyledTableCell>{mission.mission_type}</StyledTableCell>
                        <StyledTableCell>{mission.mission_location}</StyledTableCell>
                        <StyledTableCell>{mission.mission_status}</StyledTableCell>
                        <StyledTableCell>
                            <Button color="error" variant="contained" size="large" onClick={()=>handleTrackMissionClick(mission)}>
                                Track Mission
                            </Button>
                        </StyledTableCell>
                        </TableRow>
                    ))}
                    {sortedMissions.length > 0 && emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                        <StyledTableCell colSpan={4} />
                        </TableRow>
                    )}
                    {
                        sortedMissions.length == 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <p style={{fontSize: '18px', marginTop: '16px'}}>No Missions Found</p>
                            </TableRow>
                        )
                    }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10]}
                //component="div"
                count={missionsFromDroneID.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                style={{fontSize: '16px'}}
            /> */}

        <div style={{display: "flex"}}>
            { missionsFromDroneID.length>0 ? 
                (
                    sortedMissions.map((mission) => (
                    <Card 
                        sx={{ 
                            maxWidth: 445, 
                            width: 380, 
                            margin: 5, 
                            borderRadius:5,
                            backgroundColor: theme.palette.background.default  
                        }} 
                        key={mission.mission_id}
                    >
                        <CardMedia
                            sx={{ height: 220 }}
                            image={`/images/${mission.mission_id}.jpg`}
                            title={`${mission.mission_location}`}
                            //image='/images/missionbg_dummy.jpg'
                        />
                        <CardContent>
                            <Typography variant="body1" color="text.secondary" mb={2}>{mission.mission_id}</Typography>
                            <Typography gutterBottom variant="h3" component="div">{mission.mission_location}</Typography>
                            <Typography variant="body1" color="text.secondary">{mission.mission_type}</Typography>
                            <br />
                            <Typography variant="h4" color="text.secondary">{mission.mission_status}</Typography>
                        </CardContent>
                        <CardActions sx={{padding:2, justifyContent: 'center'}}>
                        <Button 
                            //color={theme.palette.secondary.main} 
                            variant="contained" 
                            size="large" 
                            onClick={()=>handleTrackMissionClick(mission)}
                            sx={{
                                color: theme.palette.neutral.light,
                                backgroundColor: theme.palette.secondary.main,
                                "&:hover": {
                                    color: theme.palette.neutral.light,
                                    backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                                }
                            }}
                        >
                            Track Mission
                        </Button>
                        </CardActions>
                    </Card>
                    ))
                ):
                (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px" margin="auto">
                        <CircularProgress 
                            sx={{
                            color: theme.palette.secondary.light
                            }}
                        />
                    </Box>
                )
            }
        </div>
        <div
          style={{margin:'1em', display: 'flex', justifyContent: 'end'}}
        >
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleCloseDialog}
            sx={{
                color: theme.palette.neutral.light,
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                    color: theme.palette.neutral.light,
                    backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                }
            }}
        >Close</Button>
        </div>
      </Paper>
    );
}

export default TrackMissionDialog