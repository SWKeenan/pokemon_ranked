import Layout from '../../components/Layout/Layout';
import styles from './Pokemon.module.css';
import Link from 'next/link';

const getPokemon = async (id) => {

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
   
    const pokemon = await res.json();

    return pokemon;
}

const getEvolution = async (id) => {

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
   
    const evolve = await res.json();
    const evo = await evolve.['evolution_chain'].url
    const res2 = await fetch(evo)
    const ev = await res2.json();
    var evoChain = [];
    var evoData = ev.chain;

    do {
    var evoDetails = evoData['evolution_details'][0];

    evoChain.push({
        "species_name": evoData.species.name,
        "species_id": evoData.species.url.replace("https://pokeapi.co/api/v2/pokemon-species/", ""),
        "min_level": !evoDetails ? 1 : evoDetails.min_level,
    });

    evoData = evoData['evolves_to'][0];
    } while (!!evoData && evoData.hasOwnProperty('evolves_to'));


    return evoChain;
}

const Pokemon = ({ pokemon, otherPokemon, pokeflavour, evolution }) => {

    let flavouredText = pokeflavour.['flavor_text_entries'].filter( 
        eachObj => eachObj.language.name === 'en');

    return  (
    <Layout title={pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}>
        <div className={styles.container}>
            <div className={styles.container_left}>
                <div className={styles.overview_panel}>
                    <img src={pokemon.sprites.other.['official-artwork'].front_default} alt={pokemon.name}></img>
                    <h1 className={styles.overview_name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
                    {pokemon.types.map(type=>{
                    return(
                        <div className={styles.overview_types}>
                            <div className={styles.overview_value}>{type.type.name}</div>
                        </div>
                        )})}
                
                    <div className={styles.overview_overviewstats}>
                        {pokemon.stats.map(stat=>{
                        return(
                            <div className={styles.overview_stats}>
                                <div className={styles.overview_value}>{stat.base_stat}</div>
                                <div className={styles.overview_label}>{stat.stat.name}</div>
                            </div>
                        )})}
                    </div>
                </div> 
            </div>
            <div className={styles.container_right}>
                <div className={styles.details_panel}>
                    <h4 className={styles.details_panel_heading}>Details</h4>

                    <div className={styles.details_panel_row}>
                        <div className={styles.details_panel_label}>Description</div>
                        <div className={styles.details_panel_value}>{flavouredText[Math.floor(Math.random() * flavouredText.length)].['flavor_text'].replace(/(\r\n|\n|\f|\f|\r)/gm, " ")}</div>
                    </div>

                    <div className={styles.details_panel_row}>
                        <div className={styles.details_panel_label}>Height</div>
                        <div className={styles.details_panel_value}>{pokemon.height * 10} cm / {(pokemon.height / 3.048).toFixed(2)} ft</div>
                    </div>

                    <div className={styles.details_panel_row}>
                        <div className={styles.details_panel_label}>Weight</div>
                        <div className={styles.details_panel_value}>{(pokemon.weight / 4.536 ).toFixed(2)} lbs / {(pokemon.weight / 63.503).toFixed(2)} st.</div>
                    </div>

                    <div className={styles.details_panel_row}>
                        <div className={styles.details_panel_label}>Evolution</div>
                        <div className={styles.details_panel_row_evolve}>
                            {evolution.length > 1 ?
                                (evolution.map((evolve, index)=>
                                    <Link href={`/pokemon/${evolve.species_id}/`}>
                                            <a><div className={styles.details_panel_value}><div className={styles.details_panel_value}>
                                                {evolve.species_name.charAt(0).toUpperCase() + evolve.species_name.slice(1)}
                                            </div>
                                            {
                                                evolution.length-1===index ?
                                                '' : (<div className={styles.details_panel_value}>
                                                    &#62;
                                                    </div>)
                                            }
                                            </div></a>
                                    </Link>))  : 'N/A'
                            }
                            
                        </div>
                    </div>

                    <div className={styles.details_panel_otherPokemon}>
                    <div className={styles.details_panel_otherPokemon_label}>Other Pokemon</div>

                    <div className={styles.details_panel_otherPokemon_container}>
                        {otherPokemon.map((pokemon)=>
                        <Link href={`/pokemon/${pokemon.id}/`}>
                            <div className={styles.details_panel_otherPokemon_image}>
                                <img src={pokemon.bigImage} alt={pokemon.name}></img> 
                                <div className={styles.details_panel_otherPokemon_name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
                            </div>
                        </Link>)}
                        </div> 
                    </div>
                </div>
            </div>
        </div>      
    </Layout>
     );
};
 
export default Pokemon;

export const getServerSideProps = async ({params}) =>{

    const pokemon = await getPokemon(params.id);
    const evolution = await getEvolution(params.id);
    const promises = [];
    const otherPokemon = [];
    for(let i = 0; i < 8; i++){
        promises.push(getPokemon(Math.floor(Math.random() * 898) + 1));
      }
      await Promise.all(promises).then((results) =>{
        const poke = results.map( (data) => ({
                name: data.name,
                id: data.id,
                bigImage: data.sprites.other.['official-artwork'].front_default,
                smallImage: data.sprites['front_default'],
                type: data.types.map(type => type.type.name).join(', ')
              }))
              otherPokemon.push(poke)
      })

    const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${params.id}/`)    
    const pokeflavour = await res2.json();

    return {
        props: {
            pokemon,
            otherPokemon: otherPokemon.flat(),
            pokeflavour,
            evolution,
        },
    }
}