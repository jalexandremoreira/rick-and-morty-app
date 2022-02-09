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
      <p>name {character.name}</p>
      <p>species {character.species}</p>
      <p>gender {character.gender}</p>
      <p>status {character.status}</p>
    </div>
  );
}

export default CharacterCard;
