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
  location: Location;
  name: string;
  origin: Origin;
  species: string;
  status: string;
  type: string;
};
