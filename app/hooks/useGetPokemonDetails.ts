/* eslint-disable prettier/prettier */
import axios from 'axios';
import { useQuery } from 'react-query';

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

const fetchPokemonDetails = async (url: string): Promise<PokemonDetails> => {
  const { data } = await axios.get(url);
  return data;
};

const useGetPokemonDetails = (url: string) => {
  return useQuery(
    ['pokemon', 'details', url],
    () => fetchPokemonDetails(url),
    {
      staleTime: 1000 * 60 * 60, 
      cacheTime: 1000 * 60 * 60 * 24, 
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: !!url,
    }
  );
};

export default useGetPokemonDetails;


