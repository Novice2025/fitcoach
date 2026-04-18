(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime/runtime-types.d.ts" />
/// <reference path="../../../shared/runtime/dev-globals.d.ts" />
/// <reference path="../../../shared/runtime/dev-protocol.d.ts" />
/// <reference path="../../../shared/runtime/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateB.type === 'total') {
        // A total update replaces the entire chunk, so it supersedes any prior update.
        return updateB;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/components/DashboardLayout.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "DashboardLayout-module__zGh_ua__active",
  "container": "DashboardLayout-module__zGh_ua__container",
  "header": "DashboardLayout-module__zGh_ua__header",
  "headerTitle": "DashboardLayout-module__zGh_ua__headerTitle",
  "logoutButton": "DashboardLayout-module__zGh_ua__logoutButton",
  "mainContent": "DashboardLayout-module__zGh_ua__mainContent",
  "mobileMenuButton": "DashboardLayout-module__zGh_ua__mobileMenuButton",
  "navIcon": "DashboardLayout-module__zGh_ua__navIcon",
  "navItem": "DashboardLayout-module__zGh_ua__navItem",
  "navLink": "DashboardLayout-module__zGh_ua__navLink",
  "navList": "DashboardLayout-module__zGh_ua__navList",
  "sidebar": "DashboardLayout-module__zGh_ua__sidebar",
  "sidebarHeader": "DashboardLayout-module__zGh_ua__sidebarHeader",
  "sidebarOpen": "DashboardLayout-module__zGh_ua__sidebarOpen",
});
}),
"[project]/components/DashboardLayout.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)"); // Adicionado React import para consistência, embora não estritamente necessário para useState em Next.js 13+
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/prop-types/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout.module.css [client] (css module)"); // Importa o módulo CSS
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function DashboardLayout({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [mobileNavOpen, setMobileNavOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const navItems = [
        {
            name: 'Início',
            path: '/dashboard',
            icon: '🏠'
        },
        {
            name: 'Alunos',
            path: '/dashboard/students',
            icon: '🧑‍🎓'
        },
        {
            name: 'Treinos',
            path: '/dashboard/workouts',
            icon: '🏋️'
        },
        {
            name: 'Peso',
            path: '/dashboard/weight',
            icon: '⚖️'
        },
        {
            name: 'Agendamentos',
            path: '/dashboard/schedule',
            icon: '📅'
        },
        {
            name: 'Pagamentos',
            path: '/dashboard/payments',
            icon: '💰'
        }
    ];
    const handleLogout = ()=>{
        // Implemente sua lógica de logout aqui
        console.log('Fazendo logout...');
        router.push('/login'); // Redireciona para a página de login
    };
    const handleNavClick = ()=>{
        setMobileNavOpen(false);
    };
    // Lógica para determinar o título do cabeçalho com base na rota atual
    const getHeaderTitle = ()=>{
        const currentPath = router.pathname;
        // Lógica mais precisa para o item ativo
        const activeItem = navItems.find((item)=>{
            if (item.path === '/dashboard') {
                return currentPath === '/dashboard'; // "Início" só é ativo na rota exata /dashboard
            }
            return currentPath.startsWith(item.path); // Outros itens são ativos se a rota começar com seu path
        });
        return activeItem?.name || 'Dashboard';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sidebar} ${mobileNavOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sidebarOpen : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sidebarHeader,
                        children: "FitCoach"
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardLayout.js",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mobileMenuButton,
                        onClick: ()=>setMobileNavOpen((open)=>!open),
                        "aria-expanded": mobileNavOpen,
                        "aria-controls": "dashboard-navigation",
                        children: mobileNavOpen ? 'Fechar' : 'Menu'
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardLayout.js",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            id: "dashboard-navigation",
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navList} ${mobileNavOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navListOpen : ''}`,
                            children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navItem,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.path,
                                        // Lógica de classe ativa ajustada
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navLink} ${item.path === '/dashboard' && router.pathname === '/dashboard' || item.path !== '/dashboard' && router.pathname.startsWith(item.path) ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].active : ''}`,
                                        onClick: handleNavClick,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navIcon,
                                                children: item.icon
                                            }, void 0, false, {
                                                fileName: "[project]/components/DashboardLayout.js",
                                                lineNumber: 76,
                                                columnNumber: 19
                                            }, this),
                                            item.name
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/DashboardLayout.js",
                                        lineNumber: 65,
                                        columnNumber: 17
                                    }, this)
                                }, item.name, false, {
                                    fileName: "[project]/components/DashboardLayout.js",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/DashboardLayout.js",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardLayout.js",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DashboardLayout.js",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainContent,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerTitle,
                                children: getHeaderTitle()
                            }, void 0, false, {
                                fileName: "[project]/components/DashboardLayout.js",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logoutButton,
                                children: "Sair"
                            }, void 0, false, {
                                fileName: "[project]/components/DashboardLayout.js",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DashboardLayout.js",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/components/DashboardLayout.js",
                lineNumber: 86,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DashboardLayout.js",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(DashboardLayout, "YemOnWsrf1H4MdpaHxH0b8Y8BVU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DashboardLayout;
DashboardLayout.propTypes = {
    children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].node.isRequired
};
var _c;
__turbopack_context__.k.register(_c, "DashboardLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/dashboard/Weight.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Weight-module__-Uim8q__container",
  "errorBox": "Weight-module__-Uim8q__errorBox",
  "formButton": "Weight-module__-Uim8q__formButton",
  "formGrid": "Weight-module__-Uim8q__formGrid",
  "formGroup": "Weight-module__-Uim8q__formGroup",
  "formInput": "Weight-module__-Uim8q__formInput",
  "formLabel": "Weight-module__-Uim8q__formLabel",
  "formSection": "Weight-module__-Uim8q__formSection",
  "formSelect": "Weight-module__-Uim8q__formSelect",
  "formTitle": "Weight-module__-Uim8q__formTitle",
  "monthFilter": "Weight-module__-Uim8q__monthFilter",
  "noWeightLogs": "Weight-module__-Uim8q__noWeightLogs",
  "pageTitle": "Weight-module__-Uim8q__pageTitle",
  "required": "Weight-module__-Uim8q__required",
  "successBox": "Weight-module__-Uim8q__successBox",
  "table": "Weight-module__-Uim8q__table",
  "tableData": "Weight-module__-Uim8q__tableData",
  "tableDataStrong": "Weight-module__-Uim8q__tableDataStrong",
  "tableHeadRow": "Weight-module__-Uim8q__tableHeadRow",
  "tableHeader": "Weight-module__-Uim8q__tableHeader",
  "tableRow": "Weight-module__-Uim8q__tableRow",
  "tableSection": "Weight-module__-Uim8q__tableSection",
});
}),
"[project]/lib/api.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "addCustomExercise",
    ()=>addCustomExercise,
    "deleteStudent",
    ()=>deleteStudent,
    "deleteWorkout",
    ()=>deleteWorkout,
    "fetchExerciseCategories",
    ()=>fetchExerciseCategories,
    "fetchExercisesByCategory",
    ()=>fetchExercisesByCategory,
    "getApiUrl",
    ()=>getApiUrl,
    "requestJson",
    ()=>requestJson,
    "updateStudent",
    ()=>updateStudent,
    "updateWorkout",
    ()=>updateWorkout
]);
// lib/api.js
const FALLBACK_API_BASE_URL = "http://localhost:5000";
const envApiBaseUrl = typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = (envApiBaseUrl || FALLBACK_API_BASE_URL).replace(/\/$/, "");
function getApiUrl(path) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
}
async function requestJson(path, init = {}) {
    try {
        const headers = {
            "Content-Type": "application/json",
            ...init.headers || {}
        };
        const response = await fetch(getApiUrl(path), {
            ...init,
            headers
        });
        const contentType = response.headers.get("content-type") || "";
        let payload = null;
        if (contentType.includes("application/json")) {
            try {
                payload = await response.json();
            } catch  {
                payload = null;
            }
        }
        if (!response.ok) {
            const message = payload && typeof payload.error === "string" ? payload.error : `Request failed with status ${response.status}`;
            throw new Error(message);
        }
        return payload;
    } catch (err) {
        // For network errors, return null instead of throwing
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
            return null;
        }
        throw err;
    }
}
async function deleteStudent(id) {
    return requestJson(`/students/${id}`, {
        method: 'DELETE'
    });
}
async function updateStudent(id, data) {
    return requestJson(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}
async function deleteWorkout(id) {
    return requestJson(`/workouts/${id}`, {
        method: 'DELETE'
    });
}
async function updateWorkout(id, data) {
    return requestJson(`/workouts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}
async function fetchExerciseCategories() {
    return requestJson('/exercises/categories');
}
async function fetchExercisesByCategory(category) {
    return requestJson(`/exercises/${category}`);
}
async function addCustomExercise(name, category) {
    return requestJson('/exercises', {
        method: 'POST',
        body: JSON.stringify({
            name,
            category
        })
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/dashboard/weight.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Weight
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/pages/dashboard/Weight.module.css [client] (css module)"); // Importa o CSS específico para esta página
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function Weight() {
    _s();
    const [weightLogs, setWeightLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]); // Para o dropdown de alunos
    const [selectedStudentName, setSelectedStudentName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [weight, setWeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Novos estados para as medidas corporais
    const [chest, setChest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [quadril, setQuadril] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [braco, setBraco] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [perna, setPerna] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Novo estado para a seleção de mês
    const [selectedMonth, setSelectedMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Lista de meses para o dropdown
    const months = [
        {
            value: '',
            label: 'Todos os Meses'
        },
        {
            value: '01',
            label: 'Janeiro'
        },
        {
            value: '02',
            label: 'Fevereiro'
        },
        {
            value: '03',
            label: 'Março'
        },
        {
            value: '04',
            label: 'Abril'
        },
        {
            value: '05',
            label: 'Maio'
        },
        {
            value: '06',
            label: 'Junho'
        },
        {
            value: '07',
            label: 'Julho'
        },
        {
            value: '08',
            label: 'Agosto'
        },
        {
            value: '09',
            label: 'Setembro'
        },
        {
            value: '10',
            label: 'Outubro'
        },
        {
            value: '11',
            label: 'Novembro'
        },
        {
            value: '12',
            label: 'Dezembro'
        }
    ];
    // Função para buscar a lista de alunos
    const fetchStudents = async ()=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/students');
            if (data === null) {
                setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
                setStudents([]);
                return;
            }
            setStudents(data);
        } catch (err) {
            console.error("Erro ao buscar alunos:", err);
            setError("Erro ao carregar a lista de alunos.");
        }
    };
    // Função para buscar os registros de peso
    const fetchWeightLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Weight.useCallback[fetchWeightLogs]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/weightlogs');
                if (data === null) {
                    setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
                    setWeightLogs([]);
                    return;
                }
                // Filtra por mês se um mês estiver selecionado
                const filteredData = selectedMonth ? data.filter({
                    "Weight.useCallback[fetchWeightLogs]": (log)=>new Date(log.date).getMonth() + 1 === parseInt(selectedMonth)
                }["Weight.useCallback[fetchWeightLogs]"]) : data;
                // Ordena os logs por data (mais recente primeiro) e nome do aluno
                const sortedLogs = filteredData.sort({
                    "Weight.useCallback[fetchWeightLogs].sortedLogs": (a, b)=>{
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        if (dateA < dateB) return 1;
                        if (dateA > dateB) return -1;
                        return a.student_name.localeCompare(b.student_name);
                    }
                }["Weight.useCallback[fetchWeightLogs].sortedLogs"]);
                setWeightLogs(sortedLogs);
                setError(null);
            } catch (err) {
                console.error("Erro ao buscar registros de peso:", err);
                setError("Erro ao carregar registros de peso. Verifique o backend.");
                setWeightLogs([]);
            }
        }
    }["Weight.useCallback[fetchWeightLogs]"], [
        selectedMonth
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Weight.useEffect": ()=>{
            fetchStudents().catch({
                "Weight.useEffect": (err)=>console.error('Error fetching students:', err)
            }["Weight.useEffect"]);
            fetchWeightLogs().catch({
                "Weight.useEffect": (err)=>console.error('Error fetching weight logs:', err)
            }["Weight.useEffect"]);
        }
    }["Weight.useEffect"], [
        selectedMonth,
        fetchWeightLogs
    ]); // Adiciona selectedMonth como dependência para re-filtrar os logs
    const handleAddWeightLog = async (e)=>{
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!selectedStudentName || !weight || !date) {
            setError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        try {
            const newLog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/weightlogs', {
                method: 'POST',
                body: JSON.stringify({
                    student_name: selectedStudentName,
                    weight: parseFloat(weight),
                    date: date,
                    // Inclui as novas medidas corporais
                    chest: chest ? parseFloat(chest) : null,
                    quadril: quadril ? parseFloat(quadril) : null,
                    braco: braco ? parseFloat(braco) : null,
                    perna: perna ? parseFloat(perna) : null
                })
            });
            // Adiciona o novo log no topo e recarrega para garantir a ordenação e dados mais recentes
            setWeightLogs([
                newLog,
                ...weightLogs
            ]);
            setSelectedStudentName('');
            setWeight('');
            setDate('');
            setChest('');
            setQuadril('');
            setBraco('');
            setPerna('');
            setSuccessMessage("Registro de peso e medidas adicionado com sucesso!");
            fetchWeightLogs(); // Recarrega para garantir a ordenação e dados mais recentes
        } catch (err) {
            console.error("Erro ao adicionar registro de peso:", err);
            setError(`Erro ao adicionar registro de peso: ${err.message || 'Verifique os dados.'}`);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pageTitle,
                    children: "Gerenciamento de Peso e Medidas"
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/weight.js",
                    lineNumber: 136,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorBox,
                    children: error
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/weight.js",
                    lineNumber: 138,
                    columnNumber: 19
                }, this),
                successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].successBox,
                    children: successMessage
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/weight.js",
                    lineNumber: 139,
                    columnNumber: 28
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSection,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formTitle,
                            children: "Registrar Novo Peso e Medidas"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/weight.js",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleAddWeightLog,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGrid,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "student-name-select",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Nome do Aluno ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 146,
                                                    columnNumber: 31
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 145,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "student-name-select",
                                            type: "text",
                                            list: "students-list",
                                            value: selectedStudentName,
                                            onChange: (e)=>setSelectedStudentName(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                            placeholder: "Selecione ou digite o nome do aluno",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 148,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                            id: "students-list",
                                            children: students.map((student)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: student.name
                                                }, student.id, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 160,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 158,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "weight-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Peso (kg) ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 167,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 166,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "weight-input",
                                            type: "number",
                                            step: "0.1",
                                            value: weight,
                                            onChange: (e)=>setWeight(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                            placeholder: "Ex: 75.5",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 169,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "date-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Data ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 183,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "date-input",
                                            type: "date",
                                            value: date,
                                            onChange: (e)=>setDate(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 185,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "chest-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Peito (cm)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 197,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "chest-input",
                                            type: "number",
                                            step: "0.1",
                                            value: chest,
                                            onChange: (e)=>setChest(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                            placeholder: "Ex: 100.5"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 200,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "quadril-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Quadril (cm)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 212,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "quadril-input",
                                            type: "number",
                                            step: "0.1",
                                            value: quadril,
                                            onChange: (e)=>setQuadril(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                            placeholder: "Ex: 95.0"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 211,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "braco-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Braço (cm)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 227,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "braco-input",
                                            type: "number",
                                            step: "0.1",
                                            value: braco,
                                            onChange: (e)=>setBraco(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                            placeholder: "Ex: 30.2"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 230,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "perna-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Perna (cm)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 242,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "perna-input",
                                            type: "number",
                                            step: "0.1",
                                            value: perna,
                                            onChange: (e)=>setPerna(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                            placeholder: "Ex: 55.8"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 245,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 241,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formButton,
                                    children: "+ Registrar Peso e Medidas"
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 256,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard/weight.js",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard/weight.js",
                    lineNumber: 141,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableSection,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formTitle,
                            children: "Registros de Peso e Medidas"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/weight.js",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].monthFilter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "month-select",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                    children: "Filtrar por Mês:"
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "month-select",
                                    value: selectedMonth,
                                    onChange: (e)=>setSelectedMonth(e.target.value),
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSelect,
                                    children: months.map((month)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: month.value,
                                            children: month.label
                                        }, month.value, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 274,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 267,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard/weight.js",
                            lineNumber: 263,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].table,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeadRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Aluno"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Peso (kg)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 283,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Peito (cm)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 284,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Quadril (cm)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 285,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Braço (cm)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 286,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Perna (cm)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 287,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Data"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 288,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/weight.js",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: weightLogs.length > 0 ? weightLogs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData} ${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableDataStrong}`,
                                                    children: log.student_name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 295,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.weight
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 296,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.chest || '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 297,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.quadril || '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 298,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.braco || '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 299,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.perna || '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 300,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.date
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 301,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, log.id, true, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 294,
                                            columnNumber: 19
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: "7",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].noWeightLogs,
                                            children: error ? 'Os registros de peso e medidas estão indisponíveis no momento.' : 'Nenhum registro de peso ou medida ainda.'
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 306,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/weight.js",
                                        lineNumber: 305,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard/weight.js",
                            lineNumber: 279,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard/weight.js",
                    lineNumber: 260,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/dashboard/weight.js",
            lineNumber: 135,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/dashboard/weight.js",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
_s(Weight, "Fqrtcpd0CW9O3ZUv/3zg3+UPHIY=");
_c = Weight;
var _c;
__turbopack_context__.k.register(_c, "Weight");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/dashboard/weight.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/dashboard/weight";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/dashboard/weight.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if ("TURBOPACK compile-time truthy", 1) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/dashboard/weight.js\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/dashboard/weight.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__05dq4k~._.js.map