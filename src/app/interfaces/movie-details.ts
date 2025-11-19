import { MovieInterface } from "./movie";

export interface MovieDetailsInterface extends MovieInterface {
  budget: number;
  genres: {id:number, name:string}[];
  homepage: string;
  imdb_id: string;
  status: string;
  revenue: number;
  runtime: number;
  vote_count: number;
  popularity: number;
}
