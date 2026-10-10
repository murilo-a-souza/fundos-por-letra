import {
  Panel,
  Field,
  Select,
  Button,
} from '@spresenter/plugin-sdk/ui-kit/react';
export type ItemOption = {
    guid: string;
    title?: string;
}

export type MusicPanelProps = {
    id: number;
    musicGuid: string;
    bgGuid: string;
    musics: ItemOption[];
    backgrounds: ItemOption[];
    onChangeMusic: (guid: string) => void;
    onChangeBg: (guid: string) => void;
    aoRemover: () => void;
}

export default function MusicPanel({   musicGuid,bgGuid,musics,backgrounds,onChangeMusic,
                                       onChangeBg,aoRemover }: MusicPanelProps){
    return (
        <Panel>
            <Field label="Letra:">
                <Select value={musicGuid}
                        onChange={(e) => onChangeMusic(e.target.value)}>
                    <option value="">Selecionar uma letra...</option>
                    {musics.map((music) => (
                        <option key={music.guid} value={music.guid}>{music.title || 'Sem título'}</option>))}
                </Select>

            </Field>
            <Field label="Fundo:">
                <Select value={bgGuid}
                        onChange={(e) => onChangeBg(e.target.value)}>
                    <option value="">Selecionar um fundo...</option>
                    {backgrounds.map((bg) => (
                        <option key={bg.guid} value={bg.guid}>{bg.title || 'Sem título'}</option>))}
                </Select>
            </Field>
            <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={aoRemover}>Remover</Button>
                <Button variant="primary" size="sm">Salvar</Button>
            </div>
        </Panel>
    )
}