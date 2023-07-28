import gql from 'graphql-tag';
import { myFragment } from './js-my-fragment';

export const query = gql`
  query myQuery($a: String) {
    fieldA(a: $a)
    fieldB {
      ...MyFragment
    }
  }
  ${myFragment}
`;
