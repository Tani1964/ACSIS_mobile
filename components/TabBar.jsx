import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign, Ionicons, FontAwesome5, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/app/context/AuthContext";

const TabBar = ({ state, descriptors, navigation }) => {
    const { authState, setAuthState } = useAuth();


    useEffect(() => {
        const fetchAuthState = async () => {
            const authValue = await authState.authenticated
            setAuthState(authValue);
        };
        fetchAuthState();
    }, []);

    const icons = {
        index: (props) => <MaterialIcons name="feed" size={24} color={props.color} {...props} />,
        events: (props) => <FontAwesome5 name="calendar" size={24} color={props.color} {...props} />,
        "(pitch)/index": (props) => <Ionicons name="bulb" size={24} color={props.color} {...props} />,
        "(pitch)/pitchList": (props) => <Ionicons name="bulb" size={24} color={props.color} {...props} />,
        business: (props) => <Ionicons name="business-sharp" size={24} color={props.color} {...props} />,
        votes: (props) => <MaterialCommunityIcons name="trophy-award" size={24} color={props.color} {...props} />,
    };

    const primaryColor = "#f7981f";
    const greyColor = "#196100";
    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;
                const pitchState = authState.authenticated  ? "(pitch)/pitchList" : "(pitch)/index";

                if (!['index', 'events', "business", pitchState,  "votes"].includes(route.name)) return null;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.name}
                        style={styles.tabbarItem}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    >
                        {icons[route.name] ? icons[route.name]({ color: isFocused ? primaryColor : greyColor }) : null}
                        <Text style={{
                            color: isFocused ? primaryColor : greyColor, fontSize: 12
                        }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabbar: {
        position: "absolute",
        bottom: 5,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        borderTopLeftRadius: 50, // Corrected: Use a number instead of a string
        borderBottomLeftRadius: 50, // Corrected: Use a number instead of a string
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        paddingVertical: 15,
        width: "98%",
        borderTopColor: "lightgrey",
        borderLeftColor: "lightgrey",
        borderRightColor: "lightgrey",
        // borderWidth: 1,
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -10, // Negative height to lift shadow upwards
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,

        // Elevation for Android
        elevation: 5,
    },
    tabbarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 4
    }
});

export default TabBar;
