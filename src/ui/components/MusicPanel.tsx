import {
  Panel,
  Field,
  Select,
  Button,
  TextInput,
} from '@spresenter/plugin-sdk/ui-kit/react';

export type ItemOption = {
  guid: string;
  title?: string;
};

export type MusicPanelProps = {
  id: number;
  musicGuid: string;
  bgGuid: string;
  layer?: number;
  musics: ItemOption[];
  backgrounds: ItemOption[];
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

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <Field label="Fundo:">
            <Select
              value={bgGuid}
              onChange={(e) => onChangeBg(e.target.value)}
            >
              <option value="">Selecionar um fundo...</option>
              {backgrounds.map((bg) => (
                <option key={bg.guid} value={bg.guid}>
                  {bg.title || 'Sem título'}
                </option>
              ))}
            </Select>
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
    </Panel>
  );
}