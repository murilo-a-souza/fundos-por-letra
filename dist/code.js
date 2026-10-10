(function() {
  "use strict";
  let ctx = { output: "0", layer: 0 };
  function buildPresentation() {
    return {
      title: "Custom",
      asset: { type: "presentation", guid: "plugin-window-custom", title: "Custom" },
      theme: {
        title: "Custom",
        css: {},
        elements: [
          {
            id: "bg",
            type: "RECTANGLE",
            x: 0,
            y: 0,
            visible: true,
            css: { position: "absolute", width: "100%", height: "100%", background: "rgba(0,0,0,0.55)" }
          },
          {
            id: "line1",
            type: "TEXT",
            text: "",
            x: 0,
            y: 0,
            visible: true,
            css: {
              width: "100%",
              height: "60%",
              display: "flex",
              "align-items": "flex-end",
              "justify-content": "center",
              "text-align": "center",
              "font-family": "Arial",
              "font-size": "84px",
              "font-weight": "700",
              color: "#ffffff",
              padding: "0 60px"
            }
          },
          {
            id: "line2",
            type: "TEXT",
            text: "",
            x: 0,
            y: 0,
            visible: true,
            css: {
              width: "100%",
              height: "40%",
              display: "flex",
              "align-items": "flex-start",
              "justify-content": "center",
              "text-align": "center",
              "font-family": "Arial",
              "font-size": "48px",
              color: "#ffd479",
              padding: "0 60px",
              "margin-top": "60%"
            }
          }
        ]
      },
      props: {}
    };
  }
  spresenter.on("live", async ({ output = "0" }) => {
    const layers = await spresenter.live.read(output);
    const mappings = await spresenter.storage.get("music_bg_mappings") || [];
    for (const item of layers) {
      if (item?.asset && item.asset.type === "music") {
        const match = mappings.find((m) => m.musicGuid === item.asset.guid);
        if (match && match.bgGuid) {
          const bgAsset = await spresenter.assets.get(match.bgGuid);
          if (bgAsset) {
            const targetLayer = match.layer ?? 0;
            await spresenter.live.apply(output, targetLayer, { asset: bgAsset });
            await spresenter.live.setState(output, targetLayer, { show: true });
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
      spresenter.ui.postMessage({ type: "outputs", outputs });
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
    if (msg.type === "save-mappings") {
      await spresenter.storage.set("music_bg_mappings", msg.mappings);
    }
    if (msg.type === "go-live") {
      ctx = { output: String(msg.output ?? "0"), layer: Number(msg.layer ?? 0) };
      await spresenter.live.apply(ctx.output, ctx.layer, buildPresentation());
      await spresenter.live.setState(ctx.output, ctx.layer, { show: true });
      spresenter.live.element(ctx.output, ctx.layer, "line1").setText(msg.line1 ?? "");
      spresenter.live.element(ctx.output, ctx.layer, "line2").setText(msg.line2 ?? "");
      spresenter.ui.postMessage({ type: "went-live" });
      return;
    }
    if (msg.type === "set-line" && msg.elementId) {
      spresenter.live.element(ctx.output, ctx.layer, msg.elementId).setText(msg.text ?? "");
      return;
    }
    if (msg.type === "set-color" && msg.elementId && msg.color) {
      spresenter.live.element(ctx.output, ctx.layer, msg.elementId).setStyle({ color: msg.color });
      return;
    }
    if (msg.type === "clear") {
      await spresenter.live.clear(ctx.output, ctx.layer);
      spresenter.ui.postMessage({ type: "cleared" });
    }
  };
  console.log("Plugin loaded:", spresenter.manifest.name);
})();
