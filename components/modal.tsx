import React, { useState } from 'react';
import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';

import styles from '../styles/Modal.module.css';
import CharacterCard from '../components/characterCard';
import { Character } from '../types/character';

type Props = {
  buttonTitle: string;
  title: string;
  characters: Character[];
};

function Modal({ buttonTitle, characters, title }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {isVisible ? (
        <PureModal
          header={title}
          isOpen={isVisible}
          width="600px"
          onClose={() => {
            setIsVisible(false);
            return true;
          }}
        >
          <>
            {characters.map((character: Character, index: number) => (
              <CharacterCard character={character} key={index} />
            ))}
          </>
        </PureModal>
      ) : (
        <div className={styles.button} onClick={() => setIsVisible(true)}>
          <span className={styles.cursor}>{buttonTitle}</span>
        </div>
      )}
    </>
  );
}

export default Modal;
