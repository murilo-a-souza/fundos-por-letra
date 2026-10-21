import { useState, useMemo } from 'react';
import { Button, TextInput } from '@spresenter/plugin-sdk/ui-kit/react';

export interface MediaAsset {
    guid: string;
    type: string;
    title?: string;
    parent_guid?: string | null;
    category?: string | null;
}

interface MediaPickerModalProps {
    isOpen: boolean;
    selectedGuid?: string;
    assets: MediaAsset[];
    onSelect: (guid: string) => void;
    onClose: () => void;
}

export function MediaPickerModal({
                                     isOpen,
                                     selectedGuid,
                                     assets,
                                     onSelect,
                                     onClose,
                                 }: MediaPickerModalProps) {
    const [currentFolderGuid, setCurrentFolderGuid] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // Identifica a pasta atual e cria o histórico de navegação (breadcrumb)
    const breadcrumb = useMemo(() => {
        const path: MediaAsset[] = [];
        let curr = assets.find((a) => a.guid === currentFolderGuid);
        while (curr) {
            path.unshift(curr);
            curr = assets.find((a) => a.guid === curr?.parent_guid);
        }
        return path;
    }, [currentFolderGuid, assets]);

    // Filtra itens por pasta ou por busca global
    const filteredItems = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (term) {
            return assets.filter(
                (a) => a.type !== 'folder' && (a.title || '').toLowerCase().includes(term)
            );
        }
        return assets.filter((a) => (a.parent_guid ?? null) === currentFolderGuid);
    }, [assets, currentFolderGuid, search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-neutral-900 border border-neutral-700 shadow-2xl">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between border-b border-neutral-800 p-4">
                    <h2 className="text-base font-semibold text-white">Selecionar Fundo de Mídia</h2>
                    <Button size="sm" variant="ghost" onClick={onClose}>
                        ✕
                    </Button>
                </div>

                {/* Barra de Busca e Navegação */}
                <div className="flex flex-col gap-2 border-b border-neutral-800 p-4 bg-neutral-950/40">
                    <TextInput
                        placeholder="Buscar mídia por nome..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {!search && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 overflow-x-auto py-1">
                            <button
                                type="button"
                                className={`hover:text-white ${!currentFolderGuid ? 'font-bold text-white' : ''}`}
                                onClick={() => setCurrentFolderGuid(null)}
                            >
                                Início (Raiz)
                            </button>
                            {breadcrumb.map((folder) => (
                                <span key={folder.guid} className="flex items-center gap-1.5">
                  <span>/</span>
                  <button
                      type="button"
                      className="hover:text-white font-medium text-neutral-300"
                      onClick={() => setCurrentFolderGuid(folder.guid)}
                  >
                    {folder.title || 'Pasta'}
                  </button>
                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grade de Mídias e Pastas */}
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredItems.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                            Nenhuma mídia encontrada.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {filteredItems.map((item) => {
                                const isFolder = item.type === 'folder';
                                const isSelected = item.guid === selectedGuid;

                                if (isFolder) {
                                    return (
                                        <button
                                            key={item.guid}
                                            type="button"
                                            onClick={() => setCurrentFolderGuid(item.guid)}
                                            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-800/40 p-3 hover:bg-neutral-800 hover:border-neutral-600 transition text-center"
                                        >
                                            <span className="text-2xl">📁</span>
                                            <span className="line-clamp-2 text-xs font-medium text-neutral-200">
                        {item.title || 'Pasta'}
                      </span>
                                        </button>
                                    );
                                }

                                return (
                                    <button
                                        key={item.guid}
                                        type="button"
                                        onClick={() => {
                                            onSelect(item.guid);
                                            onClose();
                                        }}
                                        className={`group relative flex flex-col items-center justify-between rounded-lg border p-2 transition text-center ${
                                            isSelected
                                                ? 'border-blue-500 bg-blue-950/30'
                                                : 'border-neutral-800 bg-neutral-800/20 hover:border-neutral-600 hover:bg-neutral-800/60'
                                        }`}
                                    >
                                        <div className="flex h-16 w-full items-center justify-center rounded bg-neutral-900 text-2xl text-neutral-400 group-hover:scale-105 transition-transform">
                                            {item.type === 'video' ? '🎬' : item.type === 'image' ? '🖼️' : '📽️'}
                                        </div>
                                        <span className="mt-2 line-clamp-2 text-xs text-neutral-300">
                      {item.title || 'Sem título'}
                    </span>
                                        <span className="mt-1 text-[10px] uppercase tracking-wider text-neutral-500">
                      {item.type}
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Rodapé */}
                <div className="flex justify-end border-t border-neutral-800 p-3 bg-neutral-950/40">
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
}