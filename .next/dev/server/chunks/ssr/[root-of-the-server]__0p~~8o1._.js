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
"[project]/pages/dashboard/students.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Students
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardLayout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [ssr] (ecmascript)"); // Import new API functions
;
;
;
;
function Students() {
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [goal, setGoal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // New state for editing
    const [editingStudentId, setEditingStudentId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [editedName, setEditedName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [editedGoal, setEditedGoal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [editedStatus, setEditedStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const fetchStudents = async ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["requestJson"])('/students');
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let isMounted = true;
        fetchStudents().then((data)=>{
            if (isMounted) {
                if (data === null) {
                    setStudents([]);
                    setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
                } else {
                    setStudents(data);
                    setError('');
                }
            }
        }).catch((error)=>{
            console.error("Error fetching students:", error);
            if (isMounted) {
                setStudents([]);
                setError('Unable to load students. Make sure the Flask API is running on port 5000.');
            }
        });
        return ()=>{
            isMounted = false;
        };
    }, []);
    const handleAddStudent = async (e)=>{
        e.preventDefault();
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["requestJson"])('/students', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    goal,
                    status: 'Active'
                })
            });
            setName('');
            setGoal('');
            const updatedStudents = await fetchStudents();
            setStudents(updatedStudents);
            setError('');
        } catch (error) {
            console.error("Error adding student:", error);
            setError('Unable to save the student right now. Check that the Flask API is available and try again.');
        }
    };
    // New: Handle Delete Student
    const handleDeleteStudent = async (id)=>{
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["deleteStudent"])(id);
                const updatedStudents = await fetchStudents();
                setStudents(updatedStudents);
                setError('');
            } catch (error) {
                console.error("Error deleting student:", error);
                setError('Unable to delete the student right now. Check that the Flask API is available and try again.');
            }
        }
    };
    // New: Handle Edit Click
    const handleEditClick = (student)=>{
        setEditingStudentId(student.id);
        setEditedName(student.name);
        setEditedGoal(student.goal);
        setEditedStatus(student.status);
    };
    // New: Handle Save Edit
    const handleSaveEdit = async (id)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["updateStudent"])(id, {
                name: editedName,
                goal: editedGoal,
                status: editedStatus
            });
            setEditingStudentId(null); // Exit editing mode
            setEditedName('');
            setEditedGoal('');
            setEditedStatus('');
            const updatedStudents = await fetchStudents();
            setStudents(updatedStudents);
            setError('');
        } catch (error) {
            console.error("Error updating student:", error);
            setError('Unable to update the student right now. Check that the Flask API is available and try again.');
        }
    };
    // New: Handle Cancel Edit
    const handleCancelEdit = ()=>{
        setEditingStudentId(null);
        setEditedName('');
        setEditedGoal('');
        setEditedStatus('');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardLayout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                style: {
                    color: '#333',
                    marginBottom: '20px'
                },
                children: "Students Management"
            }, void 0, false, {
                fileName: "[project]/pages/dashboard/students.js",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '20px',
                    padding: '14px 16px',
                    backgroundColor: '#fff1f0',
                    color: '#a8071a',
                    border: '1px solid #ffa39e',
                    borderRadius: '8px'
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/pages/dashboard/students.js",
                lineNumber: 120,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '30px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        style: {
                            marginTop: 0,
                            color: '#555'
                        },
                        children: "Add New Student"
                    }, void 0, false, {
                        fileName: "[project]/pages/dashboard/students.js",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleAddStudent,
                        style: {
                            display: 'flex',
                            gap: '10px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Student Name",
                                value: name,
                                onChange: (e)=>setName(e.target.value),
                                required: true,
                                style: {
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    flexGrow: 1
                                }
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/students.js",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Goal (e.g., Weight Loss)",
                                value: goal,
                                onChange: (e)=>setGoal(e.target.value),
                                required: true,
                                style: {
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    flexGrow: 1
                                }
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/students.js",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "submit",
                                style: {
                                    padding: '10px 20px',
                                    backgroundColor: '#0070f3',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                },
                                children: "+ Add Student"
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/students.js",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/dashboard/students.js",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/dashboard/students.js",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    style: {
                        width: '100%',
                        textAlign: 'left',
                        borderCollapse: 'collapse'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                style: {
                                    borderBottom: '2px solid #eee'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        style: {
                                            padding: '12px 10px',
                                            color: '#666'
                                        },
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/students.js",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        style: {
                                            padding: '12px 10px',
                                            color: '#666'
                                        },
                                        children: "Goal"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/students.js",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        style: {
                                            padding: '12px 10px',
                                            color: '#666'
                                        },
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/students.js",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        style: {
                                            padding: '12px 10px',
                                            color: '#666',
                                            width: '150px'
                                        },
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/dashboard/students.js",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, this),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/dashboard/students.js",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/students.js",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: students.length > 0 ? students.map((student)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    style: {
                                        borderBottom: '1px solid #eee'
                                    },
                                    children: editingStudentId === student.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                style: {
                                                    padding: '12px 10px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editedName,
                                                    onChange: (e)=>setEditedName(e.target.value),
                                                    style: {
                                                        padding: '8px',
                                                        borderRadius: '5px',
                                                        border: '1px solid #ccc',
                                                        width: '100%'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/students.js",
                                                    lineNumber: 151,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/students.js",
                                                lineNumber: 150,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                style: {
                                                    padding: '12px 10px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editedGoal,
                                                    onChange: (e)=>setEditedGoal(e.target.value),
                                                    style: {
                                                        padding: '8px',
                                                        borderRadius: '5px',
                                                        border: '1px solid #ccc',
                                                        width: '100%'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/students.js",
                                                    lineNumber: 159,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/students.js",
                                                lineNumber: 158,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                style: {
                                                    padding: '12px 10px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: editedStatus,
                                                    onChange: (e)=>setEditedStatus(e.target.value),
                                                    style: {
                                                        padding: '8px',
                                                        borderRadius: '5px',
                                                        border: '1px solid #ccc',
                                                        width: '100%'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "Active",
                                                            children: "Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard/students.js",
                                                            lineNumber: 172,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "Inactive",
                                                            children: "Inactive"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard/students.js",
                                                            lineNumber: 173,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard/students.js",
                                                    lineNumber: 167,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/students.js",
                                                lineNumber: 166,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                style: {
                                                    padding: '12px 10px',
                                                    display: 'flex',
                                                    gap: '5px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleSaveEdit(student.id),
                                                        style: {
                                                            padding: '8px 12px',
                                                            backgroundColor: '#52c41a',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85em'
                                                        },
                                                        children: "Save"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/students.js",
                                                        lineNumber: 177,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: handleCancelEdit,
                                                        style: {
                                                            padding: '8px 12px',
                                                            backgroundColor: '#f5222d',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85em'
                                                        },
                                                        children: "Cancel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/students.js",
                                                        lineNumber: 183,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/dashboard/students.js",
                                                lineNumber: 176,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                style: {
                                                    padding: '12px 10px',
                                                    fontWeight: '500'
                                                },
                                                children: student.name
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/students.js",
                                                lineNumber: 193,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                style: {
                                                    padding: '12px 10px',
                                                    color: '#555'
                                                },
                                                children: student.goal
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/students.js",
                                                lineNumber: 194,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                style: {
                                                    padding: '12px 10px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        backgroundColor: student.status === 'Active' ? '#e6ffed' : '#fff1f0',
                                                        color: student.status === 'Active' ? '#389e0d' : '#cf1322',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.85em',
                                                        fontWeight: 'bold'
                                                    },
                                                    children: student.status
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard/students.js",
                                                    lineNumber: 196,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/dashboard/students.js",
                                                lineNumber: 195,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                style: {
                                                    padding: '12px 10px',
                                                    display: 'flex',
                                                    gap: '5px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleEditClick(student),
                                                        style: {
                                                            padding: '8px 12px',
                                                            backgroundColor: '#1890ff',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85em'
                                                        },
                                                        children: "Edit"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/students.js",
                                                        lineNumber: 201,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDeleteStudent(student.id),
                                                        style: {
                                                            padding: '8px 12px',
                                                            backgroundColor: '#f5222d',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85em'
                                                        },
                                                        children: "Delete"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/dashboard/students.js",
                                                        lineNumber: 207,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/dashboard/students.js",
                                                lineNumber: 200,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, student.id, false, {
                                    fileName: "[project]/pages/dashboard/students.js",
                                    lineNumber: 147,
                                    columnNumber: 17
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    colSpan: "4",
                                    style: {
                                        padding: '20px 10px',
                                        color: '#999',
                                        textAlign: 'center'
                                    },
                                    children: [
                                        " ",
                                        error ? 'Student data is currently unavailable.' : 'No students found yet.'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard/students.js",
                                    lineNumber: 220,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard/students.js",
                                lineNumber: 219,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/dashboard/students.js",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/dashboard/students.js",
                    lineNumber: 135,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/dashboard/students.js",
                lineNumber: 134,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/dashboard/students.js",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0p~~8o1._.js.map