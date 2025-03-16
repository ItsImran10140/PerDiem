/* eslint-disable prettier/prettier */
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

const useGetPokemon = () => {
  const fetchPokemon = async ({ pageParam = 0 }) => {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10&', {
      params: {
        offset: pageParam,
      },
    });
    return data;
  };
  
  return useInfiniteQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: fetchPokemon,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      const offset = new URLSearchParams(new URL(lastPage.next).search).get('offset');
      return offset ? parseInt(offset) : undefined;
    },
    staleTime: 1000 * 60 * 60, 
    cacheTime: 1000 * 60 * 60 * 24, 
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export default useGetPokemon;


