module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/components/DashboardLayout.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/components/DashboardLayout.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)"); // Adicionado React import para consistência, embora não estritamente necessário para useState em Next.js 13+
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$prop$2d$types__$5b$external$5d$__$28$prop$2d$types$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$prop$2d$types$29$__ = __turbopack_context__.i("[externals]/prop-types [external] (prop-types, cjs, [project]/node_modules/prop-types)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout.module.css [ssr] (css module)"); // Importa o módulo CSS
;
;
;
;
;
;
function DashboardLayout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [mobileNavOpen, setMobileNavOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sidebar} ${mobileNavOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sidebarOpen : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sidebarHeader,
                        children: "FitCoach"
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardLayout.js",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mobileMenuButton,
                        onClick: ()=>setMobileNavOpen((open)=>!open),
                        "aria-expanded": mobileNavOpen,
                        "aria-controls": "dashboard-navigation",
                        children: mobileNavOpen ? 'Fechar' : 'Menu'
                    }, void 0, false, {
                        fileName: "[project]/components/DashboardLayout.js",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                            id: "dashboard-navigation",
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navList} ${mobileNavOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navListOpen : ''}`,
                            children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navItem,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.path,
                                        // Lógica de classe ativa ajustada
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navLink} ${item.path === '/dashboard' && router.pathname === '/dashboard' || item.path !== '/dashboard' && router.pathname.startsWith(item.path) ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].active : ''}`,
                                        onClick: handleNavClick,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navIcon,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mainContent,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].header,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].headerTitle,
                                children: getHeaderTitle()
                            }, void 0, false, {
                                fileName: "[project]/components/DashboardLayout.js",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].logoutButton,
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
DashboardLayout.propTypes = {
    children: __TURBOPACK__imported__module__$5b$externals$5d2f$prop$2d$types__$5b$external$5d$__$28$prop$2d$types$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$prop$2d$types$29$__["default"].node.isRequired
};
}),
"[project]/pages/dashboard/Schedule.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionSelect": "Schedule-module__y1sFCG__actionSelect",
  "container": "Schedule-module__y1sFCG__container",
  "editObservationButton": "Schedule-module__y1sFCG__editObservationButton",
  "errorBox": "Schedule-module__y1sFCG__errorBox",
  "formButton": "Schedule-module__y1sFCG__formButton",
  "formGrid": "Schedule-module__y1sFCG__formGrid",
  "formGroup": "Schedule-module__y1sFCG__formGroup",
  "formInput": "Schedule-module__y1sFCG__formInput",
  "formLabel": "Schedule-module__y1sFCG__formLabel",
  "formSection": "Schedule-module__y1sFCG__formSection",
  "formSelect": "Schedule-module__y1sFCG__formSelect",
  "formTitle": "Schedule-module__y1sFCG__formTitle",
  "noSessions": "Schedule-module__y1sFCG__noSessions",
  "pageTitle": "Schedule-module__y1sFCG__pageTitle",
  "required": "Schedule-module__y1sFCG__required",
  "statusCompleted": "Schedule-module__y1sFCG__statusCompleted",
  "statusMissed": "Schedule-module__y1sFCG__statusMissed",
  "statusRescheduled": "Schedule-module__y1sFCG__statusRescheduled",
  "statusScheduled": "Schedule-module__y1sFCG__statusScheduled",
  "statusSpan": "Schedule-module__y1sFCG__statusSpan",
  "successBox": "Schedule-module__y1sFCG__successBox",
  "table": "Schedule-module__y1sFCG__table",
  "tableData": "Schedule-module__y1sFCG__tableData",
  "tableDataStrong": "Schedule-module__y1sFCG__tableDataStrong",
  "tableHeadRow": "Schedule-module__y1sFCG__tableHeadRow",
  "tableHeader": "Schedule-module__y1sFCG__tableHeader",
  "tableRow": "Schedule-module__y1sFCG__tableRow",
  "tableSection": "Schedule-module__y1sFCG__tableSection",
});
}),
"[project]/lib/api.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/pages/dashboard/schedule.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Schedule
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/pages/dashboard/Schedule.module.css [ssr] (css module)"); // Importa o módulo CSS
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [ssr] (ecmascript)");
;
;
;
;
;
function Schedule() {
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]); // Para o dropdown de alunos
    const [selectedStudentName, setSelectedStudentName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('Agendado'); // Novo: Status padrão para novas sessões
    const [observation, setObservation] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(''); // Novo: Campo de observação
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // Opções de Status para o dropdown
    const statusOptions = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>[
            'Agendado',
            'Concluído',
            'Perdido',
            'Reagendado'
        ], []);
    const fetchSchedule = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        try {
            // CORREÇÃO AQUI: Alterado de '/schedule' para '/schedules'
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["requestJson"])('/schedules');
            setError(null);
            return data;
        } catch (err) {
            console.error("Erro ao buscar agendamentos:", err);
            setError('Não foi possível carregar os agendamentos. Verifique o backend.');
            return [];
        }
    }, []);
    const fetchStudents = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["requestJson"])('/students');
            setError(null);
            return data;
        } catch (err) {
            console.error("Erro ao buscar alunos:", err);
            setError('Não foi possível carregar a lista de alunos.');
            return [];
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let isMounted = true;
        const loadData = async ()=>{
            try {
                const [scheduleData, studentsData] = await Promise.all([
                    fetchSchedule(),
                    fetchStudents()
                ]);
                if (scheduleData === null || studentsData === null) {
                    if (isMounted) {
                        setSessions([]);
                        setStudents([]);
                        setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
                    }
                    return;
                }
                if (isMounted) {
                    setSessions(scheduleData);
                    setStudents(studentsData);
                    setError(null);
                }
            } catch (_err) {
                // Erro já tratado nas funções fetch, apenas loga aqui se necessário
                console.error("Erro geral ao carregar dados:", _err);
                if (isMounted) {
                    setSessions([]);
                    setStudents([]);
                }
            }
        };
        loadData();
        return ()=>{
            isMounted = false;
        };
    }, [
        fetchSchedule,
        fetchStudents
    ]); // Dependências para useCallback
    const handleAddSession = async (e)=>{
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!selectedStudentName || !date || !time) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        try {
            // CORREÇÃO AQUI: Alterado de '/schedule' para '/schedules'
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["requestJson"])('/schedules', {
                method: 'POST',
                body: JSON.stringify({
                    student_name: selectedStudentName,
                    date,
                    time,
                    status,
                    observation
                })
            });
            // Limpa o formulário
            setSelectedStudentName('');
            setDate('');
            setTime('');
            setStatus('Agendado'); // Reseta para o padrão
            setObservation('');
            const updatedSessions = await fetchSchedule();
            setSessions(updatedSessions);
            setSuccessMessage('Sessão agendada com sucesso!');
        } catch (_err) {
            console.error('Erro ao adicionar sessão:', _err);
            setError('Não foi possível salvar a sessão agora. Verifique se a API Flask está disponível e tente novamente.');
        }
    };
    const handleUpdateSession = async (sessionId, newStatus, newObservation)=>{
        setError(null);
        setSuccessMessage(null);
        try {
            // CORREÇÃO AQUI: Alterado de '/schedule/${sessionId}' para '/schedules/${sessionId}'
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["requestJson"])(`/schedules/${sessionId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    status: newStatus,
                    observation: newObservation
                })
            });
            const updatedSessions = await fetchSchedule();
            setSessions(updatedSessions);
            setSuccessMessage('Status da sessão atualizado com sucesso!');
        } catch (_err) {
            console.error('Erro ao atualizar status da sessão:', _err);
            setError('Não foi possível atualizar o status da sessão. Tente novamente.');
        }
    };
    // Ordena as sessões por data e hora
    const sortedSessions = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return [
            ...sessions
        ].sort((a, b)=>{
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });
    }, [
        sessions
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageTitle,
                    children: "📅 Gerenciamento de Agendamentos"
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/schedule.js",
                    lineNumber: 154,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].errorBox,
                    children: error
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/schedule.js",
                    lineNumber: 157,
                    columnNumber: 11
                }, this),
                successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].successBox,
                    children: successMessage
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/schedule.js",
                    lineNumber: 163,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formSection,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formTitle,
                            children: "Agendar Nova Sessão"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/schedule.js",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                            onSubmit: handleAddSession,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGrid,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "student-name",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Nome do Aluno ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].required,
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 173,
                                                    columnNumber: 31
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 172,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "student-name",
                                            type: "text",
                                            list: "students-list",
                                            placeholder: "Nome do Aluno",
                                            value: selectedStudentName,
                                            onChange: (e)=>setSelectedStudentName(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 175,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("datalist", {
                                            id: "students-list",
                                            children: students.map((student)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: student.name
                                                }, student.id, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 187,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 185,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/schedule.js",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "date",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Data ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].required,
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 194,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 193,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "date",
                                            type: "date",
                                            value: date,
                                            onChange: (e)=>setDate(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 196,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/schedule.js",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "time",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Hora ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].required,
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 208,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 207,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "time",
                                            type: "time",
                                            value: time,
                                            onChange: (e)=>setTime(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 210,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/schedule.js",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "status",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Status Inicial"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 221,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                            id: "status",
                                            value: status,
                                            onChange: (e)=>setStatus(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formSelect,
                                            children: statusOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: option,
                                                    children: option
                                                }, option, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 231,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 224,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/schedule.js",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "observation",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Observação"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 237,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                            id: "observation",
                                            value: observation,
                                            onChange: (e)=>setObservation(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                            rows: "2",
                                            placeholder: "Adicione uma observação (ex: motivo do reagendamento)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 240,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/schedule.js",
                                    lineNumber: 236,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formButton,
                                    children: "+ Agendar"
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/schedule.js",
                                    lineNumber: 250,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard/schedule.js",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard/schedule.js",
                    lineNumber: 168,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableSection,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formTitle,
                            children: "Sessões Agendadas"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/schedule.js",
                            lineNumber: 255,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].table,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeadRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Aluno"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/schedule.js",
                                                lineNumber: 259,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Data"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/schedule.js",
                                                lineNumber: 260,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Hora"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/schedule.js",
                                                lineNumber: 261,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/schedule.js",
                                                lineNumber: 262,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Observação"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/schedule.js",
                                                lineNumber: 263,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Ações"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/schedule.js",
                                                lineNumber: 264,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/dashboard/schedule.js",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/schedule.js",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: sortedSessions.length > 0 ? sortedSessions.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableRow,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData} ${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableDataStrong}`,
                                                    children: s.student_name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 271,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: s.date
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 272,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: s.time
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 273,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].statusSpan} ${s.status === 'Agendado' ? __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].statusScheduled : s.status === 'Concluído' ? __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].statusCompleted : s.status === 'Perdido' ? __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].statusMissed : __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].statusRescheduled}`,
                                                        children: s.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/schedule.js",
                                                        lineNumber: 275,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 274,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: s.observation || '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 284,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                            value: s.status,
                                                            onChange: (e)=>handleUpdateSession(s.id, e.target.value, s.observation),
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].actionSelect,
                                                            children: statusOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                    value: option,
                                                                    children: option
                                                                }, option, false, {
                                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                                    lineNumber: 292,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard/schedule.js",
                                                            lineNumber: 286,
                                                            columnNumber: 23
                                                        }, this),
                                                        s.status === 'Reagendado' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                const newObservation = prompt("Adicionar/Editar observação para reagendamento:", s.observation || '');
                                                                if (newObservation !== null) {
                                                                    handleUpdateSession(s.id, s.status, newObservation);
                                                                }
                                                            },
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].editObservationButton,
                                                            children: "Obs"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard/schedule.js",
                                                            lineNumber: 296,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard/schedule.js",
                                                    lineNumber: 285,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, s.id, true, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 270,
                                            columnNumber: 19
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            colSpan: "6",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Schedule$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].noSessions,
                                            children: error ? 'Os dados de agendamento estão indisponíveis no momento.' : 'Nenhuma sessão agendada ainda.'
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/schedule.js",
                                            lineNumber: 313,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/schedule.js",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/schedule.js",
                                    lineNumber: 267,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard/schedule.js",
                            lineNumber: 256,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard/schedule.js",
                    lineNumber: 254,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/dashboard/schedule.js",
            lineNumber: 153,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/dashboard/schedule.js",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0w.aw5i._.js.map