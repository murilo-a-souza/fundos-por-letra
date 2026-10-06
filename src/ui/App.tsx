import { useEffect, useState } from 'react';
import { postMessage, onMessage } from '@spresenter/plugin-sdk/ui';
import {
  Root,
  Header,
  Panel,
  Row,
  Field,
  TextInput,
  Select,
  Button,
  Actions,
  StatusIndicator,
} from '@spresenter/plugin-sdk/ui-kit/react';

interface Output {
  index: number;
  name: string;
}

// UI panel: put a custom presentation live, then control its elements
// (line1 / line2) BY ID in real time — text updates as you type, no reload.
// Widgets come from the shared UI kit (@spresenter/plugin-sdk/ui-kit/react) so
// the panel matches the host app; call injectStyles() once (see main.tsx).
export function App() {
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [output, setOutput] = useState('0');
  const [layer, setLayer] = useState(0);
  const [live, setLive] = useState(false);
  const [line1, setLine1] = useState('Bem-vindos!');
  const [line2, setLine2] = useState('Culto de celebração');
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    const off = onMessage((raw) => {
      const msg = raw as { type?: string; outputs?: Output[] };
      if (msg.type === 'outputs') {
        setOutputs(msg.outputs ?? []);
        if (msg.outputs?.[0]) setOutput(String(msg.outputs[0].index));
      }
      if (msg.type === 'went-live') setLive(true);
      if (msg.type === 'cleared') setLive(false);
    });
    postMessage({ type: 'init' });
    return off;
  }, []);

  const goLive = () => postMessage({ type: 'go-live', output, layer, line1, line2 });
  const clear = () => postMessage({ type: 'clear' });

  // Real-time element control: fires on every keystroke.
  const onLine1 = (v: string) => { setLine1(v); if (live) postMessage({ type: 'set-line', elementId: 'line1', text: v }); };
  const onLine2 = (v: string) => { setLine2(v); if (live) postMessage({ type: 'set-line', elementId: 'line2', text: v }); };
  const onColor = (v: string) => { setColor(v); if (live) postMessage({ type: 'set-color', elementId: 'line1', color: v }); };

  return (
    <Root>
      <Header
        title="fundos-por-letra"
        subtitle="Put a custom presentation live, then edit its elements in real time."
      />

      <Row>
        <Field label="Output">
          <Select
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            disabled={live}
          >
            {outputs.map((o) => (
              <option key={o.index} value={o.index}>
                {o.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Layer" grow={0} style={{ width: 96 }}>
          <TextInput
            type="number"
            min={0}
            value={layer}
            onChange={(e) => setLayer(Number(e.target.value))}
            disabled={live}
          />
        </Field>
      </Row>

      <Panel>
        <Field label="Line 1 (element id: line1)">
          <TextInput value={line1} onChange={(e) => onLine1(e.target.value)} />
        </Field>
        <Field label="Line 2 (element id: line2)">
          <TextInput value={line2} onChange={(e) => onLine2(e.target.value)} />
        </Field>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: 'var(--sp-text-muted)',
          }}
        >
          Line 1 color
          <input
            type="color"
            value={color}
            onChange={(e) => onColor(e.target.value)}
            style={{ height: 24, width: 40, background: 'transparent', border: 0 }}
          />
        </label>
      </Panel>

      <Actions>
        {!live ? (
          <Button variant="success" onClick={goLive}>
            Send live
          </Button>
        ) : (
          <>
            <StatusIndicator state="ok" label="Live — editing in real time" />
            <Actions.Spacer />
            <Button onClick={clear}>Clear</Button>
          </>
        )}
      </Actions>
    </Root>
  );
}
