(function() {
  "use strict";
  spresenter.on("live", async ({ output = "0" }) => {
    const layers = await spresenter.live.read(output);
    const mappings = await spresenter.storage.get("music_bg_mappings") || [];
    for (const item of layers) {
      if (item?.asset && item.asset.type === "music") {
        const match = mappings.find((m) => m.musicGuid === item.asset.guid);
        if (match && match.bgGuid) {
          const targetLayer = match.layer ?? 0;
          const currentBgGuid = layers[targetLayer]?.asset?.guid;
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
  spresenter.ui.onmessage = async (raw) => {
    const msg = raw;
    if (!msg || typeof msg !== "object") return;
    if (msg.type === "init") {
      const outputs = await spresenter.outputs.list();
      const musics = await spresenter.assets.list({ type: "music" });
      const allAssets = await spresenter.assets.list();
      const backgrounds = allAssets.filter(
        (a) => a.type === "video" || a.type === "image" || a.type === "presentation"
      );
      const savedMappings = await spresenter.storage.get("music_bg_mappings") || [];
      spresenter.ui.postMessage({
        type: "init-data",
        outputs,
        musics,
        backgrounds,
        mappings: savedMappings
      });
      return;
    }
    if (msg.type === "save-mappings" && Array.isArray(msg.mappings)) {
      await spresenter.storage.set("music_bg_mappings", msg.mappings);
    }
  };
  console.log("Plugin loaded:", spresenter.manifest.name);
})();
