import Head from 'next/head'
import { useState } from 'react';
import Layout from '../components/Layout/Layout'
import PokemonTable from '../components/PokemonTable/PokemonTable';
import SearchInput from '../components/SearchInput/SearchInput';
import styles from '../styles/Home.module.css'

export default function Home({pokemon}) {

  const [keyword, setKeyword] = useState('')

  const filteredPokemon = pokemon.filter(
    pokeman => 
    pokeman.name.toLowerCase().includes(keyword))

  const onInputChange = (e) =>{
    e.preventDefault();

    setKeyword(e.target.value.toLowerCase());
  }

  return (
    <Layout>
      <div className={styles.inputContainer}>
        <div className={styles.counts}> Found {filteredPokemon.length} pokemon</div>

        <div className={styles.input}>
          <SearchInput placeholder="Filter by Pokemon's Name" onChange={onInputChange} />
        </div>

      </div>
      <PokemonTable pokemon={filteredPokemon} />
    </Layout>
  )
}

export const getStaticProps = async () =>{
  const promises = []
  const pokemon = []
  for(let i =1; i < 899; i++){
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }
  await Promise.all(promises).then((results) =>{
    const poke = results.map( (data) => ({
            name: data.name,
            id: data.id,
            height: data.height,
            smallImage: data.sprites['front_default'],
            type: data.types.map(type => type.type.name).join(', ')
          }))
          pokemon.push(poke)
  })
  return{
    props: {
      pokemon: pokemon.flat(),
    }
  }

}