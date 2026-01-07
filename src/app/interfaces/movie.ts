export interface MovieInterface {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    overview: string;
    vote_average: number;
    adult:boolean;
    vote_count: number;
    backdrop_path: string;
}


export interface MemberBluePrint {
    name?: string;
    role?: string;
    avalaiblity?: number;
    skills?: string[]
}