/*Thread de lógica do plugin. Executa de forma isolada e comunica-se com o aplicativo
por meio da variável global injetada `spresenter`. Este modelo cria uma apresentação
PERSONALIZADA (um tema com elementos de TEXTO identificáveis) e controla esses
elementos POR ID em tempo real — a partir de um painel de interface, sem recarregar o tema.*/

import '@spresenter/plugin-sdk/code';

interface UiMsg {
  type?: string;
  output?: string | number;
  layer?: number;
  elementId?: string;
  text?: string;
  color?: string;
  line1?: string;
  line2?: string;
}

// Onde estamos operando atualmente (definido em "go-live").
let ctx = { output: '0', layer: 0 };

/* Uma apresentação totalmente personalizada criada via código
 — sem necessidade de recursos no banco de dados.
// Os elementos possuem IDs fixos ("line1", "line2")
que controlamos em tempo real posteriormente. */
function buildPresentation() {
  return {
    title: 'Custom',
    asset: { type: 'presentation', guid: 'plugin-window-custom', title: 'Custom' },
    theme: {
      title: 'Custom',
      css: {},
      elements: [
        {
          id: 'bg',
          type: 'RECTANGLE',
          x: 0,
          y: 0,
          visible: true,
          css: { position: 'absolute', width: '100%', height: '100%', background: 'rgba(0,0,0,0.55)' },
        },
        {
          id: 'line1',
          type: 'TEXT',
          text: '',
          x: 0,
          y: 0,
          visible: true,
          css: {
            width: '100%', height: '60%', display: 'flex', 'align-items': 'flex-end',
            'justify-content': 'center', 'text-align': 'center', 'font-family': 'Arial',
            'font-size': '84px', 'font-weight': '700', color: '#ffffff', padding: '0 60px',
          },
        },
        {
          id: 'line2',
          type: 'TEXT',
          text: '',
          x: 0,
          y: 0,
          visible: true,
          css: {
            width: '100%', height: '40%', display: 'flex', 'align-items': 'flex-start',
            'justify-content': 'center', 'text-align': 'center', 'font-family': 'Arial',
            'font-size': '48px', color: '#ffd479', padding: '0 60px', 'margin-top': '60%',
          },
        },
      ],
    },
    props: {},
  };
}

// Monitora quando algo entra ao vivo
spresenter.on('live', async ({ output = '0' }) => {
    const layers = await spresenter.live.read(output);

    for (const item of layers) {
        if (item?.asset && item.asset.type === 'music') {
            const musicGuid = item.asset.guid;
            const config = await spresenter.storage.get<{ bgGuid: string; bgLayer: number }>(`bg_map_${musicGuid}`);

            if (config) {
                const bgAsset = await spresenter.assets.get(config.bgGuid);
                if (bgAsset) {
                    await spresenter.live.apply(output, config.bgLayer, { asset: bgAsset });
                    await spresenter.live.setState(output, config.bgLayer, { show: true });
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
    spresenter.ui.postMessage({ type: 'outputs', outputs });
    return;
  }

  // Compose the custom presentation and put it live (visible).
  if (msg.type === 'go-live') {
    ctx = { output: String(msg.output ?? '0'), layer: Number(msg.layer ?? 0) };
    await spresenter.live.apply(ctx.output, ctx.layer, buildPresentation());
    await spresenter.live.setState(ctx.output, ctx.layer, { show: true });
    // Seed the current input values.
    spresenter.live.element(ctx.output, ctx.layer, 'line1').setText(msg.line1 ?? '');
    spresenter.live.element(ctx.output, ctx.layer, 'line2').setText(msg.line2 ?? '');
    spresenter.ui.postMessage({ type: 'went-live' });
    return;
  }

  // Real-time: grab the element by id and change its text as the user types.
  if (msg.type === 'set-line' && msg.elementId) {
    spresenter.live.element(ctx.output, ctx.layer, msg.elementId).setText(msg.text ?? '');
    return;
  }

  // Real-time: change an element's color (style) freely.
  if (msg.type === 'set-color' && msg.elementId && msg.color) {
    spresenter.live.element(ctx.output, ctx.layer, msg.elementId).setStyle({ color: msg.color });
    return;
  }

  if (msg.type === 'clear') {
    await spresenter.live.clear(ctx.output, ctx.layer);
    spresenter.ui.postMessage({ type: 'cleared' });
  }
};

// eslint-disable-next-line no-console
console.log('Plugin loaded:', spresenter.manifest.name);
