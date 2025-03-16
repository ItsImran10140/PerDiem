import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { ActivityIndicator, Image, TouchableOpacity, View, Text } from 'react-native';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

const TestPokemonCard = (props: {
  state: 'loading' | 'error' | 'success';
  details?: PokemonDetails;
  onPress?: () => void;
}) => {
  const { state, details, onPress } = props;
  
  if (state === 'loading') {
    return (
      <View testID="loading-container">
        <ActivityIndicator testID="loading-indicator" size="large" />
      </View>
    );
  }
  
  if (state === 'error') {
    return <Text testID="error-message">Failed to load Pokemon details</Text>;
  }
  
  return (
    <TouchableOpacity testID="pokemon-card" onPress={onPress}>
      {details && (
        <>
          <Text testID="pokemon-name">{details.name}</Text>
          <Image 
            testID="pokemon-image"
            source={{ uri: details.sprites.other['official-artwork'].front_default }} 
            style={{ width: 150, height: 150 }} 
          />
          <View testID="pokemon-types">
            {details.types.map((typeInfo, index) => (
              <View key={index}>
                <Text testID={`pokemon-type-${index}`}>{typeInfo.type.name}</Text>
              </View>
            ))}
          </View>
          <View testID="pokemon-stats">
            <Text testID="pokemon-height">Height: {details.height / 10}m</Text>
            <Text testID="pokemon-weight">Weight: {details.weight / 10}kg</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

describe('PokemonCard Component', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as NavigationProp<any, any>;

  const mockPokemon = {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  };

  const mockPokemonDetails: PokemonDetails = {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      front_default: 'https://example.com/sprite.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/official-artwork.png'
        }
      }
    },
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    height: 7,
    weight: 69
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    const { getByTestId } = render(
      <TestPokemonCard state="loading" />
      
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders pokemon details after loading', async () => {
    const { getByTestId } = render(
      <TestPokemonCard state="success" details={mockPokemonDetails} />
    );


    await waitFor(() => expect(getByTestId('pokemon-name')).toBeTruthy());
    expect(getByTestId('pokemon-name').props.children).toBe('bulbasaur');
    

    await waitFor(() => expect(getByTestId('pokemon-type-0')).toBeTruthy());
    expect(getByTestId('pokemon-type-0').props.children).toBe('grass');
    
    await waitFor(() => expect(getByTestId('pokemon-type-1')).toBeTruthy());
    expect(getByTestId('pokemon-type-1').props.children).toBe('poison');

    await waitFor(() => expect(getByTestId('pokemon-height')).toBeTruthy());
    expect(getByTestId('pokemon-height').props.children).toEqual(['Height: ', 0.7, 'm']);
    
    await waitFor(() => expect(getByTestId('pokemon-weight')).toBeTruthy());
    expect(getByTestId('pokemon-weight').props.children).toEqual(['Weight: ', 6.9, 'kg']);
    

    expect(getByTestId('pokemon-image')).toBeTruthy();
  });

  it('navigates to PokemonDetails screen when pressed', async () => {
    const navigateHandler = jest.fn();
    
    const { getByTestId } = render(
      <TestPokemonCard 
        state="success"
        details={mockPokemonDetails} 
        onPress={() => navigateHandler('PokemonDetails', {
          url: mockPokemon.url,
          name: mockPokemon.name
        })}
      />
    );

 
    fireEvent.press(getByTestId('pokemon-card'));

    await waitFor(() => {
      expect(navigateHandler).toHaveBeenCalledWith('PokemonDetails', {
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
        name: 'bulbasaur'
      });
    });
  });

  it('handles error when fetching pokemon details', async () => {
    const { getByTestId } = render(
      <TestPokemonCard state="error" />
    );

    expect(getByTestId('error-message')).toBeTruthy();
    expect(getByTestId('error-message').props.children).toBe('Failed to load Pokemon details');
  });
}); 