export interface MovieInterface {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    adult:boolean;
    backdrop_path: string;
}

export interface MemberBluePrint {
    name?: string;
    role?: string;
    avalaiblity?: number;
    skills?: string[]
}