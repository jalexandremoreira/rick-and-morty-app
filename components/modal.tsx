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
              <div key={index} className={styles.cardContainer}>
                <CharacterCard character={character} key={index} />
                {index !== characters.length - 1 && (
                  <div className={styles.seperator} />
                )}
              </div>
            ))}
          </>
        </PureModal>
      ) : (
        <div
          className={styles.button}
          onClick={() => {
            characters && characters.length !== 0 ? setIsVisible(true) : null;
          }}
        >
          <span className={styles.cursor}>
            {characters && characters.length !== 0
              ? buttonTitle
              : '(no characters to show)'}
          </span>
        </div>
      )}
    </>
  );
}

export default Modal;
