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
"[project]/pages/dashboard/Payments.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Payments-module__nVftLq__container",
  "errorBox": "Payments-module__nVftLq__errorBox",
  "formButton": "Payments-module__nVftLq__formButton",
  "formGrid": "Payments-module__nVftLq__formGrid",
  "formGroup": "Payments-module__nVftLq__formGroup",
  "formInput": "Payments-module__nVftLq__formInput",
  "formLabel": "Payments-module__nVftLq__formLabel",
  "formSection": "Payments-module__nVftLq__formSection",
  "formSelect": "Payments-module__nVftLq__formSelect",
  "formTitle": "Payments-module__nVftLq__formTitle",
  "noPayments": "Payments-module__nVftLq__noPayments",
  "pageTitle": "Payments-module__nVftLq__pageTitle",
  "required": "Payments-module__nVftLq__required",
  "statusPaid": "Payments-module__nVftLq__statusPaid",
  "statusSpan": "Payments-module__nVftLq__statusSpan",
  "successBox": "Payments-module__nVftLq__successBox",
  "table": "Payments-module__nVftLq__table",
  "tableData": "Payments-module__nVftLq__tableData",
  "tableDataAmount": "Payments-module__nVftLq__tableDataAmount",
  "tableDataStrong": "Payments-module__nVftLq__tableDataStrong",
  "tableHeadRow": "Payments-module__nVftLq__tableHeadRow",
  "tableHeader": "Payments-module__nVftLq__tableHeader",
  "tableRow": "Payments-module__nVftLq__tableRow",
  "tableSection": "Payments-module__nVftLq__tableSection",
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
"[project]/pages/dashboard/payments.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Payments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/pages/dashboard/Payments.module.css [client] (css module)"); // Importa o módulo CSS
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function Payments() {
    _s();
    const [payments, setPayments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]); // Para o dropdown de alunos
    const [selectedStudentName, setSelectedStudentName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Helper function returns data instead of setting state
    const fetchPayments = async ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/payments');
    };
    const fetchStudents = async ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/students');
    };
    // Safe useEffect with isMounted guard and try/catch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Payments.useEffect": ()=>{
            let isMounted = true;
            const loadData = {
                "Payments.useEffect.loadData": async ()=>{
                    try {
                        const [paymentsData, studentsData] = await Promise.all([
                            fetchPayments(),
                            fetchStudents()
                        ]);
                        if (paymentsData === null || studentsData === null) {
                            if (isMounted) {
                                setPayments([]);
                                setStudents([]);
                                setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
                            }
                            return;
                        }
                        if (isMounted) {
                            setPayments(paymentsData);
                            setStudents(studentsData);
                            setError(null);
                        }
                    } catch (_err) {
                        console.error("Erro ao carregar dados de pagamentos ou alunos:", _err);
                        if (isMounted) {
                            setPayments([]);
                            setStudents([]);
                            setError('Não foi possível carregar os dados de pagamentos ou alunos. Verifique se a API Flask está rodando na porta 5000.');
                        }
                    }
                }
            }["Payments.useEffect.loadData"];
            loadData();
            return ({
                "Payments.useEffect": ()=>{
                    isMounted = false;
                }
            })["Payments.useEffect"];
        }
    }["Payments.useEffect"], []);
    const handleAddPayment = async (e)=>{
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!selectedStudentName || !amount) {
            setError('Por favor, preencha o nome do aluno e o valor.');
            return;
        }
        // Verifica se o aluno selecionado existe na lista de alunos
        const studentExists = students.some((student)=>student.name === selectedStudentName);
        if (!studentExists) {
            setError('Aluno não encontrado. Por favor, selecione um aluno da lista.');
            return;
        }
        try {
            // O backend espera o amount como número, então removemos o '$' se houver
            const numericAmount = parseFloat(amount.replace('$', ''));
            if (isNaN(numericAmount)) {
                setError('Valor inválido. Por favor, insira um número.');
                return;
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/payments', {
                method: 'POST',
                body: JSON.stringify({
                    student_name: selectedStudentName,
                    amount: numericAmount,
                    status: 'Pago'
                })
            });
            setSelectedStudentName('');
            setAmount('');
            const updatedData = await fetchPayments();
            setPayments(updatedData);
            setSuccessMessage('Pagamento registrado com sucesso!');
        } catch (_err) {
            console.error("Erro ao adicionar pagamento:", _err);
            setError('Não foi possível registrar o pagamento no momento. Verifique se a API Flask está disponível e tente novamente.');
        }
    };
    // Ordena os pagamentos para exibição
    const sortedPayments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Payments.useMemo[sortedPayments]": ()=>{
            return [
                ...payments
            ].sort({
                "Payments.useMemo[sortedPayments]": (a, b)=>{
                    // Ordena por nome do aluno e depois por data (se houver)
                    if (a.student_name < b.student_name) return -1;
                    if (a.student_name > b.student_name) return 1;
                    // Se tiver um campo de data no pagamento, pode adicionar aqui
                    // if (a.date && b.date) return new Date(b.date) - new Date(a.date);
                    return 0;
                }
            }["Payments.useMemo[sortedPayments]"]);
        }
    }["Payments.useMemo[sortedPayments]"], [
        payments
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pageTitle,
                    children: "💳 Pagamentos"
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/payments.js",
                    lineNumber: 117,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorBox,
                    children: error
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/payments.js",
                    lineNumber: 120,
                    columnNumber: 11
                }, this),
                successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].successBox,
                    children: successMessage
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/payments.js",
                    lineNumber: 126,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSection,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formTitle,
                            children: "Registrar Novo Pagamento"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/payments.js",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleAddPayment,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGrid,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "student-name",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Nome do Aluno ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/payments.js",
                                                    lineNumber: 136,
                                                    columnNumber: 31
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard/payments.js",
                                            lineNumber: 135,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "student-name",
                                            type: "text",
                                            list: "students-list",
                                            placeholder: "Nome do Aluno",
                                            value: selectedStudentName,
                                            onChange: (e)=>setSelectedStudentName(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/payments.js",
                                            lineNumber: 138,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                            id: "students-list",
                                            children: students.map((student)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: student.name
                                                }, student.id, false, {
                                                    fileName: "[project]/pages/dashboard/payments.js",
                                                    lineNumber: 150,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/payments.js",
                                            lineNumber: 148,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/payments.js",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "amount",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Valor (R$) ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/payments.js",
                                                    lineNumber: 157,
                                                    columnNumber: 28
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard/payments.js",
                                            lineNumber: 156,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "amount",
                                            type: "number",
                                            step: "0.01",
                                            placeholder: "Valor (ex: 150.00)",
                                            value: amount,
                                            onChange: (e)=>setAmount(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/payments.js",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/payments.js",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formButton,
                                    children: "+ Registrar Pagamento"
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/payments.js",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard/payments.js",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard/payments.js",
                    lineNumber: 131,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableSection,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formTitle,
                            children: "Histórico de Pagamentos"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/payments.js",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].table,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeadRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Aluno"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/payments.js",
                                                lineNumber: 180,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Valor"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/payments.js",
                                                lineNumber: 181,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/payments.js",
                                                lineNumber: 182,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/payments.js",
                                        lineNumber: 179,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/payments.js",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: sortedPayments.length > 0 ? sortedPayments.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData} ${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableDataStrong}`,
                                                    children: p.student_name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/payments.js",
                                                    lineNumber: 189,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData} ${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableDataAmount}`,
                                                    children: [
                                                        "R$ ",
                                                        p.amount ? p.amount.toFixed(2).replace('.', ',') : '0,00'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard/payments.js",
                                                    lineNumber: 190,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statusSpan} ${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statusPaid}`,
                                                        children: p.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/payments.js",
                                                        lineNumber: 192,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/payments.js",
                                                    lineNumber: 191,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/pages/dashboard/payments.js",
                                            lineNumber: 188,
                                            columnNumber: 19
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: "3",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Payments$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].noPayments,
                                            children: error ? 'Os dados de pagamento estão indisponíveis no momento.' : 'Nenhum pagamento registrado ainda.'
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/payments.js",
                                            lineNumber: 200,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/payments.js",
                                        lineNumber: 199,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/payments.js",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard/payments.js",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard/payments.js",
                    lineNumber: 175,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/dashboard/payments.js",
            lineNumber: 116,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/dashboard/payments.js",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_s(Payments, "ny+3kq8/GpQFmG8PEkvisj3h444=");
_c = Payments;
var _c;
__turbopack_context__.k.register(_c, "Payments");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/dashboard/payments.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/dashboard/payments";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/dashboard/payments.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/dashboard/payments.js\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/dashboard/payments.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0k9g8_f._.js.map