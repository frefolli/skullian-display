import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default class MSelect extends React.Component {
    render() {
        const options = this.props.options.map((option) => {
            return (<MenuItem value={option.value} key={option.name}>{option.name}</MenuItem>);
        });
        if (this.props.optional) {
            options.push((<MenuItem value={''} key={''}>{''}</MenuItem>))
        }
        return (
            <FormControl
                sx={{textAlign:"center"}} fullWidth>
                <InputLabel id={`selector-${this.props.label}`}>{this.props.label}</InputLabel>
                <Select
                    labelId={`selector-${this.props.label}`}
                    label={this.props.label}
                    value={this.props.value}
                    onChange={this.props.onChange} 
                >
                    {options}
                </Select>
            </FormControl>
        );
    }
}