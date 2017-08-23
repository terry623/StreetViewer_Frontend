import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './StreetView.css';

import { Button } from 'reactstrap';
import ReactStreetview from 'react-streetview';
import { store_current_position, store_last_position, screenshot, get_current_position, get_last_position } from 'states/camera-actions.js';


class StreetView extends React.Component {
	static propTypes = {
		lat: PropTypes.number, //緯度
		lng: PropTypes.number, //經度
		message: PropTypes.string,
		url: PropTypes.string,
		account: PropTypes.string,
		dispatch: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			position: null,
			pov: null
		};

		this.handle_screenshot = this.handle_screenshot.bind(this);
		this.handle_store_last_position = this.handle_store_last_position.bind(this);
	}

	componentDidMount() {
		if (this.props.account != null) {
			this.props.dispatch(get_last_position(this.props.account));
		}
	}

	componentDidUpdate() {
		if (this.props.account != null && this.state.position != null) {

			var position_str = JSON.stringify(this.state.position);
			var position_res = position_str.replace(/\"/g, "").replace("{", "").replace("}", "").replace("lat:", "").replace("lng:", "").split(",");

			var lat = Number(position_res[0]);
			var lng = Number(position_res[1]);

			this.props.dispatch(store_current_position(this.props.account, lat, lng));
		}
	}

	render() {

		const { lat, lng, message, url } = this.props;
		const google_key = 'AIzaSyB2qGLOwrR1n-FrGskEn47AU1X6Nban0S4';

		var streetViewPanoramaOptions = {
			position: { lat: lat, lng: lng },
			pov: { heading: 0, pitch: 0 },
			zoom: 1,
			disableDefaultUI: true,
			disableDoubleClickZoom: true
		};


		return (
			<div className='StreetView'>

				<Button className='btn-form' onClick={this.handle_screenshot}>Screen Shot!</Button>
				<Button className='btn-form' onClick={this.handle_store_location}>Store Location!</Button>

				<ReactStreetview
					apiKey={google_key}
					streetViewPanoramaOptions={streetViewPanoramaOptions}
					onPositionChanged={position => this.setState({ position: position })}
					onPositionChanged={position => this.setState({ position: position })}
					onPovChanged={pov => this.setState({ pov: pov })}
				/>

				<h4>{message}</h4>

				<img src={url}></img>

			</div>

		);
	}

	handle_screenshot() {
		if (this.state.position !== null && this.state.pov !== null) {

			var position_str = JSON.stringify(this.state.position);
			var position_res = position_str.replace(/\"/g, "").replace("{", "").replace("}", "").replace("lat:", "").replace("lng:", "").split(",");

			var lat = Number(position_res[0]);
			var lng = Number(position_res[1]);
			var heading = Number(this.state.pov.heading);
			var pitch = Number(this.state.pov.pitch);

			this.props.dispatch(screenshot(this.props.account, lat, lng, heading, pitch));
		}
	}

	handle_store_last_position() {
		if (this.state.position !== null) {

			var position_str = JSON.stringify(this.state.position);
			var position_res = position_str.replace(/\"/g, "").replace("{", "").replace("}", "").replace("lat:", "").replace("lng:", "").split(",");

			var lat = Number(position_res[0]);
			var lng = Number(position_res[1]);

			this.props.dispatch(store_last_position(this.props.account, lat, lng));
		}
	}

}

export default connect(state => ({
	...state.camera,
	...state.account
}))(StreetView);
