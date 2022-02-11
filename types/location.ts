import { Character } from './character';

export type Location = {
  dimension: string;
  id: number;
  name: string;
  residents: Character[];
  type: string;
};
