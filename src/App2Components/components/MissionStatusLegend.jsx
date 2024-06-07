import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const MisisonStatusLegend = ({ title, count }) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    return (
        <div className="legend">
            <div className="legend-item">
                <div className="square1" style={{ backgroundColor: '#ff9800' }}></div>
                <span style={{fontSize: '18px'}}>Planned</span>
            </div>
            <div className="legend-item">
                <div className="square1" style={{ backgroundColor: 'limegreen' }}></div>
                <span style={{fontSize: '18px'}}>Completed</span>
            </div>
            <div className="legend-item">
                <div className="square1" style={{ backgroundColor: '#e70909' }}></div>
                <span style={{fontSize: '18px'}}>Failed</span>
            </div>
        </div>
    );
}

export default MisisonStatusLegend