import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Home from '../../app/screens/Home';
import { NavigationProp } from '@react-navigation/native';
import { TabProvider } from '../../app/context/TabContext';
import useGetPokemon from '../../app/hooks/useGetPokemon';


jest.mock('../../app/hooks/useGetPokemon', () => jest.fn());


jest.mock('../../app/components/TabBar', () => {
  const MockedTabBar = () => null;
  return MockedTabBar;
});

jest.mock('../../app/context/TabContext', () => ({
  TabProvider: ({ children }: { children: React.ReactNode }) => children,
  useTabContext: () => ({
    activeTab: 'Catch',
    setActiveTab: jest.fn(),
  }),
}));

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
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
    }
  }))
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as unknown as NavigationProp<any, any>;

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when data is loading', () => {

    (useGetPokemon as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn(),
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    const { getByTestId } = render(
      <TabProvider>
        <Home navigation={mockNavigation} />
      </TabProvider>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders pokemon list when data is loaded', async () => {

    jest.setTimeout(10000);

    const mockPokemonData = {
      pages: [
        {
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
          ]
        }
      ]
    };

    (useGetPokemon as jest.Mock).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      refetch: jest.fn(),
      hasNextPage: true,
      fetchNextPage: jest.fn(),
    });

    const { getByTestId } = render(
      <TabProvider>
        <Home navigation={mockNavigation} />
      </TabProvider>
    );

    await waitFor(() => {
      expect(getByTestId('pokemon-list')).toBeTruthy();
    });
  });

  it('calls fetchNextPage when reaching the end of the list', () => {
    const mockFetchNextPage = jest.fn();

    const mockPokemonData = {
      pages: [
        {
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
          ]
        }
      ]
    };

    (useGetPokemon as jest.Mock).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      refetch: jest.fn(),
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
    });

    const { getByTestId } = render(
      <TabProvider>
        <Home navigation={mockNavigation} />
      </TabProvider>
    );

    const flatList = getByTestId('pokemon-list');
    fireEvent(flatList, 'onEndReached');

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('does not call fetchNextPage when hasNextPage is false', () => {
    const mockFetchNextPage = jest.fn();

    const mockPokemonData = {
      pages: [
        {
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
          ]
        }
      ]
    };

    (useGetPokemon as jest.Mock).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      refetch: jest.fn(),
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });

    const { getByTestId } = render(
      <TabProvider>
        <Home navigation={mockNavigation} />
      </TabProvider>
    );


    const flatList = getByTestId('pokemon-list');
    fireEvent(flatList, 'onEndReached');

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it('has the correct styling', () => {
    const mockPokemonData = {
      pages: [
        {
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
          ]
        }
      ]
    };

    (useGetPokemon as jest.Mock).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      refetch: jest.fn(),
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    const { toJSON } = render(
      <TabProvider>
        <Home navigation={mockNavigation} />
      </TabProvider>
    );

    const tree = toJSON();

    expect(tree.props.style).toEqual(expect.objectContaining({
      flex: 1,
      backgroundColor: "#C8ACD6",
      position: 'relative',
    }));
  });

  it('renders with the correct structure', () => {
    const mockPokemonData = {
      pages: [
        {
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
          ]
        }
      ]
    };

    (useGetPokemon as jest.Mock).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      refetch: jest.fn(),
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    const { toJSON } = render(
      <TabProvider>
        <Home navigation={mockNavigation} />
      </TabProvider>
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();
    expect(tree.type).toBe('View');
    expect(tree.children).toBeTruthy();
  });
}); 