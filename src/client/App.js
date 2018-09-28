import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import KeplerGl from 'kepler.gl';
import { addDataToMap, toggleSidePanel } from 'kepler.gl/actions';
import KeplerGlSchema from 'kepler.gl/schemas';

import { loadConfig, downloadJsonFile } from './actions';

import typemark from '../../public/typemark.png';
import heatmap from '../../public/heatmap.png';
import hexbin from '../../public/hexbin.png';
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.visitNoonlight = this.visitNoonlight.bind(this);
    this.exportMapConfig = this.exportMapConfig.bind(this);
    this.addData = this.addData.bind(this);
    this.selectConfig = this.selectConfig.bind(this);
    this.selectHexbin = this.selectHexbin.bind(this);
    this.selectHeatmap = this.selectHeatmap.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(
      toggleSidePanel()
    );
    this.selectConfig('hexbin');
  }

  selectConfig(type) {
    this.props.dispatch(
      this.props.loadConfig(type)
    );
    this.addData();
  }

  addData() {
    this.props.dispatch(
      addDataToMap({
        config: this.props.config.data,
        datasets: this.props.dataset 
      })
    );
  }

  getMapConfig() {
    const { keplerGl}  = this.props;
    const { map } = keplerGl;
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

  selectHeatmap() {
    this.selectConfig('heatmap');
  }

  selectHexbin() {
    this.selectConfig('hexbin');
  }

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <div onClick={this.visitNoonlight} className='container'>
          <img src={typemark} className='typemark' />
        </div>
        
        <AutoSizer>
          {({height, width}) => (
            <KeplerGl
              mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
              id="map"
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
        <button className='export label' onClick={this.exportMapConfig}>Export</button>
        {
          this.props.config.selected === 'hexbin' ? 
          (<Heatmap selectHeatmap={this.selectHeatmap}/>) :
          (<Hexbin selectHexbin={this.selectHexbin} />)
        }
      </div>
    );
  }
}

App.propTypes = {
  visitNoonlight: PropTypes.func,
  exportMapConfig: PropTypes.func,
  selectHexbin: PropTypes.func,
  selectHeatmap: PropTypes.func,
  keplerGl: PropTypes.object,
  dataset: PropTypes.object,
  config: PropTypes.object
};

function Heatmap(props) {
  return (
    <div onClick={props.selectHeatmap} className='config-container'>
      <span className='label heat'>Heat Map</span>
      <img src={heatmap} className='config-select' />
    </div>
  );
}

function Hexbin(props) {
  return (
    <div onClick={props.selectHexbin} className='config-container'>
      <span className='label hex'>Hex Bin</span>
      <img src={hexbin} className='config-select' />
    </div>
  );
}

const mapStateToProps = state => ({
  keplerGl: state.keplerGl,
  dataset: state.app.dataset,
  config: state.app.config
});

const dispatchToProps = dispatch => ({
  dispatch,
  loadConfig
});

export default connect(mapStateToProps, dispatchToProps)(App);
