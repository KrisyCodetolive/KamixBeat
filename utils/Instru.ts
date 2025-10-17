

export interface Instru {
  Instru: {
    title: string;
    bpm: string;
    gamme: string;
    url: string;
    price: string;
  };
  Audio: {
    path: string;
    price: string;
  }[];
  SignedUrl: string[];
}