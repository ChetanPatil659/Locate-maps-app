import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { usePlaces } from '../context/locationContext';

interface LocationItem {
    description: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

const Locations: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { places, setDestination } = usePlaces();

    // Render each item in the FlatList
    const renderItem = ({ item }: { item: LocationItem }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
                setDestination({
                    latitude: item.geometry.location.lat,
                    longitude: item.geometry.location.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                navigation.navigate('Home');
            }}
        >
            <Text style={styles.description}>{item.description}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.menuIconContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuIconContainer}>
                    <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
                </TouchableOpacity>
                <Text style={styles.title}>My Saved Locations</Text>
            </View>
            <FlatList
                data={places}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    menuIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    menuIcon: {
        width: 30,
        height: 30,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: -30,
    },
    list: {
        flexGrow: 1,
    },
    listItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3, // for Android shadow
    },
    description: {
        fontSize: 12,
        color: '#333',
    },
});

export default Locations;
