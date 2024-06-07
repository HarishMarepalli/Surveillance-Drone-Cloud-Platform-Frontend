import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatusLegend = ({ title, count }) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    return (
        <div className="legend">
            <div className="legend-item">
                <div className="square1" style={{ backgroundColor: 'limegreen' }}></div>
                <span style={{fontSize: '18px'}}>Active</span>
            </div>
            <div className="legend-item">
                <div className="square1" style={{ backgroundColor: 'yellow'}}></div>
                <span style={{fontSize: '18px'}}>Connected</span>
            </div>
            <div className="legend-item">
                <div className="square1" style={{ backgroundColor: '#ff9800' }}></div>
                <span style={{fontSize: '18px'}}>Stopped</span>
            </div>
            <div className="legend-item">
                <div className="square1" style={{ backgroundColor: 'darkmagenta' }}></div>
                <span style={{fontSize: '18px'}}>Charging</span>
            </div>
            <div className="legend-item">
                <div className="square1" style={{ backgroundColor: '#e70909' }}></div>
                <span style={{fontSize: '18px'}}>Repair</span>
            </div>
        </div>
    );
}

export default StatusLegend