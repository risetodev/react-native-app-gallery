import { Permissions } from "expo";
import React from "react";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  CameraRoll,
  Image,
  TouchableHighlight,
  View,
  ViewPagerAndroid,
  BackHandler,
  AppRegistry
} from "react-native";

export default class App extends React.Component {
  state = {
    images: [],
    isPhotoFullScreen: false,
    selectedImage: null
  };

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA_ROLL)
      .then(res => {
        console.log("Access: " + res.status);
        return CameraRoll.getPhotos({
          first: 1000,
          assetType: "Photos"
        })
          .then(r => {
            this.setState({ images: r.edges });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(res => console.log("Access: " + res.status));

    BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.state.isPhotoFullScreen) {
        this.onClose();
        return true;
      }
    });
  }

  onOpen = index => {
    this.setState({
      isPhotoFullScreen: true,
      selectedImage: index
    });
  };
  onClose = () =>
    this.setState({ isPhotoFullScreen: false, selectedImage: null });

  render() {
    return (
      <>
        {this.state.isPhotoFullScreen ? (
          <ViewPagerAndroid
            style={styles.background}
            initialPage={this.state.selectedImage}
            pageMargin={20}
          >
            {this.state.images.map((item, i) => (
              <View key={i}>
                <TouchableHighlight
                  style={styles.container}
                  onPress={this.onClose}
                >
                  <Image
                    style={styles.fullSreen}
                    resizeMode="contain"
                    source={{ uri: item.node.image.uri }}
                  />
                </TouchableHighlight>
              </View>
            ))}
          </ViewPagerAndroid>
        ) : (
          <FlatList
            data={this.state.images}
            keyExtractor={(item, i) => i}
            style={styles.container}
            renderItem={({ item, index }) => (
              <TouchableHighlight
                style={styles.item}
                onPress={() => this.onOpen(index)}
              >
                <View>
                  <Image
                    style={styles.item}
                    source={{ uri: item.node.image.uri }}
                  />
                </View>
              </TouchableHighlight>
            )}
            numColumns={3}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    marginBottom: 1,
    marginRight: 1,
    height: Dimensions.get("window").width / 3,
    width: Dimensions.get("window").width / 3
  },
  background: {
    backgroundColor: "black",
    flex: 1
  },
  fullSreen: {
    flex: 1,
    height: undefined,
    width: undefined
  }
});
