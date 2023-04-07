import { Box } from "@mui/material";
import * as React from "react";

export default class JimGrid extends React.Component {
    render() {
        return (<Box sx={{
            marginLeft: "5%",
            marginRight: "5%",
            marginTop: "2.5%",
            marginBottom: "2.5%",
            display: "grid",
            gridTemplateColumns: "100%"
          }}>
            {this.props.children}
        </Box>);
    }
}