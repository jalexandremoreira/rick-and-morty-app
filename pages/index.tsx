import * as React from 'react';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import Image from 'next/image';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { Character } from '../types/character';
import { Location } from '../types/location';
import { LOCATIONS_QUERY } from '../graphql/queries';
import {
  locationDimensions,
  LocationDimension,
  locationTypes,
  LocationType,
} from '../types/locationFilters';
import { LabelIcon, LayerIcon, XIcon } from '../components/icons';
import logo from '../public/images/logo.png';
import Modal from '../components/modal';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [selected, setSelected] = React.useState(0);
  const [typeFilter, setTypeFilter] = React.useState<LocationType>(null);
  const [dimensionFilter, setDimensionFilter] =
    React.useState<LocationDimension>(null);

  const { loading, error, data, fetchMore, refetch } = useQuery(
    LOCATIONS_QUERY,
    {
      variables: {
        page: null,
        filter: {
          type: typeFilter,
          dimension: dimensionFilter,
        },
      },
    }
  );

  console.log(data);

  const handleFetchMore = () => {
    const nextPage = data?.locations?.info?.next;

    if (!nextPage) {
      return;
    }

    fetchMore({
      variables: {
        page: nextPage,
        filter: {
          type: typeFilter,
          dimension: dimensionFilter,
        },
      },
      updateQuery: (prev: any, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        const prevResults = prev?.locations?.results ?? [];
        const nextResults = fetchMoreResult?.locations?.results ?? [];
        const info = fetchMoreResult?.locations?.info ?? null;
        const results = prevResults.concat(nextResults);

        const next = {
          ...prev,
          locations: {
            ...prev.locations,
            results,
            info,
          },
        };

        return next;
      },
    });
  };

  const handleRefetch = (
    typeValue: LocationType,
    dimensionValue: LocationDimension
  ) => {
    setTypeFilter(typeValue);
    setDimensionFilter(dimensionValue);

    refetch({
      page: null,
      filter: {
        type: typeValue === null ? null : typeFilter,
        dimension: dimensionValue === null ? null : dimensionFilter,
      },
    });
  };

  const calculateGuests = (location: Location) => {
    let count = 0;

    location?.residents.map((resident: Character) => {
      resident.location.id !== resident.origin.id ? (count += 1) : null;
    });

    return count;
  };

  error && console.log('error:', error);

  const calculateDemographics = (location: Location, type: string) => {
    let humans = 0;
    let robots = 0;
    let aliens = 0;

    location?.residents.map((resident: Character) => {
      resident.species === 'Human'
        ? (humans += 1)
        : resident.species === 'Robot'
        ? (robots += 1)
        : // confirmar que isto funciona. doest add up
          (aliens = +1);
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

  const calculateStatus = (location: Location, type: string) => {
    let dead = 0;
    let alive = 0;

    location?.residents.map((resident: Character) => {
      resident.status === 'Alive' ? (alive += 1) : (dead += 1);
    });

    switch (type) {
      case 'dead':
        return dead;
      default:
        return alive;
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Rick and Morty: Locations and Characters</title>
        <meta name="description" content="Built for fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Image src={logo} alt="Rick and Morty logo" height={113} width={382} />
        <h3 className={styles.title}>list of locations</h3>

        <div className={styles.list}>
          <div className={styles.dropdownList}>
            <div className={styles.dropdownRow}>
              <Dropdown
                className={styles.dropdown}
                options={locationTypes}
                onChange={(e) =>
                  handleRefetch(e.value as LocationType, dimensionFilter)
                }
                value={typeFilter === null ? 'filter by type' : typeFilter}
                placeholder="filter by type"
              />
              <div
                className={styles.button}
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  handleRefetch(null, dimensionFilter);
                }}
              >
                clear
              </div>
            </div>
            <div style={{ height: '10px' }} />
            <div className={styles.dropdownRow}>
              <Dropdown
                className={styles.dropdown}
                options={locationDimensions}
                onChange={(e) =>
                  handleRefetch(typeFilter, e.value as LocationDimension)
                }
                value={
                  dimensionFilter === null
                    ? 'filter by dimension'
                    : dimensionFilter
                }
                placeholder="filter by dimension"
              />
              <div
                className={styles.button}
                style={{ marginLeft: '10px' }}
                onClick={() => handleRefetch(typeFilter, null)}
              >
                clear
              </div>
            </div>
            <div style={{ height: '10px' }} />
            <div
              className={styles.button}
              onClick={() => {
                setSelected(0);
                handleRefetch(null, null);
              }}
            >
              clear filters
            </div>
          </div>

          {loading && (
            <div className={styles.center}>
              <h3 className={styles.title}>loading...</h3>
            </div>
          )}

          {data?.locations?.results === undefined && !loading && (
            <div className={styles.center}>
              <h3>No results to show</h3>
            </div>
          )}

          {data &&
            data?.locations?.results?.length !== 0 &&
            data?.locations?.results.map(
              (location: Location, index: number) => (
                <div key={index} style={{ width: '100%' }}>
                  {selected !== location.id ? (
                    <div
                      key={index}
                      onClick={() => {
                        selected !== location.id && setSelected(location.id);
                      }}
                      className={styles.listItem}
                    >
                      <h3 style={{ marginBottom: '10px', marginTop: '10px' }}>
                        {location.name}
                      </h3>
                    </div>
                  ) : (
                    <div className={styles.listCard} key={index}>
                      <div
                        onClick={() => setSelected(0)}
                        className={styles.cardHeader}
                      >
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
                        {location.dimension === 'unknown' ||
                        location.type === ''
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
                            <div
                              style={{ display: 'flex', flexDirection: 'row' }}
                            >
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
                  )}
                </div>
              )
            )}

          {data?.locations?.info?.next && (
            <div className={styles.center} style={{ marginTop: '30px' }}>
              <div
                className={styles.button}
                onClick={() => !loading && handleFetchMore()}
              >
                {!loading ? 'load more' : 'loading'}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/jalexandremoreira"
          target="_blank"
          rel="noopener noreferrer"
        >
          coded by&nbsp;
          <span style={{ fontWeight: 'bold' }}>@jalexandremoreira</span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
