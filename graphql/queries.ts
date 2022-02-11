import { gql } from '@apollo/client';

export const LOCATIONS_QUERY = gql`
  query Locations($page: Int, $filter: FilterLocation) {
    locations(page: $page, filter: $filter) {
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
      info {
        pages
        next
        prev
        count
      }
    }
  }
`;
