

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CJNpowWE.js","_app/immutable/chunks/CjZuvcZV.js","_app/immutable/chunks/M3xFq2Nj.js","_app/immutable/chunks/BZlQ0vjk.js"];
export const stylesheets = ["_app/immutable/assets/0.B8Z7O8za.css"];
export const fonts = [];
