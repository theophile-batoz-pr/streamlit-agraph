import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { useState } from "react"
import VisGraph, { NetworkEvents } from 'react-vis-graph-wrapper';
import {
  Network,
} from 'vis-network';

type Props = {
  args: string
}

function StreamlitVisGraph(props: Props) {

  const [stateNetwork, setNetwork] = useState<Network | undefined>()
  const [stateFocus, setFocus] = useState<string | undefined>()

  function lookup_node_id(lookup_node, mynodes){
    for (let node of mynodes){
        if (node.id === lookup_node){
            return node;
        }
  }}

  var graph = JSON.parse(props.args["data"]);
  
  var nodes = graph.nodes.slice();
  const htmlTitle = (html):any => {   
    const container = document.createElement("div");
    container.innerHTML = html;
    return container;
  }
  for (let i = 0; i < nodes.length; i++) {
    if(nodes[i].title)
      nodes[i].div = htmlTitle(nodes[i].title);
  }

  const options = JSON.parse(props.args["config"]);

  const events: Partial<Record<NetworkEvents, (params?: any) => void>> = {

    selectNode: (event:any) => {
      Streamlit.setComponentValue(event.nodes[0]);
    },

    doubleClick: (event:any) => {
      console.log(event.nodes);
      // let link = nodes;
      let lookup_node = lookup_node_id(event.nodes[0], nodes);
      let link = lookup_node.div.innerHTML;
      if(link){
        window.open(link);
      }
    },
  };
  if (options.centerViewOnNodeId) {
    events.afterDrawing = () => {
      if (stateFocus !== options.centerViewOnNodeId) {
        console.log('AFTER DRAWING ', options.centerViewOnNodeId, ' ok')
        setFocus(options.centerViewOnNodeId)
        stateNetwork?.focus(options.centerViewOnNodeId)
      }
    }
  }
  return (
    <span>
      <VisGraph
      graph={graph}
      options={options}
      events={events}
      getNetwork={(network: Network) => {
        if (!stateNetwork) {
          setNetwork(network)
        }
        //  if you want access to vis.js network api you can set the state in a parent component using this property
        //console.log(network);
      }}/>
    </span>
  )
}

export default withStreamlitConnection(StreamlitVisGraph)
