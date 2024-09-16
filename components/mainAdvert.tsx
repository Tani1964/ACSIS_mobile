import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const MainAdvert = () => {
  // this page wil use a slider to display the main advert
  const photos = [
    "https://source.unsplash.com/1024x768/?nature",
    "https://source.unsplash.com/1024x768/?water",
    "https://source.unsplash.com/",
  ];
  return (
    <View>
      <Text>mainAdvert</Text>
      {/* <ImageSlider
        loopBothSides
        autoPlayWithInterval={3000}
        images={[
          'https://source.unsplash.com/1024x768/?nature',
          'https://source.unsplash.com/1024x768/?water',
          'https://source.unsplash.com/
        ]}
        /> */}
        
     <Image source={{uri:'https://pitci-bucket.s3.us-east-1.amazonaws.com/2b10O4IioSNxsyqxkeOwixyDve8tsnhlb22V59NUL00q0SECJe1IFT66.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXYKJU5J3H35AZD47%2F20240914%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240914T173553Z&X-Amz-Expires=86400&X-Amz-Signature=46491cf68e7b4a3bd69e5bb77d912d9768d2e94f57d0a2f7ff0548cc0eff4145&X-Amz-SignedHeaders=host&x-id=GetObject'}} style={styles.image} />
    </View>
  );
};

export default MainAdvert;

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        },
});
