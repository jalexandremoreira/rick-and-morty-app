import * as React from 'react';
import Dropdown from 'react-dropdown';
import Head from 'next/head';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import 'react-dropdown/style.css';

import ListCard from '../components/ListCard';
import logo from '../public/images/logo.png';
import styles from '../styles/Home.module.css';
import { LOCATIONS_QUERY } from '../graphql/queries';
import { Location } from '../types/location';
import {
  locationDimensions,
  LocationDimension,
  locationTypes,
  LocationType,
} from '../types/locationFilters';

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

  error && console.log('error:', error);

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
                  {
                    setSelected(0);
                    handleRefetch(null, dimensionFilter);
                  }
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
                onClick={() => {
                  setSelected(0);
                  handleRefetch(typeFilter, null);
                }}
              >
                clear
              </div>
            </div>
            <div style={{ height: '10px' }} />
            <span
              className={styles.button}
              onClick={() => {
                setSelected(0);
                handleRefetch(null, null);
              }}
            >
              clear filters
            </span>
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
                    <ListCard
                      location={location}
                      index={index}
                      setSelected={setSelected}
                      selected={selected}
                    />
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
