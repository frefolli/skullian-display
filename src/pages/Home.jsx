import cytoscapeAvsdf from 'cytoscape-avsdf';
import cytoscapeFcose from 'cytoscape-fcose';
import cytoscapeKlay from 'cytoscape-klay';
import React, { Component } from 'react';
import { cytoscape } from 'react-cytoscape';
import DepGraph from '../components/DepGraph';
import MModal from '../components/MModal';
import MButton from '../components/MButton';
import MSelect from '../components/MSelect';
import JimTable from '../components/JimTable';
import JimFlex from '../components/JimFlex';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import { Box } from '@mui/material';
import { RemoveCircleOutline } from '@mui/icons-material';

cytoscape.use(cytoscapeKlay);
cytoscape.use(cytoscapeFcose);
cytoscape.use(cytoscapeAvsdf);

const contains = (arr, value) => {
    for (let index in arr) {
        if (arr[index] === value) {
            return true;
        }
    }
    return false;
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sets: [
                "data1",
                "data2"
            ],
            set: "data1",
            layout: "random",
            layouts: [
                "random", "breadthfirst", "fcose", "klay", "avsdf"
            ],
            layoutsData: {
                "random": {
                    name: "random"
                },
                "breadthfirst": {
                    name: "breadthfirst"
                },
                "avsdf": {
                    name: "avsdf",
                    nodeSeparation: 200
                },
                "fcose": {
                    name: "fcose",
                    idealEdgeLength: edge => 200
                },
                "klay": {
                    name: "klay",
                    "klay": {spacing: 200}
                }
            },
            shoot: false,
            elements: [],
            filteredElements: [],
            nodeKinds: [],
            edgeKinds: [],
            nodeFilters: [],
            edgeFilters: [],
            showModal: false,
            selectedNodeKind: "",
            selectedEdgeKind: "",
            updatedElements: false
        }
    }

    loadData = () => {
        this.setState({elements: []}, () => {
            fetch(`/js/${this.state.set}.json`)
            .then(data => data.json())
            .then(json => {
                let unique = (arr) => arr.filter((value, index, array) => array.indexOf(value) === index);
                this.setState({
                    elements: json,
                    filteredElements: json,
                    nodeKinds: unique(json.map((el) => {
                        if (el.data.source === undefined) {
                            return el.data.kind;
                        }
                    })),
                    edgeKinds: unique(json.map((el) => {
                        if (el.data.source !== undefined) {
                            return el.data.kind;
                        }
                    })),
                    nodeFilters: [],
                    edgeFilters: [],
                    updatedElements: true
                });
            });
        })
    }

    componentDidMount() {
        this.loadData()
    }

    setSet = (set) => this.setState({
        set: set
    }, this.loadData);

    setLayout = (layout) => this.setState({
        layout: layout
    });

    setShowModal = (bool) => this.setState({
        showModal: bool
    });

    addNodeFilter = () => {
        let nodeKind = this.state.selectedNodeKind;
        if ((!contains(this.state.nodeFilters, nodeKind)) && nodeKind !== "") {
            let nodeFilters = this.state.nodeFilters.concat(nodeKind);
            this.setState({
                nodeFilters,
                selectedNodeKind: ""
            }, this.applyFilters);
        }
    }

    addEdgeFilter = () => {
        let edgeKind = this.state.selectedEdgeKind;
        if ((!contains(this.state.edgeFilters, edgeKind)) && edgeKind !== "") {
            let edgeFilters = this.state.edgeFilters.concat(edgeKind);
            this.setState({
                edgeFilters,
                selectedEdgeKind: ""
            }, this.applyFilters);
        }
    }

    applyFilters = () => {
        let elements = this.state.elements.filter((el) => {
            if (el.data.source === undefined) {
                return contains(this.state.nodeFilters, el.data.kind);
            } else {
                return contains(this.state.edgeFilters, el.data.kind);
            }
        });
        console.log(elements.length);
        this.setState({
            filteredElements: elements,
            updatedElements: true});
    }

    clearFilter = () => {
        this.setState({
            filteredElements: this.state.elements,
            nodeFilters: [],
            edgeFilters: [],
            selectedNodeKind: "",
            selectedEdgeKind: "",
            updatedElements: true
        })
    }

    componentDidUpdate() {
        if (this.state.updatedElements) {
            this.setState({
                depgraph: (<DepGraph
                        shoot={this.state.shoot}
                        shootCallback={() => this.setState({shoot: false})}
                        elements={this.state.filteredElements}
                        layout={this.state.layoutsData[this.state.layout]}
                />),
                updatedElements: false
            })
        }
    }

    render() {
        const selectPair = (name, value) => {return {name, value};};
        let modal = (<MModal
            showModal={this.state.showModal}
            setShowModal={this.setShowModal}>
            <JimTable>
                <JimFlex>
                    <MSelect
                        options={this.state.sets.map((el) => selectPair(el, el))}
                        onChange={(e) => this.setSet(e.target.value)}
                        label="set"
                        value={this.state.set}
                    />
                    <MSelect
                        options={this.state.layouts.map((el) => selectPair(el, el))}
                        onChange={(e) => this.setLayout(e.target.value)}
                        label="layout"
                        value={this.state.layout}
                    />
                </JimFlex>
                <MButton
                    text="save as png"
                    onClick={() => this.setState({shoot: true})}
                />
                <JimTable>
                    <p style={{textAlign: "center"}}>Filter Nodes or Edges</p>
                    <Box sx={{
                        display: "flex"
                    }}>
                        <MSelect
                            optional
                            options={this.state.nodeKinds.map((el) => selectPair(el, el))}
                            onChange={(val) => this.setState({selectedNodeKind: val.target.value})}
                            label="node kind"
                            value={this.state.selectedNodeKind}
                        />
                        <IconButton
                            onClick={this.addNodeFilter}
                            aria-label="add">
                            <AddIcon/>
                        </IconButton>
                    </Box>
                    <Box sx={{
                        display: "flex"
                    }}>
                        <MSelect
                            optional
                            options={this.state.edgeKinds.map((el) => selectPair(el, el))}
                            onChange={(val) => this.setState({selectedEdgeKind: val.target.value})}
                            label="edge kind"
                            value={this.state.selectedEdgeKind}
                        />
                        <IconButton
                            onClick={this.addEdgeFilter}
                            aria-label="add">
                            <AddIcon/>
                        </IconButton>
                    </Box>
                    <p style={{textAlign: "center"}}>Node Kinds</p>
                    <JimFlex>
                        {
                            this.state.nodeFilters.map((el) => {
                                return (<Box>
                                    <p>{el}</p>
                                    <IconButton
                                        aria-label="remove">
                                        <RemoveCircleOutline/>
                                    </IconButton>
                                </Box>)
                            })
                        }
                    </JimFlex>
                    <p style={{textAlign: "center"}}>Edge Kinds</p>
                    <JimFlex>
                        {
                            this.state.edgeFilters.map((el) => {
                                return (<Box>
                                    <p>{el}</p>
                                    <IconButton
                                        aria-label="remove">
                                        <RemoveCircleOutline/>
                                    </IconButton>
                                </Box>)
                            })
                        }
                    </JimFlex>
                </JimTable>
                <MButton
                    text="clear filter"
                    onClick={this.clearFilter}
                />
            </JimTable>
        </MModal>);
        
        return (
            <div>
                <MButton
                    center
                    text="show modal"
                    onClick={() => this.setShowModal(true)}
                />
                {modal}
                {this.state.depgraph}
            </div>
        );
    }
}

export default Home;
