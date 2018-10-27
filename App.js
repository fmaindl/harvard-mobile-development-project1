import React, { Component, Fragment } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Switch,
  TextInput,
  Header,
  
} from 'react-native';

import {vibrate} from './utils'

import { Constants } from 'expo';

import PropTypes from 'prop-types';

//styles for the component rendering
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingTop: Constants.statusBarHeight,
  },

  timercontainer: {
    flex: 6,

    flexDirection: 'column',

    backgroundColor: '#fff',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingTop: Constants.statusBarHeight,
  },

  text: {
    fontFamily: 'sans-serif-thin',

    fontSize: 30,

    fontWeight: '200',

    color: 'black',

    textAlign: 'center',

    marginBottom: 30,
  },

  texttimer: {
    fontFamily: 'Roboto',

    fontSize: 40,

    fontWeight: '300',

    color: 'black',

    textAlign: 'center',

  },

  

   multielement: {

    flexGrow: 1,
    
    flexDirection: 'row',

    marginBottom: 20,

    justifyContent: 'space-between',




  },

  title: {
    fontFamily: 'Roboto',

    fontSize: 72,

    color: 'black',

    textAlign: 'center',

    marginBottom: 40,

    fontWeight: '600',
  },

  textinput: {
    fontFamily: 'sans-serif-condensed',

    fontSize: 20,

    width: 200,

    borderWidth: 1,

    color: '#222222',

    textAlign: 'center',

    marginBottom: 10,
  },

  button: {
    fontFamily: 'Roboto',

    fontSize: 20,

    color: '#841584',

    textAlign: 'center',

    paddingLeft: 80,

    paddingRight: 80,
  },
});

//this class is the one that will take care of our timers
class Counter extends Component {
  constructor(props) {
    super(props)

    //initializing state variables
    this.state = {
      workCounterSafe: null,
      workCounter: null,

      restCounterSafe: null,
      restCounter: null,

      working: null,

      pause: false,
    }
  }

  //when component is mounted, sets these parameters (converts minutes to seconds, set the decrease function
  // to only update every 1000ms and set 'working' boolean to true)
  componentDidMount() {
    this.state.workCounterSafe = this.props.text1 * 60
    this.state.restCounterSafe = this.props.text2 * 60
    this.state.workCounter = this.state.workCounterSafe
    this.state.restCounter = this.state.restCounterSafe
    this.state.working = true,
    this.timer = setInterval(this.dec, 1000)
  }

  //every update check if we reached 0 on any of our 2 timers, if so reset it and start the other one
  componentDidUpdate = () => {
    if (this.state.workCounter == 0) {
      vibrate()
      this.setState(prevState => ({working: !prevState.working}))
      this.setState(prevState => ({workCounter: prevState.workCounterSafe}))
      
    } else if (this.state.restCounter == 0) {
      vibrate()
      this.setState(prevState => ({working: !prevState.working}))
      this.setState(prevState => ({restCounter: prevState.restCounterSafe}))
    }
    
  }
  
  //function that lowers our timer by 1 every second
  dec = () => {
    if (this.state.working == true && this.state.pause == false) {
      this.setState(prevState => ({workCounter: prevState.workCounter - 1
      }))
    } else if (this.state.working == false && this.state.pause == false) {
      this.setState(prevState => ({restCounter: prevState.restCounter - 1
      }))
    } else {
      return
    }
  }

  pauseHandler = () => {
    this.setState(prevState => ({
      pause: !prevState.pause, 
    }))
  }




  render() {
    return (
      //the conversion to minutes and seconds is handled below could be done more efficiently but sort of works for now
      //also checks for working boolean, which determines if we are in work or rest mode
      //and finally the two buttons allow us to pause or start the timer 
      <View style={styles.timercontainer}>
        {this.state.working ? (
            <Fragment>
              <Text style={styles.texttimer}> You are currently in a working session. </Text>
              <Text style={styles.texttimer}> {parseInt(this.state.workCounter / 60) +':' + ((this.state.workCounter % 60) >= 10 ? 
              (this.state.workCounter%60) : '0'+this.state.workCounter%60) + ' remaining'} </Text>
            </Fragment>     
        ) : 
            <Fragment>
              <Text style={styles.texttimer}> You are currently supposed to rest. </Text>
              <Text style={styles.texttimer}> {parseInt(this.state.restCounter / 60) +':' + ((this.state.restCounter % 60) >= 10 ? 
              (this.state.restCounter%60) : '0'+this.state.restCounter%60) + ' remaining'} </Text>
            </Fragment>
        }
        {this.state.pause ? (
            <Fragment>
              <Button 
                style={styles.button}
                title='Start'
                onPress={this.pauseHandler}/>
            </Fragment>
        ) : 
            <Fragment>
              <Button 
                style={styles.button}
                title='Pause'
                onPress={this.pauseHandler}/>
            </Fragment>
        }
      </View>
    )
  }
}

//main class of our app
export default class App extends React.Component {
  constructor() {
    super()

    //state variables
    this.state = {
      text1: "",

      text2: "",

      showCounter: false,
    }
  }

  //updates text when changed
  handleText1Change = text1 => {
    this.setState({text1})
  }
  //updates text when changed
  handleText2Change = text2 => {
    this.setState({text2})
  }

  //our state handler, allows us to go from our 2 main App state, initial menu and counter display
  switchState = () => {
    this.state.text1 = parseInt(this.state.text1)
    this.state.text2 = parseInt(this.state.text2)
    //check if input is valid
    if (!this.state.showCounter && (this.state.text1 == null || this.state.text2 == null || this.state.text1 != Number || this.state.text2 != Number)) {
      alert('this entry is not valid');
    } 
    //if in main menu, go to the other
    else if (!this.state.showCounter) {
      this.setState(prevState => ({
        showCounter: !prevState.showCounter, 
      }))
    } 
    //if in counter mode, go to main menu and reset input
    else if (this.state.showCounter) {
      this.setState(prevState => ({
        text1: '',
        text2: '',
        showCounter: !prevState.showCounter, 
      }))
    }
  }


  //simple text rendering, text input and button tags
  render() {
    if (!this.state.showCounter) {
      return (
        <View style={styles.containerInit}>
          <Text style={styles.title}> Pomodoro Timer </Text>

          <Text style={styles.text}>
            {' '}
            How many minutes do you want to work and rest?
          </Text>
        

          <View style={styles.multielement}>
            <Text style={styles.text}> work:  </Text> 
            <TextInput
              style={styles.textinput}
              value={this.state.text1}
              keyboardType="numeric"
              placeholder="Type amount"
              onChangeText={this.handleText1Change}
            />
            
          </View>
          <View style={styles.multielement}>
            <Text style={styles.text}> rest:  </Text> 
            <TextInput
              style={styles.textinput}
              value={this.state.text2}
              keyboardType="numeric"
              placeholder="Type amount"
              onChangeText={this.handleText2Change}
            />
            
          </View>
          <Button
              style={styles.button}
              title="OK!"
              id="button1"
              onPress={this.switchState}
            />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Counter 
            text1={parseInt(this.state.text1)}
            text2={parseInt(this.state.text2)}
          />
          <Button 
              style={styles.button}
              title='Reset'
              onPress={this.switchState}
            />
        </View>
      )
    }
  }
}
