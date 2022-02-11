import * as React from 'react';

import Modal from './modal';
import styles from '../styles/ListCard.module.css';
import { Character } from '../types/character';
import { LabelIcon, LayerIcon, XIcon } from './icons';
import { Location } from '../types/location';

type Props = {
  location: Location;
  index: number;
  setSelected: (index: number) => void;
  selected: number;
};

const ListCard = ({ location, index, setSelected, selected }: Props) => {
  const calculateStatus = (location: Location, type: string) => {
    let alive = 0;
    let dead = 0;

    location?.residents.map((resident: Character) => {
      switch (resident.status) {
        case 'Alive':
          return (alive += 1);
        case 'Dead':
          return (dead += 1);
        default:
          null;
      }
    });

    switch (type) {
      case 'dead':
        return dead;
      default:
        return alive;
    }
  };

  const calculateGuests = (location: Location) => {
    let count = 0;

    location?.residents.map((resident: Character) => {
      resident.location.id !== resident.origin.id ? (count += 1) : null;
    });

    return count;
  };

  const calculateDemographics = (location: Location, type: string) => {
    let humans = 0;
    let robots = 0;
    let aliens = 0;

    location?.residents.map((resident: Character) => {
      switch (resident.species) {
        case 'Human':
          return (humans += 1);
        case 'Robot':
          return (robots += 1);
        default:
          return (aliens += 1);
      }
    });

    switch (type) {
      case 'humans':
        return humans;
      case 'robots':
        return robots;
      default:
        return aliens;
    }
  };

  return (
    <div className={styles.listCard} key={index}>
      <div onClick={() => setSelected(0)} className={styles.cardHeader}>
        <h3 style={{ margin: 0 }}>{location.name}</h3>
        <XIcon size={18} />
      </div>

      <div className={styles.cardLabels}>
        <LabelIcon size={18} />
        <div style={{ width: '10px' }} />
        {location.type === 'unknown' || location.type === ''
          ? 'Type unknown'
          : location.type}
      </div>
      <div className={styles.cardLabels}>
        <LayerIcon size={18} />
        <div style={{ width: '10px' }} />
        {location.dimension === 'unknown' || location.type === ''
          ? 'Dimension unknown'
          : location.dimension}
      </div>

      <div className={styles.spacerV} />

      {selected === location.id && (
        <>
          <div className={styles.center}>
            <div className={styles.centerV}>
              <p>residents</p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div className={styles.demographics}>
                  <div className={styles.demoText}>total</div>
                  <div className={styles.demoText}>
                    {location.residents.length}
                  </div>
                </div>
                <div style={{ width: 10 }} />
                <div className={styles.demographics}>
                  <div className={styles.demoText}>alive</div>
                  <div className={styles.demoText}>
                    {calculateStatus(location, 'alive')}
                  </div>
                </div>
                <div style={{ width: 10 }} />
                <div className={styles.demographics}>
                  <div className={styles.demoText}>dead</div>
                  <div className={styles.demoText}>
                    {calculateStatus(location, 'dead')}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width: 60 }} />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <p>guests</p>
              <div className={styles.demographics}>
                <div className={styles.demoText}>
                  {calculateGuests(location)}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.spacerV} />

          <div className={styles.centerV}>
            <p>resident demographics</p>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div className={styles.demographics}>
                <div className={styles.demoText}>aliens</div>
                <div className={styles.demoText}>
                  {calculateDemographics(location, 'aliens')}
                </div>
              </div>
              <div style={{ width: 10 }} />
              <div className={styles.demographics}>
                <div className={styles.demoText}>humans</div>
                <div className={styles.demoText}>
                  {calculateDemographics(location, 'humans')}
                </div>
              </div>
              <div style={{ width: 10 }} />
              <div className={styles.demographics}>
                <div className={styles.demoText}>robots</div>
                <div className={styles.demoText}>
                  {calculateDemographics(location, 'robots')}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.spacerV} />

          <Modal
            characters={location?.residents}
            buttonTitle="view all characters"
            title={location.name}
          />
        </>
      )}
    </div>
  );
};

export default ListCard;
