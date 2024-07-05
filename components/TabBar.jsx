import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign, Ionicons, FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';

const TabBar = ({ state, descriptors, navigation }) => {
    const [authState, setAuthState] = useState(false);

    useEffect(() => {
        const fetchAuthState = async () => {
            const authValue = await SecureStore.getItemAsync("authenticated");
            console.log(authValue)
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
    };

    const primaryColor = "#196100";
    const greyColor = "grey";
    console.log(authState)
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
                // console.log(authState)
                const pitchState = authState ? "(pitch)/pitchList" : "(pitch)/index";

                if (!['index', 'events', "business", pitchState].includes(route.name)) return null;

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
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 15,
        width: "100%",
        borderTopColor: "lightgrey",
        borderTopWidth: 1
    },
    tabbarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 4
    }
});

export default TabBar;
