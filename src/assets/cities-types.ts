export interface City {
  il_adi: string;
  plaka_kodu: string;
  alan_kodu: string;
  nufus: string;
  bolge: string;
  yuzolcumu: string;
  nufus_artisi: string;
  erkek_nufus_yuzde: string;
  erkek_nufus: string;
  kadin_nufus_yuzde: string;
  kadin_nufus: string;
  nufus_yuzdesi_genel: string;
  ilceler: Ilceler[];
  kisa_bilgi: string;
}

export interface Ilceler {
  plaka_kodu: string;
  ilce_kodu: string;
  il_adi: string;
  ilce_adi: string;
  nufus: string;
  erkek_nufus: string;
  kadin_nufus: string;
}
