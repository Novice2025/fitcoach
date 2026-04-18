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
"[project]/pages/dashboard/Workouts.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Workouts-module__uvmFHq__container",
  "dayFilter": "Workouts-module__uvmFHq__dayFilter",
  "dayHeader": "Workouts-module__uvmFHq__dayHeader",
  "daySection": "Workouts-module__uvmFHq__daySection",
  "errorBox": "Workouts-module__uvmFHq__errorBox",
  "formButton": "Workouts-module__uvmFHq__formButton",
  "formGrid": "Workouts-module__uvmFHq__formGrid",
  "formGroup": "Workouts-module__uvmFHq__formGroup",
  "formInput": "Workouts-module__uvmFHq__formInput",
  "formLabel": "Workouts-module__uvmFHq__formLabel",
  "formSection": "Workouts-module__uvmFHq__formSection",
  "formSelect": "Workouts-module__uvmFHq__formSelect",
  "formTitle": "Workouts-module__uvmFHq__formTitle",
  "noWorkouts": "Workouts-module__uvmFHq__noWorkouts",
  "pageTitle": "Workouts-module__uvmFHq__pageTitle",
  "required": "Workouts-module__uvmFHq__required",
  "statusCompleted": "Workouts-module__uvmFHq__statusCompleted",
  "statusMissed": "Workouts-module__uvmFHq__statusMissed",
  "statusPending": "Workouts-module__uvmFHq__statusPending",
  "statusRescheduled": "Workouts-module__uvmFHq__statusRescheduled",
  "statusSpan": "Workouts-module__uvmFHq__statusSpan",
  "studentCard": "Workouts-module__uvmFHq__studentCard",
  "studentNameHeader": "Workouts-module__uvmFHq__studentNameHeader",
  "successBox": "Workouts-module__uvmFHq__successBox",
  "table": "Workouts-module__uvmFHq__table",
  "tableData": "Workouts-module__uvmFHq__tableData",
  "tableDataStrong": "Workouts-module__uvmFHq__tableDataStrong",
  "tableHeadRow": "Workouts-module__uvmFHq__tableHeadRow",
  "tableHeader": "Workouts-module__uvmFHq__tableHeader",
  "tableRow": "Workouts-module__uvmFHq__tableRow",
  "tableSection": "Workouts-module__uvmFHq__tableSection",
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
"[project]/pages/dashboard/workouts.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Workouts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/pages/dashboard/Workouts.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
// Opções de Repetições
const repsOptions = [
    "6-8",
    "8-10",
    "10-12",
    "12-15",
    "15-20",
    "20+"
];
// Opções de Dia da Semana
const dayOfWeekOptions = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo"
];
// Opções de Status
const statusOptions = [
    "Pendente",
    "Concluído",
    "Perdido",
    "Reagendado"
];
function Workouts() {
    _s();
    const [workoutLogs, setWorkoutLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [exerciseCategories, setExerciseCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]); // Inicializado como array vazio
    const [exercises, setExercises] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]); // All exercises
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Form states for adding new workout
    const [selectedStudentName, setSelectedStudentName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedBodyPart, setSelectedBodyPart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedExercise, setSelectedExercise] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sets, setSets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [reps, setReps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [dayOfWeek, setDayOfWeek] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(statusOptions[0]);
    // Form states for managing categories and exercises
    const [newCategoryName, setNewCategoryName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newExerciseName, setNewExerciseName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCategoryForNewExercise, setSelectedCategoryForNewExercise] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    // State for editing workouts
    const [editingWorkoutId, setEditingWorkoutId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Fetch Students
    const fetchStudents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Workouts.useCallback[fetchStudents]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/students');
                setStudents(data);
            } catch (err) {
                console.error("Erro ao buscar alunos:", err);
                setError("Erro ao carregar alunos.");
            }
        }
    }["Workouts.useCallback[fetchStudents]"], []);
    // Fetch Workout Logs
    const fetchWorkoutLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Workouts.useCallback[fetchWorkoutLogs]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/workouts');
                setWorkoutLogs(data);
            } catch (err) {
                console.error("Erro ao buscar treinos:", err);
                setError("Erro ao carregar treinos.");
            }
        }
    }["Workouts.useCallback[fetchWorkoutLogs]"], []);
    // Fetch Exercise Categories
    const fetchExerciseCategoriesData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Workouts.useCallback[fetchExerciseCategoriesData]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["fetchExerciseCategories"])();
                // Garante que data é um array antes de definir o estado
                setExerciseCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao buscar categorias de exercícios:", err);
                setError("Erro ao carregar categorias de exercícios.");
                setExerciseCategories([]); // Garante que seja um array vazio em caso de erro
            }
        }
    }["Workouts.useCallback[fetchExerciseCategoriesData]"], []);
    // Fetch Exercises
    const fetchExercises = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Workouts.useCallback[fetchExercises]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/exercises'); // Assuming a route to get all exercises
                // Garante que data é um array antes de definir o estado
                setExercises(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao buscar exercícios:", err);
                setError("Erro ao carregar exercícios.");
                setExercises([]); // Garante que seja um array vazio em caso de erro
            }
        }
    }["Workouts.useCallback[fetchExercises]"], []);
    // Initial data fetch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Workouts.useEffect": ()=>{
            fetchStudents();
            fetchWorkoutLogs();
            fetchExerciseCategoriesData();
            fetchExercises();
        }
    }["Workouts.useEffect"], [
        fetchStudents,
        fetchWorkoutLogs,
        fetchExerciseCategoriesData,
        fetchExercises
    ]);
    // Filter available exercises based on selected body part
    const availableExercisesForSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Workouts.useMemo[availableExercisesForSelection]": ()=>{
            if (!selectedBodyPart || !Array.isArray(exerciseCategories) || !Array.isArray(exercises)) return [];
            const category = exerciseCategories.find({
                "Workouts.useMemo[availableExercisesForSelection].category": (cat)=>cat.name === selectedBodyPart
            }["Workouts.useMemo[availableExercisesForSelection].category"]);
            if (!category) return [];
            return exercises.filter({
                "Workouts.useMemo[availableExercisesForSelection]": (ex)=>ex.category_id === category.id
            }["Workouts.useMemo[availableExercisesForSelection]"]);
        }
    }["Workouts.useMemo[availableExercisesForSelection]"], [
        selectedBodyPart,
        exerciseCategories,
        exercises
    ]);
    // Handle adding a new workout log
    const handleAddWorkoutLog = async (e)=>{
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!selectedStudentName || !selectedBodyPart || !selectedExercise || !sets || !reps || !dayOfWeek || !date || !status) {
            setError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        const student = students.find((s)=>s.name === selectedStudentName);
        if (!student) {
            setError("Aluno não encontrado. Por favor, selecione um aluno existente.");
            return;
        }
        try {
            const newLog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/workouts', {
                method: 'POST',
                body: JSON.stringify({
                    student_id: student.id,
                    body_part: selectedBodyPart,
                    exercise: selectedExercise,
                    sets: parseInt(sets),
                    reps: reps,
                    day_of_week: dayOfWeek,
                    date: date,
                    status: status
                })
            });
            setWorkoutLogs((prevLogs)=>[
                    ...prevLogs,
                    newLog
                ]);
            // Clear form
            setSelectedStudentName('');
            setSelectedBodyPart('');
            setSelectedExercise('');
            setSets('');
            setReps('');
            setDayOfWeek('');
            setDate('');
            setStatus(statusOptions[0]);
            setSuccessMessage("Treino atribuído com sucesso!");
        } catch (err) {
            console.error("Erro ao atribuir treino:", err);
            setError(`Erro ao atribuir treino: ${err.message || 'Verifique os dados.'}`);
        }
    };
    // Handle adding a new exercise category
    const handleAddCategory = async (e)=>{
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!newCategoryName) {
            setError("Por favor, insira o nome da nova categoria.");
            return;
        }
        try {
            const newCategory = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/exercises/categories', {
                method: 'POST',
                body: JSON.stringify({
                    name: newCategoryName
                })
            });
            setExerciseCategories((prev)=>[
                    ...prev,
                    newCategory
                ]);
            setNewCategoryName('');
            setSuccessMessage("Categoria adicionada com sucesso!");
        } catch (err) {
            console.error("Erro ao adicionar categoria:", err);
            setError(`Erro ao adicionar categoria: ${err.message || 'Verifique os dados.'}`);
        }
    };
    // Handle adding a new exercise
    const handleAddExercise = async (e)=>{
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!newExerciseName || !selectedCategoryForNewExercise) {
            setError("Por favor, insira o nome do exercício e selecione uma categoria.");
            return;
        }
        const category = exerciseCategories.find((cat)=>cat.name === selectedCategoryForNewExercise);
        if (!category) {
            setError("Categoria selecionada não encontrada.");
            return;
        }
        try {
            const newExercise = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["requestJson"])('/exercises', {
                method: 'POST',
                body: JSON.stringify({
                    name: newExerciseName,
                    category_id: category.id
                })
            });
            setExercises((prev)=>[
                    ...prev,
                    {
                        ...newExercise,
                        category_name: category.name
                    }
                ]); // Add category_name for display
            setNewExerciseName('');
            setSelectedCategoryForNewExercise('');
            setSuccessMessage("Exercício adicionado com sucesso!");
        } catch (err) {
            console.error("Erro ao adicionar exercício:", err);
            setError(`Erro ao adicionar exercício: ${err.message || 'Verifique os dados.'}`);
        }
    };
    // Handle delete workout
    const handleDeleteWorkout = async (id)=>{
        if (!window.confirm("Tem certeza que deseja deletar este treino?")) {
            return;
        }
        setError(null);
        setSuccessMessage(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["deleteWorkout"])(id);
            setWorkoutLogs((prevLogs)=>prevLogs.filter((log)=>log.id !== id));
            setSuccessMessage("Treino deletado com sucesso!");
        } catch (err) {
            console.error("Erro ao deletar treino:", err);
            setError(`Erro ao deletar treino: ${err.message || 'Tente novamente.'}`);
        }
    };
    // Handle edit click (sets up the form for editing)
    const handleEditClick = (log)=>{
        setEditingWorkoutId(log.id);
        setEditForm({
            student_name: log.student_name,
            body_part: log.body_part,
            exercise: log.exercise,
            sets: log.sets,
            reps: log.reps,
            day_of_week: log.day_of_week,
            date: log.date,
            status: log.status
        });
    };
    // Handle changes in the edit form
    const handleEditFormChange = (e)=>{
        const { name, value } = e.target;
        setEditForm((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    // Handle update workout
    const handleUpdateWorkout = async ()=>{
        setError(null);
        setSuccessMessage(null);
        const student = students.find((s)=>s.name === editForm.student_name);
        if (!student) {
            setError("Aluno não encontrado. Por favor, selecione um aluno existente.");
            return;
        }
        try {
            const updatedLog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["updateWorkout"])(editingWorkoutId, {
                student_id: student.id,
                body_part: editForm.body_part,
                exercise: editForm.exercise,
                sets: parseInt(editForm.sets),
                reps: editForm.reps,
                day_of_week: editForm.day_of_week,
                date: editForm.date,
                status: editForm.status
            });
            setWorkoutLogs((prevLogs)=>prevLogs.map((log)=>log.id === editingWorkoutId ? {
                        ...updatedLog,
                        student_name: student.name
                    } : log));
            setEditingWorkoutId(null);
            setEditForm({});
            setSuccessMessage("Treino atualizado com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar treino:", err);
            setError(`Erro ao atualizar treino: ${err.message || 'Verifique os dados.'}`);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pageTitle,
                children: "🏋️ Gerenciamento de Treinos"
            }, void 0, false, {
                fileName: "[project]/pages/dashboard/workouts.js",
                lineNumber: 294,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorBox,
                children: error
            }, void 0, false, {
                fileName: "[project]/pages/dashboard/workouts.js",
                lineNumber: 296,
                columnNumber: 17
            }, this),
            successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].successBox,
                children: successMessage
            }, void 0, false, {
                fileName: "[project]/pages/dashboard/workouts.js",
                lineNumber: 297,
                columnNumber: 26
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formTitle,
                        children: "Atribuir Novo Treino"
                    }, void 0, false, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleAddWorkoutLog,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "student-name",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: [
                                            "Nome do Aluno ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 304,
                                                columnNumber: 86
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 304,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        list: "students",
                                        id: "student-name",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                        value: selectedStudentName,
                                        onChange: (e)=>setSelectedStudentName(e.target.value),
                                        placeholder: "Selecione ou digite o nome do aluno",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 305,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                        id: "students",
                                        children: students.map((student)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: student.name
                                            }, student.id, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 316,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 314,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "body-part",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: [
                                            "Parte do Corpo ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 322,
                                                columnNumber: 84
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 322,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "body-part",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSelect,
                                        value: selectedBodyPart,
                                        onChange: (e)=>{
                                            setSelectedBodyPart(e.target.value);
                                            setSelectedExercise(''); // Reset exercise when body part changes
                                        },
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Selecione uma parte do corpo"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 333,
                                                columnNumber: 15
                                            }, this),
                                            Array.isArray(exerciseCategories) && exerciseCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: category.name,
                                                    children: category.name
                                                }, category.id, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 335,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 323,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 321,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "exercise",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: [
                                            "Exercício ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 341,
                                                columnNumber: 78
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "exercise",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSelect,
                                        value: selectedExercise,
                                        onChange: (e)=>setSelectedExercise(e.target.value),
                                        required: true,
                                        disabled: !selectedBodyPart,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Selecione um exercício"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 350,
                                                columnNumber: 15
                                            }, this),
                                            Array.isArray(availableExercisesForSelection) && availableExercisesForSelection.map((ex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: ex.name,
                                                    children: ex.name
                                                }, ex.id, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 352,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 340,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "sets",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: [
                                            "Séries ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 358,
                                                columnNumber: 71
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 358,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        id: "sets",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                        value: sets,
                                        onChange: (e)=>setSets(e.target.value),
                                        placeholder: "Ex: 3",
                                        min: "1",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 359,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 357,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "reps",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: [
                                            "Repetições ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 372,
                                                columnNumber: 75
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 372,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "reps",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSelect,
                                        value: reps,
                                        onChange: (e)=>setReps(e.target.value),
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Selecione as repetições"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 380,
                                                columnNumber: 15
                                            }, this),
                                            repsOptions.map((rep)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: rep,
                                                    children: rep
                                                }, rep, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 382,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 373,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 371,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "day-of-week",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: [
                                            "Dia da Semana ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 388,
                                                columnNumber: 85
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 388,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "day-of-week",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSelect,
                                        value: dayOfWeek,
                                        onChange: (e)=>setDayOfWeek(e.target.value),
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Selecione o dia"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 396,
                                                columnNumber: 15
                                            }, this),
                                            dayOfWeekOptions.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: day,
                                                    children: day
                                                }, day, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 398,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 389,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 387,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "date",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: [
                                            "Data ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 404,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 404,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        id: "date",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                        value: date,
                                        onChange: (e)=>setDate(e.target.value),
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 405,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 403,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "status",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: [
                                            "Status ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].required,
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 416,
                                                columnNumber: 73
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 416,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "status",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSelect,
                                        value: status,
                                        onChange: (e)=>setStatus(e.target.value),
                                        required: true,
                                        children: statusOptions.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: s,
                                                children: s
                                            }, s, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 425,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 417,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 415,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formButton,
                                children: "Atribuir Treino"
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 430,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/dashboard/workouts.js",
                lineNumber: 300,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formTitle,
                        children: "Gerenciar Categorias de Exercícios"
                    }, void 0, false, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 436,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleAddCategory,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "new-category-name",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: "Nova Categoria"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 439,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "new-category-name",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                        value: newCategoryName,
                                        onChange: (e)=>setNewCategoryName(e.target.value),
                                        placeholder: "Ex: Peito, Costas",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 440,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 438,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formButton,
                                children: "Adicionar Categoria"
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 450,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 437,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryList,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Categorias Existentes:"
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 453,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: Array.isArray(exerciseCategories) && exerciseCategories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: cat.name
                                    }, cat.id, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 456,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 454,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 452,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/dashboard/workouts.js",
                lineNumber: 435,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formTitle,
                        children: "Gerenciar Exercícios"
                    }, void 0, false, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 464,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleAddExercise,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "new-exercise-name",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: "Nome do Exercício"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 467,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "new-exercise-name",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formInput,
                                        value: newExerciseName,
                                        onChange: (e)=>setNewExerciseName(e.target.value),
                                        placeholder: "Ex: Supino Reto",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 468,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 466,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "exercise-category",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formLabel,
                                        children: "Categoria"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 479,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "exercise-category",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formSelect,
                                        value: selectedCategoryForNewExercise,
                                        onChange: (e)=>setSelectedCategoryForNewExercise(e.target.value),
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Selecione uma categoria"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 487,
                                                columnNumber: 15
                                            }, this),
                                            Array.isArray(exerciseCategories) && exerciseCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: category.name,
                                                    children: category.name
                                                }, category.id, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 489,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 480,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 478,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formButton,
                                children: "Adicionar Exercício"
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 493,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 465,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exerciseList,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Exercícios Existentes:"
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 496,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: Array.isArray(exercises) && exercises.map((ex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            ex.name,
                                            " (",
                                            ex.category_name,
                                            ")"
                                        ]
                                    }, ex.id, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 499,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 497,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 495,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/dashboard/workouts.js",
                lineNumber: 463,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formTitle,
                        children: "Treinos Atribuídos"
                    }, void 0, false, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 507,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].table,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeadRow,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                            children: "Aluno"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/workouts.js",
                                            lineNumber: 511,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                            children: "Parte do Corpo"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/workouts.js",
                                            lineNumber: 512,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                            children: "Exercício"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/workouts.js",
                                            lineNumber: 513,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                            children: "Séries"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/workouts.js",
                                            lineNumber: 514,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                            children: "Repetições"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/workouts.js",
                                            lineNumber: 515,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                            children: "Dia da Semana"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/workouts.js",
                                            lineNumber: 516,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                            children: "Data"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/workouts.js",
                                            lineNumber: 517,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/workouts.js",
                                            lineNumber: 518,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                            children: "Ações"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/workouts.js",
                                            lineNumber: 519,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/workouts.js",
                                    lineNumber: 510,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 509,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: workoutLogs.length > 0 ? workoutLogs.map((log)=>editingWorkoutId === log.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        list: "students-edit",
                                                        name: "student_name",
                                                        value: editForm.student_name,
                                                        onChange: handleEditFormChange,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].editInput
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/workouts.js",
                                                        lineNumber: 528,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                                        id: "students-edit",
                                                        children: students.map((student)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: student.name
                                                            }, student.id, false, {
                                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                                lineNumber: 537,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/workouts.js",
                                                        lineNumber: 535,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 527,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "body_part",
                                                    value: editForm.body_part,
                                                    onChange: handleEditFormChange,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].editSelect,
                                                    children: Array.isArray(exerciseCategories) && exerciseCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: category.name,
                                                            children: category.name
                                                        }, category.id, false, {
                                                            fileName: "[project]/pages/dashboard/workouts.js",
                                                            lineNumber: 549,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 542,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 541,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "exercise",
                                                    value: editForm.exercise,
                                                    onChange: handleEditFormChange,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].editSelect,
                                                    children: Array.isArray(exercises) && exercises.filter((ex)=>ex.category_name === editForm.body_part).map((ex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: ex.name,
                                                            children: ex.name
                                                        }, ex.id, false, {
                                                            fileName: "[project]/pages/dashboard/workouts.js",
                                                            lineNumber: 561,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 554,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 553,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    name: "sets",
                                                    value: editForm.sets,
                                                    onChange: handleEditFormChange,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].editInput
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 566,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 565,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "reps",
                                                    value: editForm.reps,
                                                    onChange: handleEditFormChange,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].editSelect,
                                                    children: repsOptions.map((rep)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: rep,
                                                            children: rep
                                                        }, rep, false, {
                                                            fileName: "[project]/pages/dashboard/workouts.js",
                                                            lineNumber: 582,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 575,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 574,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "day_of_week",
                                                    value: editForm.day_of_week,
                                                    onChange: handleEditFormChange,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].editSelect,
                                                    children: dayOfWeekOptions.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: day,
                                                            children: day
                                                        }, day, false, {
                                                            fileName: "[project]/pages/dashboard/workouts.js",
                                                            lineNumber: 594,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 587,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 586,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    name: "date",
                                                    value: editForm.date,
                                                    onChange: handleEditFormChange,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].editInput
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 599,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 598,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "status",
                                                    value: editForm.status,
                                                    onChange: handleEditFormChange,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].editSelect,
                                                    children: statusOptions.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: s,
                                                            children: s
                                                        }, s, false, {
                                                            fileName: "[project]/pages/dashboard/workouts.js",
                                                            lineNumber: 615,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 608,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 607,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleUpdateWorkout,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionButton,
                                                        children: "Salvar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/workouts.js",
                                                        lineNumber: 620,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setEditingWorkoutId(null),
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionButton,
                                                        children: "Cancelar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/workouts.js",
                                                        lineNumber: 621,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 619,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, log.id, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 526,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                children: log.student_name
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 626,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                children: log.body_part
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 627,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                children: log.exercise
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 628,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                children: log.sets
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 629,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                children: log.reps
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 630,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                children: log.day_of_week
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 631,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                children: log.date
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 632,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableData,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statusSpan} ${log.status === 'Pendente' ? __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statusPending : log.status === 'Concluído' ? __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statusCompleted : log.status === 'Perdido' ? __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statusMissed : __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statusRescheduled}`,
                                                    children: log.status
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/workouts.js",
                                                    lineNumber: 634,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 633,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleEditClick(log),
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionButton,
                                                        children: "Editar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/workouts.js",
                                                        lineNumber: 644,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDeleteWorkout(log.id),
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionButton,
                                                        children: "Deletar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/workouts.js",
                                                        lineNumber: 645,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/dashboard/workouts.js",
                                                lineNumber: 643,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, log.id, true, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 625,
                                        columnNumber: 19
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: "9",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Workouts$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].noWorkouts,
                                        children: error ? 'Os dados do treino estão indisponíveis no momento.' : 'Nenhum treino atribuído ainda.'
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/workouts.js",
                                        lineNumber: 652,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/workouts.js",
                                    lineNumber: 651,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/workouts.js",
                                lineNumber: 522,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/dashboard/workouts.js",
                        lineNumber: 508,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/dashboard/workouts.js",
                lineNumber: 506,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/dashboard/workouts.js",
        lineNumber: 293,
        columnNumber: 5
    }, this);
}
_s(Workouts, "w3zMFdXLVwljR37xPLBxtsJCrGo=");
_c = Workouts;
var _c;
__turbopack_context__.k.register(_c, "Workouts");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/dashboard/workouts.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/dashboard/workouts";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/dashboard/workouts.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/dashboard/workouts.js\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/dashboard/workouts.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0p9.uz9._.js.map