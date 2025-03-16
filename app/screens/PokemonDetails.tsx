/* eslint-disable prettier/prettier */
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import BottomSheet from 'app/components/BottomSheet';



type RootStackParamList = {
  PokemonDetails: { url: string; name: string };
};

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<RootStackParamList, 'PokemonDetails'>;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
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
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    }
  }>;
  moves: Array<{
    move: {
      name: string;
    }
  }>;
  species: {
    url: string;
  };
}

interface SpeciesData {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    }
  }>;
  color: {
    name: string;
  };
  habitat: {
    name: string;
  } | null;
  generation: {
    name: string;
  };
}

const PokemonDetails = ({ navigation, route }: RouterProps) => {
  const { url, name } = route?.params || { url: '', name: '' };
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [species, setSpecies] = useState<SpeciesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatsSheet, setShowStatsSheet] = useState(false);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!url) {
        setError('No Pokemon URL provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data } = await axios.get(url);
        setDetails(data);
        
        if (data.species && data.species.url) {
          const speciesResponse = await axios.get(data.species.url);
          setSpecies(speciesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching Pokemon details:', err);
        setError('Failed to load Pokemon details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [url]);

  const getEnglishDescription = () => {
    if (!species) return 'No description available';
    
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    
    return englishEntry 
      ? englishEntry.flavor_text.replace(/\f/g, ' ') 
      : 'No English description available';
  };


  const handleImagePress = () => {
    setStatus(true);
    if (details) {
      setShowStatsSheet(true);
    }
  };

 

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C8ACD6" />
      </View>
    );
  }

  if (error || !details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Failed to load Pokemon details'}</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  


  return (
    <>
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.pokemonId}>{details.id.toString()}</Text>
        <Text style={styles.pokemonName}>{details.name}</Text>
      </View>

      <View style={styles.imageContainer}>
        <TouchableOpacity 
          onPress={handleImagePress}
          style={styles.touchableImage}
          activeOpacity={0.7}
        >
          <Image 
            source={{ 
              uri: details.sprites.other['official-artwork'].front_default || details.sprites.front_default 
            }} 
            style={styles.image} 
          />
          <View style={styles.viewStatsButton}>
            <Text style={styles.viewStatsText}>View Stats</Text>
          </View>
        </TouchableOpacity>
      </View>

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

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{getEnglishDescription()}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Height</Text>
          <Text style={styles.infoValue}>{details.height / 10} m</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Weight</Text>
          <Text style={styles.infoValue}>{details.weight / 10} kg</Text>
        </View>
        {species?.habitat && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Habitat</Text>
            <Text style={styles.infoValue}>{species.habitat.name}</Text>
          </View>
        )}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Generation</Text>
          <Text style={styles.infoValue}>{species?.generation?.name || 'Unknown'}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Abilities</Text>
        <View style={styles.abilitiesContainer}>
          {details.abilities.map((abilityInfo, index) => (
            <View key={index} style={styles.abilityItem}>
              <Text style={styles.abilityName}>{abilityInfo.ability.name}</Text>
              {abilityInfo.is_hidden && (
                <Text style={styles.hiddenAbility}>(Hidden)</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Sprites</Text>
        <ScrollView 
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 10 }}
          style={styles.spritesContainer}
        >
          {details.sprites.front_default && (
            <View style={styles.spriteContainer}>
              <Image 
                source={{ uri: details.sprites.front_default }} 
                style={styles.sprite} 
              />
              <Text style={styles.spriteLabel}>Front</Text>
            </View>
          )}
          {details.sprites.back_default && (
            <View style={styles.spriteContainer}>
              <Image 
                source={{ uri: details.sprites.back_default }} 
                style={styles.sprite} 
              />
              <Text style={styles.spriteLabel}>Back</Text>
            </View>
          )}
          {details.sprites.front_shiny && (
            <View style={styles.spriteContainer}>
              <Image 
                source={{ uri: details.sprites.front_shiny }} 
                style={styles.sprite} 
              />
              <Text style={styles.spriteLabel}>Shiny Front</Text>
            </View>
          )}
          {details.sprites.back_shiny && (
            <View style={styles.spriteContainer}>
              <Image 
                source={{ uri: details.sprites.back_shiny }} 
                style={styles.sprite} 
              />
              <Text style={styles.spriteLabel}>Shiny Back</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={[styles.sectionContainer, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Moves</Text>
        <View style={styles.movesContainer}>
          {details.moves.slice(0, 20).map((moveInfo, index) => (
            <View key={index} style={styles.moveItem}>
              <Text style={styles.moveName}>{moveInfo.move.name}</Text>
            </View>
          ))}
          {details.moves.length > 20 && (
            <Text style={styles.moreMovesText}>
              +{details.moves.length - 20} more moves
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
     {status &&  <BottomSheet details={details} setStatus={setStatus} />}
      </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pokemonId: {
    fontSize: 16,
    color: '#666',
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  touchableImage: {
    position: 'relative',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C8ACD6',
    backgroundColor: 'rgba(200, 172, 214, 0.1)',
  },
  viewStatsButton: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewStatsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
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
  descriptionContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  infoItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  sectionContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  lastSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  abilitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  abilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  abilityName: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  hiddenAbility: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    fontStyle: 'italic',
  },
  spritesContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  spriteContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  sprite: {
    width: 150,
    height: 150,
  },
  spriteLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  movesContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moveItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  moveName: {
    textTransform: 'capitalize',
  },
  moreMovesText: {
    width: '100%',
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  
});

export default PokemonDetails; 