import React, { useState } from 'react';

import styles from '../styles/Modal.module.css';
import CharacterCard from '../components/characterCard';
import { Character } from '../types/character';

type Props = {
  buttonTitle: string;
  characters: Character[];
};

function Modal({ buttonTitle, characters }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  //   {showChars &&
  //     location.residents.map((resident: any) => (
  //       <div key={resident.id}>
  //         <p>name {resident.name}</p>
  //         <p>species {resident.species}</p>
  //         <p>gender {resident.gender}</p>
  //         <p>status {resident.status}</p>
  //       </div>
  //     ))}
  // </div>

  return (
    <>
      {isVisible ? (
        <div className={styles.modal} onClick={() => setIsVisible(false)}>
          <div
            className={styles.modalInner}
            onClick={(e) => e.preventDefault()}
          >
            {characters.map((character: Character, index: number) => (
              <CharacterCard character={character} key={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.button} onClick={() => setIsVisible(true)}>
          <span className={styles.cursor}>{buttonTitle}</span>
        </div>
      )}
    </>
  );
}

export default Modal;
