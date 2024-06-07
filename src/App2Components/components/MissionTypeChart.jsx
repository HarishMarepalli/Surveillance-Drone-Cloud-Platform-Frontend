import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { ResponsiveBar } from '@nivo/bar';

const MissionTypeChart = ({ data }) => {
    const theme = useTheme();
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
                    Mission Type
                </Typography>
                    <MyBarChart data = {data}/>
                </div>
            </div>
        </Box>
    );
}

const MyBarChart = ({data}) => {
    const theme = useTheme();
    // Define a custom color array
    const customColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

    const missionTypeColors = {
        'Campus Perimeter Patrol': '#1f77b4',
        'Crowd Monitoring': '#ff7f0e',
        'Building Inspection': '#2ca02c',
        'Emergency response': '#d62728',
        'Parking Lot Surveillance': '#9467bd',
        'Fire Monitoring': '#8c564b',
        'Agriculture': '#e377c2',
        'Traffic Control': '#7f7f7f',
        'Infrastructure Inspection': '#bcbd22',
        'Powerline Inspection': '#17becf',
        'Search and Rescue': '#aec7e8',
        'Industrial Site Monitoring': '#ffbb78'
    };

    const legendLabels = Object.keys(data);

    const barData = legendLabels.map((label, index) => ({
        mission: label,
        value: data[label],
        color: customColors[index % customColors.length] // cycling through customColors array
    }));

    const getColor = (bar) => 
    {
        // console.log(bar);
        return missionTypeColors[bar.data.type]
    };

    // Function to select random colors from the custom color array
    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * customColors.length);
        return customColors[randomIndex];
    };

    // Modify the data to include color properties for each data item
    const modifiedData = Object.entries(data).map(([key, value]) => ({
        [key]: value,
        [`${key}Color`]: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`, // Random color
    }));
    
  return (
    <ResponsiveBar
        data={barData}
        theme={{
            tooltip:{
                container:{
                backgroundColor: theme.palette.neutral.light,
                color: theme.palette.neutral.dark
                }
            },
            // added
            axis: {
                domain: {
                line: {
                    stroke: theme.palette.neutral.dark,
                },
                },
                legend: {
                text: {
                    fill: theme.palette.neutral.dark,
                },
                },
                ticks: {
                line: {
                    stroke: theme.palette.neutral.dark,
                    strokeWidth: 1,
                },
                text: {
                    fontSize: 13,
                    marginRight: '10px',
                    fill: theme.palette.neutral.dark,
                },
                },
            },
            legends: {
                text: {
                fontSize: 16,
                color: theme.palette.neutral.dark
                },
            },
        }}
        width = {700}
        height = {500}
        keys={['value']}
        indexBy="mission"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.4}
        valueScale={{ type: "linear" }}
        layout="vertical"
        colors={({ data }) => data.color}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
        {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0,
            itemTextColor: theme.palette.neutral.dark,
            symbolSize: 20,
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemOpacity: 1,
                    },
                },
            ],
        },
        ]}
    />
  );
};

export default MissionTypeChart;
