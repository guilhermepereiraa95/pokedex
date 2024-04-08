import { Species } from "./species.interface";

export interface Pokemon {
  id: string,
  name?: string,
  count?: string | null,
  results?: [];
  species?: Species;
  sprites: any;
  types?: any;
  height?: string;
  weight?: string;
  base_experience: any;
  abilities: any;
  stats: any;

}
