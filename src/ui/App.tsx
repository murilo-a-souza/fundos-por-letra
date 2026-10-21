import { useEffect, useState } from 'react';
import { postMessage, onMessage } from '@spresenter/plugin-sdk/ui';
import MusicPanel, { ItemOption } from "./components/MusicPanel";
import {
  Root,
  Header,
  Button,
} from '@spresenter/plugin-sdk/ui-kit/react';

export interface MusicMapping {
  id: number;
  musicGuid: string;
  bgGuid: string;
  layer?: number;
}

export function App() {
  const [musics, setMusics] = useState<ItemOption[]>([]);
  const [backgrounds, setBackgrounds] = useState<ItemOption[]>([]);
  const [mappings, setMappings] = useState<MusicMapping[]>([]);

  const salvarMapeamentos = (novosMapeamentos: MusicMapping[]) => {
    setMappings(novosMapeamentos);
    postMessage({ type: 'save-mappings', mappings: novosMapeamentos });
  };

  const adicionarLetra = () => {
    const novos = [...mappings, { id: Date.now(), musicGuid: '', bgGuid: '', layer: 0 }];
    salvarMapeamentos(novos);
  };

  const removerLetra = (id: number) => {
    const novos = mappings.filter((m) => m.id !== id);
    salvarMapeamentos(novos);
  };

  const alterarMusica = (id: number, musicGuid: string) => {
    const novos = mappings.map((m) => (m.id === id ? { ...m, musicGuid } : m));
    salvarMapeamentos(novos);
  };

  const alterarBg = (id: number, bgGuid: string) => {
    const novos = mappings.map((m) => (m.id === id ? { ...m, bgGuid } : m));
    salvarMapeamentos(novos);
  };

  const alterarLayer = (id: number, layer: number) => {
    const novos = mappings.map((m) => (m.id === id ? { ...m, layer } : m));
    salvarMapeamentos(novos);
  };

  useEffect(() => {
    const off = onMessage((raw) => {
      const msg = raw as {
        type?: string;
        musics?: ItemOption[];
        backgrounds?: ItemOption[];
        mappings?: MusicMapping[];
      };
      if (msg.type === 'init-data') {
        if (msg.musics) setMusics(msg.musics);
        if (msg.backgrounds) setBackgrounds(msg.backgrounds);
        if (msg.mappings) setMappings(msg.mappings);
      }
    });
    postMessage({ type: 'init' });
    return off;
  }, []);

  return (
    <Root>
      <Header
        title="Fundos por letra"
        subtitle="Salve fundos para músicas específicas. Eles iniciarão junto com elas na camada desejada."
      />

      <div style={{ marginBottom: 12 }}>
        <Button
          variant="primary"
          size="md"
          onClick={adicionarLetra}
        >
          + Adicionar letra
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mappings.map((item) => (
          <MusicPanel
            key={item.id}
            id={item.id}
            musicGuid={item.musicGuid}
            bgGuid={item.bgGuid}
            layer={item.layer ?? 0}
            musics={musics}
            backgrounds={backgrounds}
            onChangeMusic={(guid) => alterarMusica(item.id, guid)}
            onChangeBg={(guid) => alterarBg(item.id, guid)}
            onChangeLayer={(layer) => alterarLayer(item.id, layer)}
            aoRemover={() => removerLetra(item.id)}
          />
        ))}
      </div>
    </Root>
  );
}
