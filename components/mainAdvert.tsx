import { StyleSheet, Text, View, Image, Dimensions, ActivityIndicator, ImageBackground  } from "react-native";
import React, { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { axi } from "@/app/context/AuthContext";

const MainAdvert = ({ filter }) => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSponsors = async () => {
        try {
            const response = await axi.get("/sponsor/get-all-sponsors");
            setSponsors(response.data);
        } catch (error) {
            console.error("Failed to load sponsors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSponsors();
    }, []);

    const width = Dimensions.get("window").width;

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="green" />
                <Text>Loading, please hold on ...</Text>
            </View>
        );
    }

    return (
        <View style={styles.sponsorsBar}>
            <ImageBackground
      source={require("../assets/images/background.png")}  // Add your image path
      style={styles.backgroundImage}
    >
            <Carousel
                width={width}
                height={"100%"}
                data={sponsors.filter(item => item.category === filter)}
                autoPlay={true}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.container}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    );
                }}
            /></ImageBackground>
        </View>
    );
};

export default MainAdvert;

const styles = StyleSheet.create({
    sponsorsBar: {
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff', // Optional: to give a background color
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'contain', 'stretch', depending on your needs
        justifyContent: 'center',
        alignItems: 'center',
      },
    image: {
        width: "100%",
        height: "80%",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        overflow: "hidden",
        borderBottomWidth: 1,
        borderBottomColor: "green",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});