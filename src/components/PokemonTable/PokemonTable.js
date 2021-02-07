import { KeyboardArrowDownRounded, KeyboardArrowUpRounded } from '@material-ui/icons';
import styles from './PokemonTable.module.css';
import {useState} from 'react';
import Link from 'next/link';

const orderBy = (pokemon, value, direction) => {
    if( direction === 'asc' ){
        return [...pokemon].sort((a,b) => ( a[value] > b[value] ? 1 : -1));
    }
    if (direction === 'desc'){
        return [...pokemon].sort((a,b) => ( a[value] > b[value] ? -1 : 1));
    }

    return pokemon;
}

const SortArrow = ({direction}) => {
    if(!direction){
        return <></>
    }
    if(direction==='desc'){
        return(
            <div className={styles.heading_arrow}>
                <KeyboardArrowDownRounded color="inherit" />
            </div>
        )
    } else {
        return(
            <div className={styles.heading_arrow}>
                <KeyboardArrowUpRounded color="inherit" />
            </div>
        )
    }
}

const PokemonTable = ({pokemon}) => {
    const [direction, setDirection] = useState();
    const [value, setValue] = useState();
    const orderedPokemon = orderBy(pokemon, value, direction)
    const switchDirection = () =>{
        if(!direction){
            setDirection('desc');
        } else if (direction==='desc'){
            setDirection('asc')
        } else {
            setDirection(null)
        }
    }

    const setValueAndDirection = (value) => {
        switchDirection();
        setValue(value);
    }

    return ( 
        <div>
            <div className={styles.heading}>

                <div className={styles.heading_flag}></div>
                <button className={styles.heading_name} onClick={() => setValueAndDirection('name')}>
                    <div>Name</div>
                    
                    {value==='name' && <SortArrow direction={direction} /> }
                </button>
                
                <button className={styles.heading_id} onClick={() => setValueAndDirection('id')}>
                    <div>ID</div>
                    
                    {value==='id' && <SortArrow direction={direction} /> }
                </button>

                <button className={styles.heading_height} onClick={() => setValueAndDirection('height')}>
                    <div>Height (ft)</div>
                    
                    {value==='height' && <SortArrow direction={direction} /> }
                </button>

                <button className={styles.heading_type} onClick={() => setValueAndDirection('type')}>
                    <div>Type</div>
                    
                    {value==='type' && <SortArrow direction={direction} /> }
                </button>
            </div>

            {orderedPokemon.map((pokeman) => (
            <Link href={`/pokemon/${pokeman.id}`} key={pokeman.name}><a>
            <div className={styles.row}>
                <div className={styles.flag}>
                    <img src={pokeman.smallImage} alt={pokeman.name} />
                </div>
                <div className={styles.name}>{pokeman.name.charAt(0).toUpperCase() + pokeman.name.slice(1)}</div>
                <div className={styles.id}>{pokeman.id}</div>
                <div className={styles.height}>{(pokeman.height / 3.048).toFixed(2)}</div>
                <div className={styles.type}>{pokeman.type}</div>
            </div>
            </a></Link>))}
        </div>
     );
}
 
export default PokemonTable;