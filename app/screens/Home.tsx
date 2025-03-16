/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { NavigationProp } from '@react-navigation/native';
import useGetPokemon from 'app/hooks/useGetPokemon';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, FlatList, View, Image,  ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';



interface RouterProps {
  navigation: NavigationProp<any, any>;
}


interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  types: Array<{
    type: {
      name: string;
    }
  }>;
  height: number;
  weight: number;
}

interface PokemonListItem {
  name: string;
  url: string;
  details?: PokemonDetails;
  isLoading?: boolean;
}

const PokemonCard = ({ pokemon, navigation }: { pokemon: PokemonListItem; navigation: NavigationProp<any, any> }) => {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(pokemon.url);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [pokemon.url]);

  const handlePress = () => {
    navigation.navigate('PokemonDetails', {
      url: pokemon.url,
      name: pokemon.name
    });
  };

  if (isLoading) {
    return (
      <View style={styles.cardLoadingContainer}>
        <ActivityIndicator size="large" color="#C8ACD6" />
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.loadingContainer}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {details ? (
        <>
          <Text style={styles.pokemonName}>
            {details.name}
          </Text>
          
          {details.sprites.other['official-artwork'].front_default && (
            <Image 
              source={{ uri: details.sprites.other['official-artwork'].front_default }} 
              style={styles.pokemonImage} 
              resizeMode="contain"
            />
          )}
          
          <View style={styles.typesContainer}>
            {details.types.map((typeInfo, index) => (
              <View 
                key={index} 
                style={styles.typeWrapper}
              >
                <Text style={styles.typeText}>{typeInfo.type.name}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Height: {details.height / 10}m</Text>
            <Text style={styles.statText}>Weight: {details.weight / 10}kg</Text>
          </View>
        </>
      ) : (
        <Text>Failed to load Pokemon details</Text>
      )}
    </TouchableOpacity>
  );
};

const Home = ({ navigation }: RouterProps) => {
  const { data, isLoading, hasNextPage, fetchNextPage } = useGetPokemon();

  const dataArr = data?.pages?.map((page) => page).flat();

  const onReachEnd = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const keyExtractor = (_: any, index: number) => index.toString();

  const renderItem = ({ item }: { item: any }) => {
    const { results } = item;

    return (
      <View style={styles.resultsContainer}>
        {results.map((pokemon: PokemonListItem, index: number) => (
          <PokemonCard key={index} pokemon={pokemon} navigation={navigation} />
        ))}
      </View>
    );
  };

  if (isLoading && (!dataArr || dataArr.length === 0)) {
    return (
      <View style={styles.fullScreenLoading}>
        <ActivityIndicator testID="loading-indicator" size="large" color="#C8ACD6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        testID="pokemon-list"
        data={dataArr}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onReachEnd}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.tabBarContainer}>
        <TabBar navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C8ACD6",
    position: 'relative',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  loadingContainer: {
    backgroundColor: "#e9e1f8",
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c6c4fa',
    height: 350,
    paddingBottom: 10,
    width: '90%',
    elevation: 5,
    marginVertical: 10,
    borderRadius: 25,
    padding: 10,
  },
  cardLoadingContainer: {
    backgroundColor: "#e9e1f8",
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c6c4fa',
    height: 350,
    paddingBottom: 10,
    width: '90%',
    elevation: 5,
    marginVertical: 10,
    borderRadius: 25,
    padding: 10,
  },
  pokemonName: {
    fontSize: 20, 
    fontWeight: 'bold', 
    textTransform: 'capitalize'
  },
  pokemonImage: {
    width: 150, 
    height: 150
  },
  typesContainer: {
    flexDirection: 'row', 
    marginTop: 5
  },
  typeWrapper: {
    backgroundColor: '#e9e1f8', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 20,
    marginHorizontal: 5
  },
  typeText: {
    color: "black", 
    fontSize: 13, 
    textTransform: 'capitalize', 
    borderWidth: 1, 
    borderColor: "#FFE6C9", 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 15, 
    backgroundColor: "#FFE6C9", 
    textAlign: 'center', 
    width: 105,
    elevation: 5
  },
  statsContainer: {
    flexDirection: 'row', 
    marginTop: 10, 
    justifyContent: 'space-between', 
    width: '80%'
  },
  statText: {
    color: "black", 
    fontSize: 13, 
    fontWeight: "semibold", 
    borderWidth: 1,
    paddingHorizontal: 10, 
    borderColor: "#FFE6C9",
    paddingVertical: 5, 
    borderRadius: 15, 
    backgroundColor: "#FFE6C9", 
    elevation: 5
  },
  fullScreenLoading: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  flatListContent: {
    paddingVertical: 10, 
    paddingBottom: 100
  },
  resultsContainer: {
    alignItems: 'center', 
    width: '100%'
  }
});

export default Home;
