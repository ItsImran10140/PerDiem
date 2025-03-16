import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Image } from 'react-native';

interface BottomSheetProps {
    details: {
        name: string;
        stats: Array<{
            base_stat: number;
            stat: {
                name: string;
            }
        }>;
        sprites: {
            front_default: string;
            other: {
                'official-artwork': {
                    front_default: string;
                }
            }
        };
        height: number;
  weight: number;
  types: Array<{
    type: {
      name: string;
    }
  }>;
    };
    setStatus: (status: boolean) => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ details, setStatus }) => {
    const slide = React.useRef(new Animated.Value(300)).current;

    const slideUp = () => {
        Animated.timing(slide, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };

    const slideDown = () => {
        Animated.timing(slide, {
            toValue: 300,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        slideUp();
    }, []);

    const closeModel = () => {
        slideDown();
        setTimeout(() => {
            setStatus(false);
        }, 800);
    };


    return (
        <Pressable onPress={closeModel} style={styles.backdrop}>
            <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>
                <View style={styles.header}>
                    <Text style={styles.title}>{details.name} Stats</Text>
                </View>
                <View style={styles.imageWraperContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{
                                uri: details.sprites.other['official-artwork'].front_default || details.sprites.front_default
                            }}
                            style={styles.pokemonImage}
                        />
                    </View>
                    <View style={styles.pokemonDetails}>
                        <View style={styles.detailsTextWraper}>

                    <View style={{flexDirection: 'column'}}>
                    <Text style={styles.infoLabel}>Height</Text>
                    <Text style={styles.infoValue}>{details.height / 10} m</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                    <Text style={styles.infoLabel}>Weight</Text>
          <Text style={styles.infoValue}>{details.weight / 10} kg</Text>
                    </View>

                   
                        </View>

                        <View style={styles.pokemonDetails}>
                   <View style={styles.typesContainer}>
        {details.types.map((typeInfo, index) => (
          <View 
            key={index} 
            style={[
              styles.typeTag, 
              { backgroundColor: "#CB9DF0" }
            ]}
          >
            <Text style={styles.typeText}>{typeInfo.type.name}</Text>
          </View>
        ))}
      </View>
                   </View>
                    </View>
                </View>
                <View style={styles.statsContainer}>
                    {details.stats.map((stat, index) => (
                        <View key={index} style={styles.statItem}>
                            <Text style={styles.statName}>
                                {stat.stat.name.replace('-', ' ')}:
                            </Text>
                            <Text style={styles.statValue}>{stat.base_stat}</Text>
                            <View style={styles.statBar}>
                                <View
                                    style={[
                                        styles.statFill,
                                        { width: `${(stat.base_stat / 255) * 100}%` }
                                    ]}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </Animated.View>
        </Pressable>
    );
};

export default BottomSheet;

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        flex: 1,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        width: '100%',
        height: 400,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    header: {
        marginBottom: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textTransform: 'capitalize',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 10,
        width: 150,
        height: '100%'
    },
    pokemonImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    statsContainer: {
        flex: 1,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statName: {
        width: 100,
        fontSize: 14,
        color: '#666',
        textTransform: 'capitalize',
    },
    statValue: {
        width: 40,
        fontSize: 14,
        color: '#333',
        marginRight: 10,
    },
    statBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
    statFill: {
        height: '100%',
        backgroundColor: '#9B7EBD',
        borderRadius: 4,
    },
    imageWraperContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    pokemonDetails:{
        alignItems: 'center',
        width: 160
    },
    infoValue:{
        textTransform: 'capitalize',
        fontSize: 12,
        color: '#666',
    },
    infoLabel:{
        fontSize: 13,
        fontWeight: 'bold',
    },
    detailsTextWraper:{
        width: 150,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    typesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
      },
      typeTag: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        marginHorizontal: 5,
      },
      typeText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'capitalize',
      },
});
