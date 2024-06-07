import { Box, IconButton, useTheme, Typography, Menu, MenuItem, Tooltip, Zoom } from "@mui/material";
import { useContext, useState, useRef, useEffect  } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import {pages} from '../../data/pagesData'

const Topbar = ({selected, setSelected}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); 
  const inputRef = useRef(null);

  // Debounce the onChange event handler
  const handleSearchQueryChange = debounce((value) => {
    //setSearchQuery(value);
    if (value.trim() !== '') {
      const filteredResults = pages.filter((result) =>
        result.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredResults);
      setMenuOpen(true); // Open the menu when search results are available
      inputRef.current.focus();
    } else {
      setSearchResults([]); // Clear search results when query is empty
      setMenuOpen(false); // Close the menu when query is empty
    }
  }, 400); // Adjust the debounce delay as needed

  const handleSearchQueryChange1 = debounce((value) => {
    //setSearchQuery(value);
    if (value.trim() !== '') {
      const filteredResults = pages.filter((result) =>
        result.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredResults);
      setMenuOpen(true); // Open the menu when search results are available
      inputRef.current.focus();
    } else {
      setSearchResults([]); // Clear search results when query is empty
      setMenuOpen(false); // Close the menu when query is empty
    }
  }, 10);

  // Function to handle page selection from dropdown
  const handlePageSelect = (page) => {
    //console.log(path);
    setSelected(page.name);
    navigate(page.path);
    //setSearchQuery('');
    setMenuOpen(false);
  };

  const handleLogout = () => {
    //console.log("hello");
    navigate("/");
  }

  const goToDashboard = ()=>{
    setSelected("Dashboard");
    navigate("/dashboard");
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p="1em 2em"
      maxWidth="100%"
      boxSizing="border-box"
      
    >
      <Box
        display="flex"
        p="1em 2em"
        borderRadius='30px'
        color={theme.palette.neutral.light}
        backgroundColor = {theme.palette.secondary.main}
        sx={{
          cursor: 'pointer'
        }}
        onClick={goToDashboard}
      >
        <Typography variant="h2">
          Drone Cloud
          <i className='fab fa-typo3' />
        </Typography>
          
      </Box>

        {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={theme.palette.secondary.main}
        borderRadius="10px"
        width="20.5%"
        height='50px'
        position="relative"
        id="search-bar"
        >
        <InputBase 
          sx={{ ml: 2, flex: 1, fontSize: '20px', color: theme.palette.neutral.light }} 
          placeholder="Search"
          //value={searchQuery}
          onChange={(e) => handleSearchQueryChange(e.target.value)}
          onClick={(e) => handleSearchQueryChange1(e.target.value)}
          ref={inputRef}
        />
        <IconButton type="button" sx={{ p: 1, color: theme.palette.neutral.light }}>
          <SearchIcon />
        </IconButton>
        <Menu
          id="search-menu"
          anchorEl={document.getElementById('search-bar')}
          open={menuOpen && searchResults.length > 0}
          onClose={() => setMenuOpen(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableAutoFocus
        >
          {searchResults.map((page, index) => (
            <MenuItem 
              key={index} 
              onClick={() => handlePageSelect(page)}
              sx={{ width: '410px', height: '60px', margin: '10px', borderBottom: `1px solid ${theme.palette.secondary.light}` }}
              classes={{ focusVisible: '' }}
            >
              <Box
                display="flex"
                flexDirection="column"
              >
                <Typography
                  variant="h4"
                  sx={{ color: theme.palette.neutral.dark, marginBottom: '10px' }}
                >
                  {page.name}
                </Typography>
                <Typography variant="h6" sx={{ color: theme.palette.secondary.light, marginBottom: '10px' }}>
                  {page.path}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* ICONS */}
      <Box
        display="flex"
        boxSizing="border-box"
      >
        <Tooltip sx={{fontSize: '2em'}} TransitionComponent={Zoom} title="Change Theme">
          <IconButton 
            sx={{ width: '50px', height: '50px' }}
            onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip sx={{fontSize: '2em'}} TransitionComponent={Zoom} title="Logout">
          <IconButton
            sx={{ width: '50px', height: '50px' }}
            onClick={() => handleLogout()}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
          <IconButton
            sx={{ width: '50px', height: '50px' }}
          >
            <NotificationsOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
  );
};

export default Topbar;
