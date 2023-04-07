import { Box } from "@mui/material";
import * as React from "react";

export default class JimFlex extends React.Component {
    render() {
        return (<Box sx={{
            display: {md: "grid", sx: "flex"},
            gridTemplateColumns: "49% 49%",
            gap: "2%"
          }}>
            {this.props.children}
        </Box>);
    }
}
