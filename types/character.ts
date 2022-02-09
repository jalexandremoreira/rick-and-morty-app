type Location = {
  id: string;
};

type Origin = {
  id: string;
};

export type Character = {
  gender: string;
  id: string;
  image: string;
  name: string;
  species: string;
  status: string;
  type: string;
  location: Location;
  origin: Origin;
};
