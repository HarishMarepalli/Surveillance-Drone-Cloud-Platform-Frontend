import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/Header";
import { ResponsivePie } from "@nivo/pie";
import { DronePieData as piedata } from "../data/mockData";

// const drone_counts = {
//     "active": "15",
//     "connected": "4",
//     "stopped": "9",
//     "repair": "3"
// };

const DroneStatus = ({ statusData }) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    return (
        <Box m="20px">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                <Typography 
                    marginBottom="15px" 
                    variant="h3"
                    fontWeight="bold"
                    // sx={{ color: colors.grey[900] }}
                    color={theme.palette.neutral.dark}
                    textAlign="center"
                    >
                    Drone Status
                </Typography>
                    <PieChart pieData = {statusData}/>
                </div>
            </div>
        </Box>
    );
}

const PieChart = ({pieData}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const myColors = ['chocolate', '#0077FF', '#00CC66', '#9900FF']
    const pieChartData = Object.entries(pieData).map(([status, count]) => ({
        id: status.charAt(0).toUpperCase() + status.slice(1),
        label: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize the label
        value: count,
        color: status == 'repair' ? '#f00' : status == 'active' ? '#00CC66' : status == 'connected' ? '#FFD700' : status == 'charging' ? 'darkmagenta' : '#ff9800'
      }));
    return (
      <ResponsivePie
        data={pieChartData}
        width = {700}
        height = {500}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={3}
        cornerRadius={3}
        colors={({ data }) => data.color}
        activeOuterRadiusOffset={8}
        theme={
            {
                labels:{text: { fontSize : 18, color: theme.palette.neutral.dark}},
                legends: { text: { fontSize: 18 } },
                tooltip:{ container: {background: theme.palette.neutral.light}}
            }
        }
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={theme.palette.neutral.dark}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    4
                ]
            ]
        }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 70,
                itemsSpacing: 40,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemTextSize: 20, // Increase the font size
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                // effects: [
                //     {
                //         on: 'hover',
                //         style: {
                //             itemTextColor: '#000'
                //         }
                //     }
                // ]
            }
        ]}
      />
    );
  };

export default DroneStatus