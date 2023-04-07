import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default class ContentCard extends React.Component {
    render() {
        return (
            <Box style={{ margin: "4%", padding:"1%" }}>
                <Card variant="outlined" style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    borderRadius: 2
                }}>
                    <CardContent>{this.props.children}</CardContent>
                </Card>
            </Box>
        );
    }
}
