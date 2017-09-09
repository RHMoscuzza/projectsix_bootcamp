import React from "react";
import ReactDOM from "react-Dom";
import { ajax } from "jquery";
import { 
    BrowserRouter as Router, 
    Route, Link } from "react-router-dom";

class Weather extends React.Component {
	//constructor is like the contractor building the house, it's the first thing running in each component.  It is the scaffolding for the component.
	constructor(props) {
		//Props are the values that the parent component (in this case the app component) passes to the child.  Props cannot be modified.  This means you cannot do this.props.car = "fast" because that would try to change the value.  If you need to change the value of the props you need to update the parent passing the prop to the child.  An example of this is the updateCityValueState.
		super(props);
		//State are the values of the current component.  THe values of this.state can be changed however they can only be updated by typing this.setState({cars: "fast"}).  THis will update the property cars with the value fast.  This is the only way you can update this value, if you try otherwise the program will not see the change and will not update the value.  
		//Props and State are globally accessible to the current component.  You can access them by typing this.state.value... or this.props.value...
		this.state = {

		}
	}
	renderWeather() {
		if (this.props.weatherData == undefined) {
			return null;
		} else {
			return (
				<div>
					<h2 className="currentWeather">Current Weather: <span>{this.props.weatherData.temp_c}</span></h2>
					<h2 className="skyCondition">Sky Condition: <span>{this.props.weatherData.weather}</span></h2>
					<h3>{this.props.weatherData.observation_time}</h3>
				</div>
			)	
		}
		
	}

	render() {
		var renderWeatherData = this.renderWeather();
		return (
			<div>
				{renderWeatherData}
			</div>
		)
	}
}
class CityInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			valueOfInput: "Toronto",
			valueOfInputState: "Ontario"	
		}
		this.handleTyping = this.handleTyping.bind(this);
		this.handleStateTyping = this.handleStateTyping.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleTyping(event) {
		this.setState({
			valueOfInput: event.target.value
		})	
	}
	handleStateTyping(event) {
		this.setState({
			valueOfInputState: event.target.value
		})
	}
	handleSubmit(event) {
		event.preventDefault();
		this.props.getWeatherData(this.state.valueOfInput, this.state.valueOfInputState)
		// this.props.updateCityValueState(this.state.valueOfInput);
	}
	render() {
		//onChange tracks the keystrokes so it is able to put the keystrokes into a value for later use.  The value is stored inside of a state.
		return (
			<div>
				<input className="cityInput" type="text" placeholder="City" value={this.state.valueOfInput} onChange={this.handleTyping} />
				<input className="stateInput" type="text" placeholder="Provence" value={this.state.valueOfInputState} onChange={this.handleStateTyping} />
				<button onClick={this.handleSubmit}>Submit</button>
			</div>
		)
	}
}
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			weather: null,
			response: undefined
		}
		this.getWeatherData = this.getWeatherData.bind(this);
		this.updateCityValueState = this.updateCityValueState.bind(this);
	}
	getWeatherData(city, state) {
		console.log(city);
		//ajax for weather goes here and this.state.weather to the response
		ajax({
            url: `http://api.wunderground.com/api/61f0a55cb00602dc/conditions/q/` + state + `/` + city + `.json`,
            dataType: "jsonp",
            method: 'GET'
        }).then((res) => {
            // this.updateCityValueState(res);
            this.setState({
            	response: res.current_observation,
            });
        });
	}
	updateCityValueState(value) {
		console.log(value);
		this.setState({
			response: value,
		});
	}
	render() {

		return (
			<div>
				<header>
					<h1>The Weather Outside</h1>
				</header>
				<CityInput getWeatherData={this.getWeatherData} />
				<section><Weather weatherData={this.state.response} /></section>
				<footer>
					<p>Beckah Moscuzza, 2017</p>
				</footer>
			</div>
		)
	}
}


ReactDOM.render(<App />, document.getElementById("app"));
console.log('it worked!')