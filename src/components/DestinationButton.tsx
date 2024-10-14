import { getDistance } from 'geolib';
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Animated, PanResponder, Dimensions, Image, ScrollView } from 'react-native';
const { height: screenHeight, width } = Dimensions.get('window');
const DestinationButton = ({
    destination,
    isChoosingDestination,
    setIsChoosingDestination,
    removeDestination,
    location
}: any) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false); // Track visibility of the bottom menu
    const [menuHeight] = useState(new Animated.Value(0));
    const menuMaxHeight = screenHeight * 0.6;
    const [isMenuExpanded, setIsMenuExpanded] = useState(false); // State to check if menu is fully expanded
    const [distance, setDistance] = useState()
    const [selectedMode, setSelectedMode] = useState('bike');

    const modes = [
        { key: 'walker', icon: require('../assets/walk.png'), label: 'Walker', speed: 5 },
        { key: 'bicycle', icon: require('../assets/bike.png'), label: 'Bicycle', speed: 15 },
        { key: 'bike', icon: require('../assets/motorbike.png'), label: 'Bike', speed: 25 },
        { key: 'car', icon: require('../assets/car.png'), label: 'Car', speed: 45 },
    ];

    // PanResponder for handling drag gestures
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (evt, gestureState) => {
                const newHeight = menuMaxHeight - gestureState.dy;
                if (newHeight >= 0 && newHeight <= menuMaxHeight) {
                    menuHeight.setValue(newHeight);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy > 50) {
                    // Collapse the menu completely if dragged down
                    Animated.timing(menuHeight, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => {
                        setIsMenuExpanded(false);
                        setIsMenuVisible(false);
                    });
                } else if (gestureState.dy < -50) {
                    Animated.timing(menuHeight, {
                        toValue: menuMaxHeight,
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => {
                        setIsMenuExpanded(true);
                    });
                }
            },
        })
    ).current;

    const showCoordinates = () => {
        if (!destination) return;        
        const distance =
            getDistance(
                { latitude: location.latitude, longitude: location.longitude },
                { latitude: destination.latitude, longitude: destination.longitude }
            ) / 1000; // Convert to kilometers
        setDistance(distance.toFixed(2));
        setIsMenuVisible(true); // Show the bottom menu
        Animated.timing(menuHeight, {
            toValue: menuMaxHeight,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setIsMenuExpanded(true);
        });
    };

    useEffect(() => {
        if (isMenuVisible && destination)
            showCoordinates();
    },[destination])

    const closeMenu = () => {

        Animated.timing(menuHeight, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setIsMenuExpanded(false);
            setIsMenuVisible(false); // Hide the menu after collapsing
        });
    };

    function formatTime() {
        let minutes = distance/modes.find(mode => mode.key === selectedMode).speed;
        if (minutes < 0) {
            return "Invalid time"; 
        }
    
        if (minutes > 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            console.log(`${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`);
            
            return `${hours}.${remainingMinutes.toFixed(0)} HRS`;
        } else {
            console.log(distance/modes.find(mode => mode.key === selectedMode).speed);
            
            return `${minutes.toFixed(2)} MINS`;
        }
    }

    return (
        <View style={styles.buttonContainer}>
            {isChoosingDestination ? (
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsChoosingDestination(false)}>
                    <Text style={styles.closeButtonText}>x</Text>
                </TouchableOpacity>
            ) : (
                <>
                    <View>

                        {!destination ? (
                            <TouchableOpacity
                                style={{ backgroundColor: 'blue', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5, marginBottom: 20 }}
                                onPress={() => setIsChoosingDestination(true)}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Choose Destination</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                {!isMenuVisible &&

                                    <TouchableOpacity
                                        style={{ backgroundColor: 'blue', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5, marginBottom: 20 }}
                                        onPress={showCoordinates}>
                                        <Text style={{ color: 'white', textAlign: 'center' }}>Show Details</Text>
                                    </TouchableOpacity>
                                }
                            </>
                        )}
                    </View>
                </>
            )}
            <View style={styles.container}>

                {isMenuVisible && (
                    <Animated.View
                        style={[
                            styles.bottomMenu,
                            {
                                height: menuHeight,
                            },
                        ]}
                    >
                        <View
                            {...panResponder.panHandlers}
                            style={styles.triggerBar}
                        >
                            <View style={styles.triggerBarIndicator} />
                            <View style={{height: 1, width: '100%', backgroundColor: '#aaa'}} />
                        </View>
                        <ScrollView>

                        <View style={styles.menuContent}>

                            <View style={styles.buttonGroup}>
                                {modes.map((mode) => (
                                    <TouchableOpacity
                                        key={mode.key}
                                        style={[
                                            styles.transportButton,
                                            selectedMode === mode.key && styles.selectedButton, // Highlight selected button
                                        ]}
                                        onPress={() => setSelectedMode(mode.key)}
                                    >

                                        <Image source={mode.icon} style={{ width: 24, height: 24 }} />
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                selectedMode === mode.key && styles.selectedButtonText,
                                            ]}
                                        >
                                            {mode.label}
                                        </Text>
                                    </TouchableOpacity>
                                    
                                ))}
                            </View>
                            <View style={{width: width, paddingHorizontal:20, paddingBottom: 10}}>
                                    <Text style={{color: 'black', textAlign: 'center', width: '100%'}}>You're {parseFloat(distance).toFixed(2)} kms away</Text>
                                </View>
                                <View style={{ height: 150, width: 200, backgroundColor: '#e5e5e5', borderRadius: 10, justifyContent: 'space-between', alignItems: 'center', padding:15 }}>
                                    <Text style={{fontSize: 10, color: 'black', textAlign: 'left', width: '100%'}}>By {selectedMode}</Text>
                                    <Text style={{fontSize: 32, color: 'black'}}>{formatTime()}</Text>
                                    <Text style={{fontSize: 10, color: 'black', textAlign: 'right', width: '100%'}}>Untill You reach your destination</Text>
                                </View>
                        </View>
                        </ScrollView>
                            <TouchableOpacity
                                style={{ backgroundColor: 'blue', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5, marginBottom: 20, bottom: 15, position: 'relative', zIndex: 10, width: '90%', alignSelf: 'center' }}
                                onPress={() => {
                                    setIsMenuVisible(false);
                                    removeDestination()
                                }}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Remove Destination</Text>
                            </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

export default DestinationButton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 0,
    },
    closeButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 30,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeButtonText: {
        color: 'white',
    },
    bottomMenu: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        width: width
    },
    menuContent: {
        flex: 1,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
    },
    triggerBar: {
        alignItems: 'center',
        padding: 15,
        // backgroundColor: '#e0e0e0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        gap: 15,
    },
    triggerBarIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#aaa',
        borderRadius: 5,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        gap: 8
    },
    transportButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70, 
        height: 70, 
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
    selectedButton: {
        backgroundColor: '#007bff',
    },
    buttonText: {
        marginTop: 5,
        color: '#000000',
        fontSize: 10,
    },
    selectedButtonText: {
        color: '#ffffff',
    },
});
