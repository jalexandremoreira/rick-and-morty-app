import * as React from 'react';
import { gql } from '@apollo/client';
import Head from 'next/head';
import Image from 'next/image';

import client from '../apollo-client';
import logo from '../public/images/logo.png';
import Modal from '../components/modal';
import styles from '../styles/Home.module.css';

type Props = {
  locations: any;
};

const Home = ({ locations }: Props) => {
  const [selected, setSelected] = React.useState(0);
  // const [showChars, setShowChars] = React.useState(false);

  const calculateGuests = (location: any) => {
    //isto está mal... tenho que fazer fetch aos characters todos e ver a localizacao vs residencia
    let count = 0;

    location?.residents.map((resident: any) => {
      resident.location.id !== resident.origin.id ? (count += 1) : null;
    });

    return count;
  };

  const calculateDemographics = (location: any, type: string) => {
    let humans = 0;
    let robots = 0;
    let aliens = 0;

    location?.residents.map((resident: any) => {
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

  const calculateStatus = (location: any, type: string) => {
    let dead = 0;
    let alive = 0;

    location?.residents.map((resident: any) => {
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
          {locations.map((location: any, index: number) => (
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
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 23 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.49991 2.5C2.72261 2.2773 3.02465 2.15219 3.3396 2.15219C3.65454 2.15219 3.95659 2.2773 4.17929 2.5L11.5 9.82063L18.8206 2.50001C19.0433 2.27731 19.3454 2.1522 19.6603 2.1522C19.9752 2.1522 20.2773 2.27731 20.5 2.50001C20.7227 2.72271 20.8478 3.02476 20.8478 3.3397C20.8478 3.65465 20.7227 3.95669 20.5 4.17939L13.1794 11.5L20.5 18.8206C20.7227 19.0433 20.8478 19.3454 20.8478 19.6603C20.8478 19.9753 20.7227 20.2773 20.5 20.5C20.2773 20.7227 19.9753 20.8478 19.6603 20.8478C19.3454 20.8478 19.0433 20.7227 18.8206 20.5L11.5 13.1794L4.17938 20.5C3.95668 20.7227 3.65464 20.8478 3.33969 20.8478C3.02475 20.8478 2.7227 20.7227 2.5 20.5C2.2773 20.2773 2.15219 19.9753 2.15219 19.6603C2.15219 19.3454 2.2773 19.0433 2.5 18.8206L9.82061 11.5L2.49991 4.17938C2.27721 3.95668 2.1521 3.65464 2.1521 3.33969C2.1521 3.02475 2.27721 2.7227 2.49991 2.5Z"
                        fill="#34343D"
                      />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.52588 4.21452V4.2118H4.52861C5.07764 4.16306 5.62782 4.1282 6.17861 4.10725C7.50588 4.05452 9.08134 4.0618 10.2513 4.23634C10.3247 4.25057 10.3916 4.28783 10.4422 4.3427L17.4913 11.3909C17.5337 11.4331 17.5673 11.4833 17.5902 11.5385C17.6131 11.5937 17.6249 11.6529 17.6249 11.7127C17.6249 11.7725 17.6131 11.8317 17.5902 11.8869C17.5673 11.9421 17.5337 11.9923 17.4913 12.0345L12.3486 17.1763C12.2634 17.2616 12.1478 17.3094 12.0272 17.3094C11.9067 17.3094 11.7911 17.2616 11.7059 17.1763L4.65679 10.1282C4.60192 10.0775 4.56466 10.0106 4.55043 9.93725C4.37588 8.76725 4.36861 7.1918 4.42134 5.86452C4.44679 5.20816 4.4877 4.62907 4.52588 4.21452V4.21452Z"
                        stroke="#0D3B66"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.21949 8.98194C9.57451 8.62691 9.57451 8.05131 9.21949 7.69629C8.86447 7.34126 8.28886 7.34126 7.93384 7.69629C7.57882 8.05131 7.57882 8.62691 7.93384 8.98194C8.28886 9.33696 8.86447 9.33696 9.21949 8.98194Z"
                        fill="#0D3B66"
                      />
                    </svg>
                    {location.type}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.99991 6.66663L9.99991 9.16663L14.9999 6.66663L9.99991 4.16663L4.99991 6.66663ZM10.4074 2.59663L17.0682 5.9933C17.4732 6.19996 17.6191 6.6683 17.3941 7.0408C17.3156 7.16876 17.2031 7.27235 17.0691 7.33996L10.4074 10.7366C10.281 10.8004 10.1415 10.8336 9.99991 10.8336C9.85836 10.8336 9.71879 10.8004 9.59241 10.7366L2.93157 7.33996C2.52657 7.1333 2.38074 6.66496 2.60574 6.29246C2.6842 6.1645 2.79673 6.06091 2.93074 5.9933L9.59241 2.59663C9.84574 2.46746 10.1541 2.46746 10.4074 2.59663V2.59663ZM10.4074 14.0683C10.2813 14.1331 10.1416 14.1669 9.99991 14.1669C9.85817 14.1669 9.71848 14.1331 9.59241 14.0683L2.93157 10.6125C2.52657 10.4025 2.38074 9.9258 2.60574 9.54746C2.68368 9.41783 2.79623 9.31249 2.93074 9.2433C3.0279 9.19276 3.13581 9.16637 3.24532 9.16637C3.35484 9.16637 3.46275 9.19276 3.55991 9.2433L9.59324 12.3725C9.84574 12.5041 10.1541 12.5041 10.4074 12.3725L16.4399 9.2433C16.537 9.1929 16.6447 9.16658 16.7541 9.16658C16.8634 9.16658 16.9712 9.1929 17.0682 9.2433C17.4732 9.4533 17.6191 9.92996 17.3941 10.3083C17.3161 10.4379 17.2036 10.5433 17.0691 10.6125L10.4074 14.0683V14.0683ZM10.4074 17.4016C10.2813 17.4664 10.1416 17.5002 9.99991 17.5002C9.85817 17.5002 9.71848 17.4664 9.59241 17.4016L2.93157 13.9458C2.52657 13.7358 2.38074 13.2591 2.60574 12.8808C2.68368 12.7512 2.79623 12.6458 2.93074 12.5766C3.0279 12.5261 3.13581 12.4997 3.24532 12.4997C3.35484 12.4997 3.46275 12.5261 3.55991 12.5766L9.59324 15.7058C9.84574 15.8375 10.1541 15.8375 10.4074 15.7058L16.4399 12.5766C16.537 12.5262 16.6447 12.4999 16.7541 12.4999C16.8634 12.4999 16.9712 12.5262 17.0682 12.5766C17.4732 12.7866 17.6191 13.2633 17.3941 13.6416C17.3161 13.7713 17.2036 13.8766 17.0691 13.9458L10.4074 17.4016V17.4016Z"
                        fill="#0D3B66"
                      />
                    </svg>
                    {location.dimension}
                  </div>
                  <div className={styles.spacerV} />
                  {selected === location.id && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <p>residents</p>
                          <div
                            style={{ display: 'flex', flexDirection: 'row' }}
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

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
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
                        buttonTitle="show all characters"
                        title={location.name}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
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

// export async function getStaticProps() {
//   const { data } = await client.query({
//     query: gql`
//       query Characters {
//         characters {
//           results {
//             name
//             image
//             id
//             gender
//             status
//             species
//           }
//         }
//       }
//     `,
//   });

//   return {
//     props: {
//       characters: data.characters.results,
//     },
//   };
// }

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query Locations {
        locations {
          results {
            name
            dimension
            residents {
              gender
              location {
                id
              }
              id
              image
              origin {
                id
              }
              name
              species
              status
              type
            }
            id
            type
          }
        }
      }
    `,
  });

  return {
    props: {
      locations: data.locations.results,
    },
  };
}
