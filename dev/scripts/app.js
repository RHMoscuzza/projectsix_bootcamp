  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCLdc-FeCmsH87ZWgU5bDZeA_xhfNhLc0E",
    authDomain: "weather-picture-app.firebaseapp.com",
    databaseURL: "https://weather-picture-app.firebaseio.com",
    projectId: "weather-picture-app",
    storageBucket: "weather-picture-app.appspot.com",
    messagingSenderId: "709634019090"
  };
  firebase.initializeApp(config);


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
  					<h2 className="locationName">{this.props.weatherData.display_location.full}</h2>
  					<h3 className="currentWeather">Current Weather: {this.props.weatherData.temp_c}°C</h3>
  					<h3 className="skyCondition">Sky Condition: {this.props.weatherData.weather}</h3>
  					<h4>{this.props.weatherData.observation_time}</h4>
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
  			valueOfInput: "",
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
  			url: "https://autocomplete.wunderground.com/aq?&cb=call=?",
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
  		this.setState({
  			autoCompleteList: []
  		})
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
  				<label>Type in a city name</label>
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
  			response: undefined,
  			backgroundImage: "../../images/temp_background.jpg"
  		}
  		this.getWeatherData = this.getWeatherData.bind(this);
  		this.updateCityValueState = this.updateCityValueState.bind(this);
  	}
  	getWeatherData(link) {
  		ajax({
              url: `https://api.wunderground.com/api/87897118a4e511dc/conditions/` + link + `.json`,
              dataType: "jsonp",
              method: "GET",
          }).then((res) => {
              this.setState({
              	response: res.current_observation,
              });
              this.getImageData();
          });
  	}
  	updateCityValueState(value) {
  		console.log(value);
  		this.setState({
  			response: value,
  		});
  	}
  	getImageData() {
  		console.log(this.state.response);
  		ajax({
  			url: "https://api.500px.com/v1/photos/search",
  			dataType: "json",
  			method: "GET",
  			data: {
  				image_size: 1080,
  				term: this.state.response.weather + " weather",
  				consumer_key: "RhnpXYQTPL1V7BFpweEQeBR0eei6v7xIF5vb5Qxe",
  				exclude: "Nude,People,Uncategorized,Food,Wedding,Animals,Family",
  				rpp: 200,
  				sort: "times_viewed"
  			}
  		}).then((res) => {
  			let randomizer = Math.floor(Math.random() * res.photos.length);
  			this.setState({
  				backgroundImage: res.photos[randomizer].image_url
  			})
  		})
  	}
  	render() {
  		let bgImage = {
  			backgroundImage: "url(" + this.state.backgroundImage + ")"
  		}
  		return (
  			<div className="weatherRoot" style={bgImage}>
  				<div className="weatherRootSection">
  					<header>
  						<h1>The Weather Outside</h1>
  					</header>
  					<CityInput getWeatherData={this.getWeatherData} />
  					<section className="weatherSection"><Weather weatherData={this.state.response} /></section>
  				</div>
  				<footer>
  					<p><a href="http://beckah.moscuzza.ca/">Beckah Moscuzza</a> 2017 - Wunderground API - Wunderground Autocomplete API - 500px API</p>
  				</footer>
  			</div>
  		)
  	}
  }
  ReactDOM.render(<App />, document.getElementById("app"));