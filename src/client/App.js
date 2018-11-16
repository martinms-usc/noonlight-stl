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
    const { dispatch } = this.props;
    dispatch(
      toggleSidePanel()
    );
    this.selectConfig('hexbin');
  }

  getMapConfig() {
    const { keplerGl } = this.props;
    const { map } = keplerGl;
    return KeplerGlSchema.getConfigToSave(map);
  }

  visitNoonlight = () => {
    const win = window.open('https://noonlight.com/', '_blank');
    win.focus();
  }

  addData() {
    const { dispatch, config, dataset } = this.props;
    dispatch(
      addDataToMap({
        config: config.data,
        datasets: dataset
      })
    );
  }

  selectConfig(type) {
    const { dispatch } = this.props;
    dispatch(
      loadConfig(type)
    );
    this.addData();
  }

  exportMapConfig() {
    const mapConfig = this.getMapConfig();
    downloadJsonFile(mapConfig, 'kepler.gl.json');
  }

  selectHeatmap() {
    this.selectConfig('heatmap');
  }

  selectHexbin() {
    this.selectConfig('hexbin');
  }

  render() {
    const { config } = this.props;

    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <div onClick={this.visitNoonlight} className="container">
          <img src={typemark} alt="typemark" className="typemark" />
        </div>

        <AutoSizer>
          {({ height, width }) => (
            <KeplerGl
              mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
              id="map"
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
        <button type="button" className="export label" onClick={this.exportMapConfig}>Export</button>
        {
          config.selected === 'hexbin'
            ? (<Heatmap selectHeatmap={this.selectHeatmap} />)
            : (<Hexbin selectHexbin={this.selectHexbin} />)
        }
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  keplerGl: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired
};

App.defaultProps = {
  keplerGl: {},
  dataset: {},
  config: {}
};

function Heatmap(props) {
  const { selectHeatmap } = props;
  return (
    <div onClick={selectHeatmap} className="config-container">
      <span className="label heat">Heat Map</span>
      <img src={heatmap} alt="heatmap" className="config-select" />
    </div>
  );
}

Heatmap.propTypes = {
  selectHeatmap: PropTypes.func.isRequired
};

function Hexbin(props) {
  const { selectHexbin } = props;
  return (
    <div onClick={selectHexbin} className="config-container">
      <span className="label hex">Hex Bin</span>
      <img src={hexbin} alt="hexbin" className="config-select" />
    </div>
  );
}

Hexbin.propTypes = {
  selectHexbin: PropTypes.func.isRequired
};

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
