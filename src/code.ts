/* Thread de lógica do plugin. Executa em background e sincroniza fundos
ao vivo quando uma música correspondente é exibida. */

/// <reference types="@spresenter/plugin-sdk/code" />
import type { MusicMapping } from "./ui/App";

interface UiMsg {
  type?: string;
  mappings?: MusicMapping[];
}

// Monitora quando algo entra ao vivo
spresenter.on('live', async ({ output = '0' }) => {
  const layers = await spresenter.live.read(output);
  const mappings = (await spresenter.storage.get<MusicMapping[]>('music_bg_mappings')) || [];

  for (const item of layers) {
    if (item?.asset && item.asset.type === 'music') {
      const match = mappings.find((m) => m.musicGuid === item.asset.guid);

      if (match && match.bgGuid) {
        const targetLayer = match.layer ?? 0;
        const currentBgGuid = layers[targetLayer]?.asset?.guid;

        // Evita re-aplicar se o fundo já estiver ativo nessa camada (previne recarregar vídeos/imagens)
        if (currentBgGuid !== match.bgGuid) {
          const bgAsset = await spresenter.assets.get(match.bgGuid);
          if (bgAsset) {
            await spresenter.live.apply(output, targetLayer, { asset: bgAsset });
            await spresenter.live.setState(output, targetLayer, { show: true });
          }
        }
      }
    }
  }
});

spresenter.ui.onmessage = async (raw: unknown) => {
  const msg = raw as UiMsg;
  if (!msg || typeof msg !== 'object') return;

  if (msg.type === 'init') {
      const outputs = await spresenter.outputs.list();
      const musics = await spresenter.assets.list({ type: 'music' });
        // Busca todos os assets incluindo pastas, vídeos, imagens e apresentações
      const allAssets = await spresenter.assets.list();
      const mediaAssets = allAssets.filter(
            (a) =>
                a.type === 'folder' ||
                a.type === 'video' ||
                a.type === 'image' ||
                a.type === 'presentation'
      );

      const savedMappings = (await spresenter.storage.get<MusicMapping[]>('music_bg_mappings')) || [];

      spresenter.ui.postMessage({
            type: 'init-data',
            outputs,
            musics,
            backgrounds: mediaAssets,
            mappings: savedMappings,
      });
      return;
  }

  if (msg.type === 'save-mappings' && Array.isArray(msg.mappings)) {
    await spresenter.storage.set('music_bg_mappings', msg.mappings);
  }
};

// eslint-disable-next-line no-console
console.log('Plugin loaded:', spresenter.manifest.name);
