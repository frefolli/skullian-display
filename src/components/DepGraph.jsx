import React, { Component } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { saveAs } from 'file-saver';

class DepGraph extends Component {
    constructor(props) {
        super(props);
	this.state = {};
    }

    assignCy = (cy) => {
	if (this.state.cy === undefined) {
	    this.setState({cy: cy});
        }
    }

    saveAsPng = () => {
        let blob = this.state.cy.png();
	    saveAs(blob, "graph.png");
    }

    componentDidUpdate() {
        if (this.props.shoot) {
            this.saveAsPng();
            this.props.shootCallback()
        }
    }

    render() {
        return (
            <div>
                <CytoscapeComponent
                    cy={this.assignCy}
                    elements={this.props.elements}
                    style={{
                        width: window.innerWidth,
                        height: window.innerHeight
                    }}
                    stylesheet={[
                        {
                            selector: 'edge',
                            style: {
                              width: 4,
                              targetArrowShape: 'triangle',
                              curveStyle: 'bezier',
                              label: 'data(kind)'
                            }
                        },
                        {
                            selector: 'node',
                            style: {
                                shape: 'hexagon',
                                'background-color': 'blue',
                                label: 'data(label)',
                            }
                        }
                    ]}
                    layout={this.props.layout}
                />
            </div>
        );
    }
}

export default DepGraph;
