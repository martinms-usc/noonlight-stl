import React, { Component } from 'react';
import {connect} from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import KeplerGl from 'kepler.gl';
import Processors from 'kepler.gl/processors';
import {addDataToMap, toggleSidePanel} from 'kepler.gl/actions';
import KeplerGlSchema from 'kepler.gl/schemas';

import noonlightUsage from '../data/noonlightTrips.csv';
import config from '../data/config';

import nlStacked from '../../public/nl_stacked.png';
import typemark from '../../public/nl_white_typemark.png';

import downloadJsonFile from "./file-download";
import './app.css';


const styles = {
  container: {
    borderRadius: "5px",
    border: 0,
    background: "#344351",
    zIndex: 9,
    position: "absolute",
    display: "block",
    bottom: "0px",
    left: "5px",
    position: "absolute",
    display: "block",
    width: "219px",
    height: "27px"
  },
  typemark: {
    bottom: "4px",
    position: "absolute",
    zIndex: 10,
    width: "200px",
    cursor: "pointer",
    left: "9px",
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.visitNoonlight = this.visitNoonlight.bind(this);
  }

  componentDidMount() {
    const data = Processors.processCsvData(noonlightUsage);
    const dataset = {
      data,
      info: {
        id: 'my_data',
        label: 'Noonlight Trips'
      }
    };
    this.props.dispatch(
      addDataToMap({
        config,
        datasets: dataset 
      })
    );
    this.props.dispatch(
      toggleSidePanel()
    );
  }

  getMapConfig() {
    const {keplerGl} = this.props;
    const {map} = keplerGl;
    return KeplerGlSchema.getConfigToSave(map);
  }

  exportMapConfig() {
    const mapConfig = this.getMapConfig();
    downloadJsonFile(mapConfig, 'kepler.gl.json');
  }

  visitNoonlight() {
    let win = window.open('https://noonlight.com/', '_blank');
    win.focus();
  }

  render() {
// <button onClick={this.exportMapConfig}>Export</button>
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <div onClick={this.visitNoonlight} style={styles.container}>
          <img src={typemark} style={styles.typemark} />
        </div>
        <AutoSizer>  
          {(height, width) => (
            <KeplerGl
              mapboxApiAccessToken={MAPBOX_TOKEN}
              id="map"
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
