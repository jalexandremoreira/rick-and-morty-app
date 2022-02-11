type Location = {
  id: number;
};

type Origin = {
  id: number;
};

export type Character = {
  gender: string;
  id: number;
  image: string;
  name: string;
  species: string;
  status: string;
  type: string;
  location: Location;
  origin: Origin;
};
