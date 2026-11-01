import { useState } from 'react';
import {
    Panel,
    Field,
    Select,
    Button,
    TextInput,
} from '@spresenter/plugin-sdk/ui-kit/react';
import { MediaPickerModal, MediaAsset } from './MediaPickerModal';

export type ItemOption = {
    guid: string;
    title?: string;
    type?: string;
    parent_guid?: string | null;
};

export type MusicPanelProps = {
    id: number;
    musicGuid: string;
    bgGuid: string;
    layer?: number;
    musics: ItemOption[];
    backgrounds: MediaAsset[];
    onChangeMusic: (guid: string) => void;
    onChangeBg: (guid: string) => void;
    onChangeLayer: (layer: number) => void;
    aoRemover: () => void;
};

export default function MusicPanel({
                                       musicGuid,
                                       bgGuid,
                                       layer = 0,
                                       musics,
                                       backgrounds,
                                       onChangeMusic,
                                       onChangeBg,
                                       onChangeLayer,
                                       aoRemover,
                                   }: MusicPanelProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const selectedBg = backgrounds.find((bg) => bg.guid === bgGuid);

    return (
        <Panel>
            <Field label="Letra:">
                <Select
                    value={musicGuid}
                    onChange={(e) => onChangeMusic(e.target.value)}
                >
                    <option value="">Selecionar uma letra...</option>
                    {musics.map((music) => (
                        <option key={music.guid} value={music.guid}>
                            {music.title || 'Sem título'}
                        </option>
                    ))}
                </Select>
            </Field>

            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 8 }}>
                <div style={{ flex: 1 }}>
                    <Field label="Fundo selecionado:">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setModalOpen(true)}
                                className="flex-1 flex items-center justify-between rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-left hover:border-neutral-500 transition"
                            >
                <span className="truncate text-neutral-200">
                  {selectedBg ? (
                      <>
                      <span className="mr-1.5">
                        {selectedBg.type === 'video' ? '🎬' : '🖼️'}
                      </span>
                          {selectedBg.title || 'Sem título'}
                      </>
                  ) : (
                      <span className="text-neutral-500">Clique para escolher um fundo...</span>
                  )}
                </span>
                                <span className="text-xs text-indigo-600 font-medium ml-2">Escolher</span>
                            </button>
                        </div>
                    </Field>
                </div>

                <div style={{ width: 80 }}>
                    <Field label="Camada:">
                        <TextInput
                            type="number"
                            min={0}
                            value={layer}
                            onChange={(e) => onChangeLayer(Number(e.target.value))}
                        />
                    </Field>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <Button variant="danger" size="sm" onClick={aoRemover}>
                    Remover
                </Button>
            </div>

            <MediaPickerModal
                isOpen={modalOpen}
                selectedGuid={bgGuid}
                assets={backgrounds}
                onSelect={(guid) => onChangeBg(guid)}
                onClose={() => setModalOpen(false)}
            />
        </Panel>
    );
}