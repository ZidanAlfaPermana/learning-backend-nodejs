export interface Entity {
    id: number;
}

export interface Jurnal extends Entity {
    pesertaId: number;
    kegiatan: string;
    hambatan: string;
    rencanaBesok: string;
    linkCommit?: string;
}

export type CreateJurnalDTO = Omit<Jurnal, 'id'>;

export type UpdateJurnalDTO = Partial<CreateJurnalDTO>;