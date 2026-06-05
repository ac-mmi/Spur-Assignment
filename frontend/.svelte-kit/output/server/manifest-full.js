export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.DVGrMxnC.js",app:"_app/immutable/entry/app.B9DfDzET.js",imports:["_app/immutable/entry/start.DVGrMxnC.js","_app/immutable/chunks/BNUYQnSu.js","_app/immutable/chunks/M3xFq2Nj.js","_app/immutable/chunks/BHKiJLXt.js","_app/immutable/entry/app.B9DfDzET.js","_app/immutable/chunks/M3xFq2Nj.js","_app/immutable/chunks/DtcBLtiX.js","_app/immutable/chunks/CjZuvcZV.js","_app/immutable/chunks/BHKiJLXt.js","_app/immutable/chunks/HZ0VwnDh.js","_app/immutable/chunks/BZlQ0vjk.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
