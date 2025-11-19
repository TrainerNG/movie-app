import { MovieInterface } from "./movie";

export interface MovieSearchResponse {
    page: number;
    results: MovieInterface[];
    total_pages: number;
    total_results: number;
}
