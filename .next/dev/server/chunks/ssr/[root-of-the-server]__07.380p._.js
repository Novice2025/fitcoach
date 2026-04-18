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
"[project]/pages/dashboard/Weight.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/pages/dashboard/weight.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Weight
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/pages/dashboard/Weight.module.css [ssr] (css module)"); // Importa o CSS específico para esta página
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [ssr] (ecmascript)");
;
;
;
;
;
function Weight() {
    const [weightLogs, setWeightLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]); // Para o dropdown de alunos
    const [selectedStudentName, setSelectedStudentName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [weight, setWeight] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // Novos estados para as medidas corporais
    const [chest, setChest] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [quadril, setQuadril] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [braco, setBraco] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [perna, setPerna] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // Novo estado para a seleção de mês
    const [selectedMonth, setSelectedMonth] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [successMessage, setSuccessMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
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
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["requestJson"])('/students');
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
    const fetchWeightLogs = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["requestJson"])('/weightlogs');
            if (data === null) {
                setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
                setWeightLogs([]);
                return;
            }
            // Filtra por mês se um mês estiver selecionado
            const filteredData = selectedMonth ? data.filter((log)=>new Date(log.date).getMonth() + 1 === parseInt(selectedMonth)) : data;
            // Ordena os logs por data (mais recente primeiro) e nome do aluno
            const sortedLogs = filteredData.sort((a, b)=>{
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA < dateB) return 1;
                if (dateA > dateB) return -1;
                return a.student_name.localeCompare(b.student_name);
            });
            setWeightLogs(sortedLogs);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar registros de peso:", err);
            setError("Erro ao carregar registros de peso. Verifique o backend.");
            setWeightLogs([]);
        }
    }, [
        selectedMonth
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchStudents().catch((err)=>console.error('Error fetching students:', err));
        fetchWeightLogs().catch((err)=>console.error('Error fetching weight logs:', err));
    }, [
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
            const newLog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["requestJson"])('/weightlogs', {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageTitle,
                    children: "Gerenciamento de Peso e Medidas"
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/weight.js",
                    lineNumber: 136,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].errorBox,
                    children: error
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/weight.js",
                    lineNumber: 138,
                    columnNumber: 19
                }, this),
                successMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].successBox,
                    children: successMessage
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard/weight.js",
                    lineNumber: 139,
                    columnNumber: 28
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formSection,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formTitle,
                            children: "Registrar Novo Peso e Medidas"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/weight.js",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                            onSubmit: handleAddWeightLog,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGrid,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "student-name-select",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Nome do Aluno ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].required,
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "student-name-select",
                                            type: "text",
                                            list: "students-list",
                                            value: selectedStudentName,
                                            onChange: (e)=>setSelectedStudentName(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                            placeholder: "Selecione ou digite o nome do aluno",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 148,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("datalist", {
                                            id: "students-list",
                                            children: students.map((student)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "weight-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Peso (kg) ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].required,
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "weight-input",
                                            type: "number",
                                            step: "0.1",
                                            value: weight,
                                            onChange: (e)=>setWeight(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "date-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: [
                                                "Data ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].required,
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "date-input",
                                            type: "date",
                                            value: date,
                                            onChange: (e)=>setDate(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "chest-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Peito (cm)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 197,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "chest-input",
                                            type: "number",
                                            step: "0.1",
                                            value: chest,
                                            onChange: (e)=>setChest(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "quadril-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Quadril (cm)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 212,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "quadril-input",
                                            type: "number",
                                            step: "0.1",
                                            value: quadril,
                                            onChange: (e)=>setQuadril(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "braco-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Braço (cm)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 227,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "braco-input",
                                            type: "number",
                                            step: "0.1",
                                            value: braco,
                                            onChange: (e)=>setBraco(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            htmlFor: "perna-input",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                            children: "Perna (cm)"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard/weight.js",
                                            lineNumber: 242,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            id: "perna-input",
                                            type: "number",
                                            step: "0.1",
                                            value: perna,
                                            onChange: (e)=>setPerna(e.target.value),
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formInput,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formButton,
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableSection,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formTitle,
                            children: "Registros de Peso e Medidas"
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/weight.js",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].monthFilter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    htmlFor: "month-select",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                    children: "Filtrar por Mês:"
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard/weight.js",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                    id: "month-select",
                                    value: selectedMonth,
                                    onChange: (e)=>setSelectedMonth(e.target.value),
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].formSelect,
                                    children: months.map((month)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].table,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeadRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Aluno"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Peso (kg)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 283,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Peito (cm)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 284,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Quadril (cm)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 285,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Braço (cm)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 286,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                                                children: "Perna (cm)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/weight.js",
                                                lineNumber: 287,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: weightLogs.length > 0 ? weightLogs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableRow,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData} ${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableDataStrong}`,
                                                    children: log.student_name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 295,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.weight
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 296,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.chest || '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 297,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.quadril || '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 298,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.braco || '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 299,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
                                                    children: log.perna || '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/weight.js",
                                                    lineNumber: 300,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tableData,
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
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            colSpan: "7",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$dashboard$2f$Weight$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].noWeightLogs,
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
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__07.380p._.js.map