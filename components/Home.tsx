import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  View,
} from 'react-native';
import React, {Component} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
Geocoder.init('AIzaSyA9mJZ_997tgVQAwSLlJGKNIlMAe0Xyqj4');

interface IProps {}
interface IState {
  coordinateValues: any;
  location: any;
}
export class Home extends Component<IProps, IState> {
  state = {
    coordinateValues: {
      latitude: 17.376262847127638,
      longitude: 78.52636646479368,
    },
    location: '',
  };
  componentDidMount() {
    async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //To Check, If Permission is granted
        this.getOneTimeLocation();
      }
    };
  }
  getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position: any) => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        this.setState({
          coordinateValues: {
            latitude: currentLatitude,
            longitude: currentLongitude,
          },
        });
      },
      (error: any) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };
  onPressmap = async (event: any) => {
    const {coordinate} = event.nativeEvent;
    console.log(coordinate);
    await Geocoder.from(coordinate.latitude, coordinate.longitude)
      .then(response => {
        console.log('hi');
        const selectedLocation = response.results[0].formatted_address;
        console.log('data', selectedLocation);
        this.setState({
          coordinateValues: coordinate,
          location: selectedLocation,
        });
      })
      .catch(error => {
        console.log('Error', error);
      });
  };
  render() {
    const {location} = this.state;
    const locationArea = location.split(',');
    let area: any = ['', '', ''];
    if (locationArea.length === 1) {
      area = [locationArea[0], locationArea[0], locationArea[0]];
    } else if (locationArea.length === 2) {
      area = [locationArea[0], locationArea[0], locationArea[1]];
    } else if (locationArea.length >= 3) {
      area = [
        locationArea[locationArea.length - 3],
        locationArea[locationArea.length - 2],
        locationArea[locationArea.length - 1],
      ];
    }

    console.log(area);
    return (
      <View style={styles.mainCard}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          onPress={this.onPressmap}
          region={{
            latitude: 17.376262847127638,
            longitude: 78.52636646479368,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            coordinate={this.state.coordinateValues}
            // image={MarkerImg}
            title="this is Title"
            description="this is Description"
          />
          {/* <Callout tooltip>
            <View style={styles.calloutView}>
              <Text style={styles.colloutText}>Favorite Restarunt</Text>
              <Text>A Short Description</Text>
            </View>
          </Callout> */}
        </MapView>
        <View style={styles.locationCard}>
          <Text style={styles.currentLocationText}>Current Location</Text>
          <View style={styles.inputCrad}>
            <Text style={styles.labelText}>Area</Text>
            <TextInput
              style={styles.inputLocation}
              value={area[0]}
              placeholder="Area"
            />
          </View>
          <View style={styles.inputCrad}>
            <Text style={styles.labelText}>State</Text>
            <TextInput
              style={styles.inputLocation}
              value={area[1]}
              placeholder="State"
            />
          </View>
          <View style={styles.inputCrad}>
            <Text style={styles.labelText}>Country</Text>
            <TextInput
              style={styles.inputLocation}
              value={area[2]}
              placeholder="Countrey"
            />
          </View>
          <TouchableOpacity style={styles.conformLocationBtn}>
            <Text style={styles.conformLocationText}>Conform Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainCard: {
    flex: 1,
    padding: 10,
  },
  map: {
    height: '65%',
    width: '100%',
  },
  calloutView: {
    padding: 10,
    backgroundColor: '#fff',
    height: 50,
    width: 150,
  },
  colloutText: {
    fontSize: 30,
    fontWeight: '500',
  },
  locationCard: {
    padding: 10,
  },
  currentLocationText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputCrad: {
    flexDirection: 'row',
  },
  labelText: {
    fontSize: 20,
    minWidth: 70,
  },
  inputLocation: {
    height: 40,
    width: 240,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 15,
    paddingLeft: 20,
  },
  conformLocationBtn: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#e8c35d',
    height: 45,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    marginBottom: 7,
  },
  conformLocationText: {
    fontSize: 20,
    color: '#fff',
  },
});
export default Home;
