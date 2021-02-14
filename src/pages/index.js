import Head from 'next/head'
import { useState } from 'react';
import Layout from '../components/Layout/Layout'
import PokemonTable from '../components/PokemonTable/PokemonTable';
import SearchInput from '../components/SearchInput/SearchInput';
import styles from '../styles/Home.module.css'

export default function Home({pokemon}) {

  // const getWinners = () =>{
  //   var data = [...pokemon]
  //   var top5Attack = data.sort(function(a, b) { return a.attack < b.attack ? 1 : -1; })
  //               .slice(0, 5);
  //   top5Attack.map((winner, index) =>{
  //     index = index + 1;
  //     let poke = pokemon.find(x => x.id === winner.id);
  //     poke.attackPosition = index;
  //   })
  //   var data = [...pokemon]
  //   var top5Defense = data.sort(function(a, b) { return a.defense < b.defense ? 1 : -1; })
  //               .slice(0, 5);
  //   top5Defense.map((winner, index) =>{
  //     index = index + 1;
  //     let poke = pokemon.find(x => x.id === winner.id);
  //     poke.defensePosition = index;
  //   })
  //   var data = [...pokemon]
  //   var top5HP = data.sort(function(a, b) { return a.hp < b.hp ? 1 : -1; })
  //               .slice(0, 5);
  //   top5HP.map((winner, index) =>{
  //     index = index + 1;
  //     let poke = pokemon.find(x => x.id === winner.id);
  //     poke.hpPosition = index;
  //   })
  //   var data = [...pokemon]
  //   var top5Speed = data.sort(function(a, b) { return a.speed < b.speed ? 1 : -1; })
  //               .slice(0, 5);
  //   top5Speed.map((winner, index) =>{
  //     index = index + 1;
  //     let poke = pokemon.find(x => x.id === winner.id);
  //     poke.speedPosition = index;
  //   })
  //   var data = [...pokemon]
  //   var top5SpecialAttack = data.sort(function(a, b) { return a.['special-attack'] < b.['special-attack'] ? 1 : -1; })
  //               .slice(0, 5);
  //   top5SpecialAttack.map((winner, index) =>{
  //     index = index + 1;
  //     let poke = pokemon.find(x => x.id === winner.id);
  //     poke.specialAttackPosition = index;
  //   })
  //   var data = [...pokemon]
  //   var top5SpecialDefense = data.sort(function(a, b) { return a.['special-defense'] < b.['special-defense'] ? 1 : -1; })
  //               .slice(0, 5);
  //   top5SpecialDefense.map((winner, index) =>{
  //     index = index + 1;
  //     let poke = pokemon.find(x => x.id === winner.id);
  //     poke.specialDefensePosition = index;
  //   })
  //   // var data = [...pokemon]
  //   // var data = data.filter(pokeman => pokeman.type.includes('fire'))
  //   // var top5SpecialDefenseFire = data.sort(function(a, b) { return a.['special-defense'] < b.['special-defense'] ? 1 : -1; })
  //   //             .slice(0, 5);
  //   // top5SpecialDefenseFire.map((winner, index) =>{
  //   //   index = index + 1;
  //   //   let poke = pokemon.find(x => x.id === winner.id);
  //   //   poke.specialDefensePositionFire = index;
  //   // })
  // }

  const [keyword, setKeyword] = useState('')

  const filteredPokemon = pokemon.filter(
    pokeman => 
    pokeman.name.toLowerCase().includes(keyword))

  const onInputChange = (e) =>{
    e.preventDefault();

    setKeyword(e.target.value.toLowerCase());
  }
  // getWinners();

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
            points: data.stats.reduce(function(tot, arr) { 
              return tot + arr.base_stat;            
            },0),
            hp: parseInt(data.stats.map(stat => (stat.stat.name==='hp') ? stat.base_stat : '').join('')),
            attack: parseInt(data.stats.map(stat => (stat.stat.name==='attack') ? stat.base_stat : '').join('')),
            defense: parseInt(data.stats.map(stat => (stat.stat.name==='defense') ? stat.base_stat : '').join('')),
            ['special-attack']: parseInt(data.stats.map(stat => (stat.stat.name==='special-attack') ? stat.base_stat : '').join('')),
            ['special-defense']: parseInt(data.stats.map(stat => (stat.stat.name==='special-defense') ? stat.base_stat : '').join('')),
            speed: parseInt(data.stats.map(stat => (stat.stat.name==='speed') ? stat.base_stat : '').join('')),
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