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
				<div className="weather">
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
			<div className="weatherContainer">
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
			autoCompleteList: []	
		}
		this.handleTyping = this.handleTyping.bind(this);
	}

	handleTyping(event) {
		this.handleAutoComplete(event.target.value);
		this.setState({
			valueOfInput: event.target.value
		})	
	}
	handleAutoComplete(value) {
		ajax({
			url: "http://autocomplete.wunderground.com/aq?&cb=call=?",
			dataType: "jsonp",
			method: "GET",
			data: {
				query: value,
			}
		}).then((res) => {
			this.setState({
				autoCompleteList: res.RESULTS
			})
		});
	}
	handleLocationClick(link, event) {
		this.props.getWeatherData(link)
	}
	renderAutoCompleteList() {
		if (this.state.autoCompleteList.length == 0) {
			return null;	
		} else {
			return (
				<ul>
					{this.state.autoCompleteList.map((item) => {
						return (
							<li key={item.zmw} onClick={this.handleLocationClick.bind(this, item.l)}>
								{item.name}
							</li>
						)
					})}
				</ul>
			)
		}
	}
	render() {
		let autoCompleteList=this.renderAutoCompleteList();
		//onChange tracks the keystrokes so it is able to put the keystrokes into a value for later use.  The value is stored inside of a state.
		return (
			<div className="form">
				<input className="weatherInput cityInput" type="text" placeholder="Location" value={this.state.valueOfInput} onChange={this.handleTyping} />
				{autoCompleteList}
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
	getWeatherData(link) {
		//ajax for weather goes here and this.state.weather to the response
		ajax({
            url: `http://api.wunderground.com/api/61f0a55cb00602dc/conditions/` + link + `.json`,
            dataType: "jsonp",
            method: "GET"
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
			<div className="weatherRoot">
				<div className="weatherRootSection">
					<header>
						<h1>The Weather Outside</h1>
					</header>
					<CityInput getWeatherData={this.getWeatherData} />
					<section className="weatherSection"><Weather weatherData={this.state.response} /></section>
				</div>
				<footer>
					<p>Beckah Moscuzza, 2017</p>
				</footer>
			</div>
		)
	}
}


ReactDOM.render(<App />, document.getElementById("app"));
console.log('it worked!')