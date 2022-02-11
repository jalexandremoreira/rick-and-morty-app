import React from 'react';
import Image from 'next/image';

import styles from '../styles/CharacterCard.module.css';
import { Character } from '../types/character';

type Props = {
  character: Character;
};

function CharacterCard({ character }: Props) {
  return (
    <div key={character.id} className={styles.card}>
      <div className={styles.avatar}>
        <Image
          src={character.image}
          alt={character.name}
          width="100%"
          height="100%"
        />
      </div>
      <div>
        <h2>{character.name}</h2>
        <p>
          {character.species === 'unknown' || character.species === ''
            ? 'Species unknown'
            : character.species}
          ,&nbsp;
          {character.gender === 'unknown' || character.gender === ''
            ? 'Gender unknown'
            : character.gender}
          ,&nbsp;
          {character.status === 'unknown' || character.status === ''
            ? 'Status unknown'
            : character.status}
        </p>
      </div>
    </div>
  );
}

export default CharacterCard;
