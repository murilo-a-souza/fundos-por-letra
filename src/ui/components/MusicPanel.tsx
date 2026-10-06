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
import { postMessage, onMessage } from '@spresenter/plugin-sdk/ui';

export type MusicPanelProps = {
    id: number;
    aoRemover: () => void;
}

export default function MusicPanel({ id, aoRemover }: MusicPanelProps){
    return (
        <Panel>
            <Field label="Letra:">
                <Select>
                </Select>

            </Field>
            <Field label="Fundo:">
                <Select>
                </Select>
            </Field>
            <Button variant="danger" size="sm" onClick={aoRemover}>Remover</Button>
        </Panel>
    )
}