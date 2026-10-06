/* =========================================================
   HOSTEL MANAGEMENT SYSTEM
   FRONTEND JAVASCRIPT
   ========================================================= */


/* =========================================================
   DEMO DATA
   ========================================================= */

let currentUser = null;
let authToken = localStorage.getItem("hmsToken");

let currentPage = "dashboard";

let editingId = null;

let currentModuleData = [];
let mealDemandDays = [];

let data = {

    students: [

        {
            id: 1,
            name: "Arun Kumar",
            rollNo: "IT2026001",
            department: "Information Technology",
            year: 3,
            phone: "9876543210",
            guardian: "Kumar",
            guardianPhone: "9876500000"
        },

        {
            id: 2,
            name: "Priya S",
            rollNo: "CSE2026002",
            department: "Computer Science",
            year: 2,
            phone: "9876543211",
            guardian: "Suresh",
            guardianPhone: "9876500001"
        },

        {
            id: 3,
            name: "Rahul M",
            rollNo: "ECE2026003",
            department: "Electronics",
            year: 3,
            phone: "9876543212",
            guardian: "Mani",
            guardianPhone: "9876500002"
        },

        {
            id: 4,
            name: "Divya R",
            rollNo: "IT2026004",
            department: "Information Technology",
            year: 2,
            phone: "9876543213",
            guardian: "Ramesh",
            guardianPhone: "9876500003"
        }

    ],


    rooms: [

        {
            id: 1,
            block: "A",
            floor: 1,
            room: "101",
            type: "Double",
            capacity: 2,
            occupied: 2,
            status: "Occupied"
        },

        {
            id: 2,
            block: "A",
            floor: 1,
            room: "102",
            type: "Triple",
            capacity: 3,
            occupied: 2,
            status: "Available"
        },

        {
            id: 3,
            block: "A",
            floor: 2,
            room: "201",
            type: "Single",
            capacity: 1,
            occupied: 1,
            status: "Occupied"
        },

        {
            id: 4,
            block: "B",
            floor: 1,
            room: "101",
            type: "Double",
            capacity: 2,
            occupied: 0,
            status: "Available"
        },

        {
            id: 5,
            block: "B",
            floor: 2,
            room: "201",
            type: "Triple",
            capacity: 3,
            occupied: 0,
            status: "Available"
        }

    ],


    allocation: [

        {
            id: 1,
            student: "Arun Kumar",
            rollNo: "IT2026001",
            room: "A-101",
            allocatedOn: "2026-06-10",
            status: "Active"
        },

        {
            id: 2,
            student: "Priya S",
            rollNo: "CSE2026002",
            room: "A-101",
            allocatedOn: "2026-06-12",
            status: "Active"
        },

        {
            id: 3,
            student: "Rahul M",
            rollNo: "ECE2026003",
            room: "A-201",
            allocatedOn: "2026-06-15",
            status: "Active"
        }

    ],


    fees: [

        {
            id: 1,
            student: "Arun Kumar",
            rollNo: "IT2026001",
            fee: "Hostel Semester Fee",
            total: 45000,
            paid: 20000,
            pending: 25000,
            status: "Pending"
        },

        {
            id: 2,
            student: "Priya S",
            rollNo: "CSE2026002",
            fee: "Hostel Semester Fee",
            total: 45000,
            paid: 45000,
            pending: 0,
            status: "Paid"
        },

        {
            id: 3,
            student: "Rahul M",
            rollNo: "ECE2026003",
            fee: "Hostel Semester Fee",
            total: 45000,
            paid: 30000,
            pending: 15000,
            status: "Pending"
        },

        {
            id: 4,
            student: "Divya R",
            rollNo: "IT2026004",
            fee: "Hostel Semester Fee",
            total: 45000,
            paid: 15000,
            pending: 30000,
            status: "Pending"
        }

    ],


    mess: [

        {
            id: 1,
            date: "2026-10-05",
            breakfast: "Idli + Sambar",
            lunch: "Rice + Sambar + Poriyal",
            snacks: "Tea + Biscuit",
            dinner: "Chapati + Kurma"
        },

        {
            id: 2,
            date: "2026-10-06",
            breakfast: "Dosa + Chutney",
            lunch: "Veg Rice + Raita",
            snacks: "Coffee + Vada",
            dinner: "Rice + Dal + Egg"
        }

    ],


    visitors: [

        {
            id: 1,
            visitor: "Suresh Kumar",
            student: "Arun Kumar",
            relation: "Father",
            purpose: "Personal Visit",
            entry: "10:30 AM",
            exit: "12:00 PM",
            status: "Exited"
        },

        {
            id: 2,
            visitor: "Priya Mother",
            student: "Priya S",
            relation: "Mother",
            purpose: "Personal Visit",
            entry: "02:00 PM",
            exit: "-",
            status: "Inside"
        }

    ],


    complaints: [

        {
            id: 1,
            student: "Arun Kumar",
            title: "Bathroom tap leakage",
            category: "Plumbing",
            priority: "High",
            date: "2026-10-03",
            status: "Open"
        },

        {
            id: 2,
            student: "Priya S",
            title: "Fan not working",
            category: "Electrical",
            priority: "Medium",
            date: "2026-10-02",
            status: "In Progress"
        },

        {
            id: 3,
            student: "Rahul M",
            title: "Room light problem",
            category: "Electrical",
            priority: "Low",
            date: "2026-09-30",
            status: "Resolved"
        }

    ],


    leave: [

        {
            id: 1,
            student: "Arun Kumar",
            from: "2026-10-07",
            to: "2026-10-09",
            reason: "Family function",
            applied: "2026-10-04",
            status: "Pending"
        },

        {
            id: 2,
            student: "Priya S",
            from: "2026-10-10",
            to: "2026-10-11",
            reason: "Personal work",
            applied: "2026-10-04",
            status: "Approved"
        }

    ]

};


/* =========================================================
   MODULE CONFIGURATION
   ========================================================= */

const moduleConfig = {

    students: {

        title: "Students",

        description:
            "Manage hostel students and resident information.",

        fields: [

            ["name", "Student Name", "text", true],

            ["rollNo", "Roll Number", "text", true],

            ["department", "Department", "text", true],

            ["year", "Year", "number", true],

            ["phone", "Phone Number", "tel", true],

            ["guardian", "Guardian Name", "text", true],

            ["guardianPhone", "Guardian Phone", "tel", true]

        ],

        columns: [

            ["name", "Student"],

            ["rollNo", "Roll No"],

            ["department", "Department"],

            ["year", "Year"],

            ["phone", "Phone"],

            ["guardian", "Guardian"]

        ]

    },


    rooms: {

        title: "Room Management",

        description:
            "Manage blocks, floors, rooms and capacity.",

        fields: [

            ["block", "Block", "text", true],

            ["floor", "Floor", "number", true],

            ["room", "Room Number", "text", true],

            ["type", "Room Type", "select", true, [
                "Single",
                "Double",
                "Triple",
                "Four Sharing"
            ]],

            ["capacity", "Capacity", "number", true]

        ],

        columns: [

            ["block", "Block"],

            ["floor", "Floor"],

            ["room", "Room"],

            ["type", "Type"],

            ["capacity", "Capacity"],

            ["occupied", "Occupied"],

            ["status", "Status"]

        ]

    },


    allocation: {

        title: "Room Allocation",

        description:
            "Allocate, transfer or vacate students.",

        fields: [

            ["student", "Student Name", "text", true],

            ["rollNo", "Roll Number", "text", true],

            ["room", "Room", "text", true],

            ["allocatedOn", "Allocation Date", "date", true]

        ],

        columns: [

            ["student", "Student"],

            ["rollNo", "Roll No"],

            ["room", "Room"],

            ["allocatedOn", "Allocated On"],

            ["status", "Status"]

        ]

    },


    fees: {

        title: "Fee Management",

        description:
            "Track hostel fees, payments and pending dues.",

        fields: [

            ["student", "Student", "text", true],

            ["rollNo", "Roll Number", "text", true],

            ["fee", "Fee Type", "text", true],

            ["total", "Total Amount", "number", true],

            ["paid", "Paid Amount", "number", true]

        ],

        columns: [

            ["student", "Student"],

            ["rollNo", "Roll No"],

            ["fee", "Fee"],

            ["total", "Total"],

            ["paid", "Paid"],

            ["pending", "Pending"],

            ["status", "Status"]

        ]

    },


    mess: {

        title: "Mess Management",

        description:
            "Manage daily mess menus and meals.",

        fields: [

            ["date", "Date", "date", true],

            ["breakfast", "Breakfast", "text", true],

            ["lunch", "Lunch", "text", true],

            ["snacks", "Snacks", "text", true],

            ["dinner", "Dinner", "text", true]

        ],

        columns: [

            ["date", "Date"],

            ["breakfast", "Breakfast"],

            ["lunch", "Lunch"],

            ["snacks", "Snacks"],

            ["dinner", "Dinner"]

        ]

    },


    visitors: {

        title: "Visitor Log",

        description:
            "Track visitor entry and exit records.",

        fields: [

            ["visitor", "Visitor Name", "text", true],

            ["student", "Student", "text", true],

            ["relation", "Relation", "text", true],

            ["purpose", "Purpose", "text", true],

            ["entry", "Entry Time", "text", true]

        ],

        columns: [

            ["visitor", "Visitor"],

            ["student", "Student"],

            ["relation", "Relation"],

            ["purpose", "Purpose"],

            ["entry", "Entry"],

            ["exit", "Exit"],

            ["status", "Status"]

        ]

    },


    complaints: {

        title: "Complaints & Maintenance",

        description:
            "Manage student complaints and maintenance requests.",

        fields: [

            ["student", "Student", "text", true],

            ["title", "Complaint", "text", true],

            ["category", "Category", "select", true, [
                "Electrical",
                "Plumbing",
                "Cleaning",
                "Furniture",
                "Internet",
                "Other"
            ]],

            ["priority", "Priority", "select", true, [
                "Low",
                "Medium",
                "High"
            ]]

        ],

        columns: [

            ["student", "Student"],

            ["title", "Complaint"],

            ["category", "Category"],

            ["priority", "Priority"],

            ["date", "Date"],

            ["status", "Status"]

        ]

    },


    leave: {

        title: "Leave / Out-pass",

        description:
            "Review and approve student leave requests.",

        fields: [

            ["student", "Student", "text", true],

            ["from", "From Date", "date", true],

            ["to", "To Date", "date", true],

            ["reason", "Reason", "text", true]

        ],

        columns: [

            ["student", "Student"],

            ["from", "From"],

            ["to", "To"],

            ["reason", "Reason"],

            ["applied", "Applied"],

            ["status", "Status"]

        ]

    }

};


/* =========================================================
   LOGIN
   ========================================================= */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const username =
                document.getElementById("username")
                    .value
                    .trim();

            const password =
                document.getElementById("password")
                    .value;

            try {
                const result = await api("/api/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ username, password })
                });
                authToken = result.token;
                currentUser = result.user;
                localStorage.setItem("hmsToken", authToken);
                await showApplication();
                showToast("Login successful.", "success");
            } catch (error) {
                showToast(error.message || "Unable to sign in.", "danger");
            }

        }
    );


/* =========================================================
   PASSWORD
   ========================================================= */

function togglePassword() {

    const input =
        document.getElementById("password");

    const icon =
        document.getElementById("eyeIcon");


    if (input.type === "password") {

        input.type = "text";

        icon.className =
            "bi bi-eye-slash";

    } else {

        input.type = "password";

        icon.className =
            "bi bi-eye";

    }

}


/* =========================================================
   SHOW APPLICATION
   ========================================================= */

async function showApplication() {

    document.getElementById("appPage").dataset.role = currentUser.role.toLowerCase();

    document
        .getElementById("loginPage")
        .classList.add("d-none");

    document
        .getElementById("appPage")
        .classList.remove("d-none");


    document
        .getElementById("loggedUser")
        .textContent =
        currentUser.name;

    document
        .getElementById("topUsername")
        .textContent =
        currentUser.name;

    document
        .getElementById("welcomeName")
        .textContent =
        currentUser.name;

    document
        .getElementById("loggedRole")
        .textContent =
        currentUser.role;


    updateDate();

    try {
        const result = await api("/api/data");
        data = result.data;
        loadDashboard();
    } catch (error) {
        showToast(error.message || "Could not load hostel records.", "danger");
        logout();
    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    localStorage.removeItem("hmsToken");
    authToken = null;

    currentUser = null;

    document
        .getElementById("appPage")
        .classList.add("d-none");

    document
        .getElementById("loginPage")
        .classList.remove("d-none");

    document.getElementById("password").value = "";

}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

document
    .querySelectorAll(".nav-link")
    .forEach(
        link => {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const page =
                        this.dataset.page;

                    navigate(page);

                }
            );

        }
    );


function navigate(page) {

    currentPage = page;


    document
        .querySelectorAll(".nav-link")
        .forEach(
            link => {

                link.classList.toggle(
                    "active",
                    link.dataset.page === page
                );

            }
        );


    const dashboard =
        document.getElementById(
            "dashboardPage"
        );

    const module =
        document.getElementById(
            "modulePage"
        );


    if (page === "dashboard") {

        dashboard.classList.remove("d-none");

        module.classList.add("d-none");

        document
            .getElementById("pageTitle")
            .textContent =
            "Dashboard";

        loadDashboard();

    } else {

        dashboard.classList.add("d-none");

        module.classList.remove("d-none");

        loadModule(page);

    }


    document
        .getElementById("sidebar")
        .classList.remove("show");

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function loadDashboard() {

    const students =
        data.students.length;

    const rooms =
        data.rooms.length;

    const occupied =
        data.rooms.filter(
            room =>
                room.occupied > 0
        ).length;

    const vacant =
        rooms - occupied;


    const pendingFees =
        data.fees.reduce(
            (sum, fee) =>
                sum + Number(fee.pending),
            0
        );


    const openComplaints =
        data.complaints.filter(
            item =>
                item.status !== "Resolved"
        ).length;


    const pendingLeaves =
        data.leave.filter(
            item =>
                item.status === "Pending"
        ).length;


    const feeDues =
        data.fees.filter(
            item =>
                item.pending > 0
        ).length;


    document
        .getElementById("totalStudents")
        .textContent =
        students;

    document
        .getElementById("totalRooms")
        .textContent =
        rooms;

    document
        .getElementById("occupiedRooms")
        .textContent =
        occupied;

    document
        .getElementById("pendingFees")
        .textContent =
        formatCurrency(pendingFees);

    document
        .getElementById("occupiedCount")
        .textContent =
        occupied;

    document
        .getElementById("vacantCount")
        .textContent =
        vacant;

    document
        .getElementById("openComplaints")
        .textContent =
        openComplaints;

    document
        .getElementById("pendingLeaves")
        .textContent =
        pendingLeaves;

    document
        .getElementById("feeDues")
        .textContent =
        feeDues;


    const percentage =
        rooms === 0
            ? 0
            : Math.round(
                (occupied / rooms) * 100
            );


    document
        .getElementById("occupancyPercent")
        .textContent =
        percentage + "%";


    document
        .querySelector(".progress-circle")
        .style.background =
        `conic-gradient(
            var(--primary)
            ${percentage * 3.6}deg,
            #eef0f5
            ${percentage * 3.6}deg
        )`;


    loadRecentActivities();
    if (currentUser && currentUser.role !== "Student") loadAiInsights();

}


/* =========================================================
   RECENT ACTIVITIES
   ========================================================= */

function loadRecentActivities() {

    const container =
        document.getElementById(
            "recentActivities"
        );


    const activities = [

        {
            icon: "bi-person-plus",
            title: "New student registered",
            text: "Arun Kumar added to hostel",
            time: "Today"
        },

        {
            icon: "bi-door-open",
            title: "Room allocated",
            text: "Room A-101 allocated",
            time: "Today"
        },

        {
            icon: "bi-tools",
            title: "Complaint submitted",
            text: "Bathroom tap leakage",
            time: "Yesterday"
        },

        {
            icon: "bi-calendar-check",
            title: "Leave approved",
            text: "Priya S leave request approved",
            time: "Yesterday"
        }

    ];


    container.innerHTML =
        activities.map(
            activity => `

            <div class="activity-item">

                <div class="activity-icon">

                    <i class="bi ${activity.icon}"></i>

                </div>

                <div>

                    <strong>
                        ${activity.title}
                    </strong>

                    <small>
                        ${activity.text}
                        ·
                        ${activity.time}
                    </small>

                </div>

            </div>

        `
        ).join("");

}


/* =========================================================
   MODULE LOADING
   ========================================================= */

function loadModule(moduleName) {

    const config =
        moduleConfig[moduleName];

    currentModuleData =
        [...data[moduleName]];


    document
        .getElementById("pageTitle")
        .textContent =
        config.title;

    document
        .getElementById("moduleHeading")
        .textContent =
        config.title;

    document
        .getElementById("moduleDescription")
        .textContent = currentUser?.role === "Student" && moduleName === "mess"
            ? "Choose the dishes you need for each published day."
            : config.description;


    renderForm(config);

    renderTable(config);

    setupFilter(moduleName);

    const isMess = moduleName === "mess";
    const isStudent = currentUser?.role === "Student";
    document.getElementById("recordTableCard").classList.toggle("d-none", isMess);
    document.getElementById("addButton").classList.toggle("d-none", isMess);
    document.getElementById("studentMealPanel").classList.toggle("d-none", !isMess || !isStudent);
    document.getElementById("mealDemandPanel").classList.toggle("d-none", !isMess || isStudent);
    document.getElementById("weeklyMenuPanel").classList.toggle("d-none", !isMess || isStudent);
    if (isMess && isStudent) loadStudentMealDays();
    if (isMess && !isStudent) {
        initializeWeeklyMenuPlanner();
        loadMealDemand();
    }

}


/* =========================================================
   RENDER FORM
   ========================================================= */

function renderForm(config) {

    const form =
        document.getElementById(
            "dataForm"
        );


    form.innerHTML =
        config.fields.map(
            field => {

                const [
                    key,
                    label,
                    type,
                    required,
                    options
                ] = field;


                let input = "";


                if (type === "select") {

                    input = `

                        <select
                            id="field_${key}"
                            class="form-control"
                            ${required ? "required" : ""}
                        >

                            <option value="">
                                Select ${label}
                            </option>

                            ${options.map(
                                option =>
                                `
                                <option value="${option}">
                                    ${option}
                                </option>
                                `
                            ).join("")}

                        </select>

                    `;

                } else {

                    input = `

                        <input
                            type="${type}"
                            id="field_${key}"
                            class="form-control"
                            ${required ? "required" : ""}
                        >

                    `;

                }


                return `

                    <div class="form-field">

                        <label>
                            ${label}
                        </label>

                        ${input}

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   RENDER TABLE
   ========================================================= */

function renderTable(config, rows = currentModuleData) {

    const showWeekday = currentPage === "mess";
    const displayRows = showWeekday
        ? [...rows].sort((left, right) => left.date.localeCompare(right.date))
        : rows;

    const head =
        document.getElementById(
            "tableHead"
        );

    const body =
        document.getElementById(
            "tableBody"
        );


    head.innerHTML = `

        <tr>

            ${showWeekday ? "<th>Day</th>" : ""}

            ${config.columns.map(
                column =>
                `<th>${column[1]}</th>`
            ).join("")}

            <th>Actions</th>

        </tr>

    `;


    if (displayRows.length === 0) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="${config.columns.length + (showWeekday ? 2 : 1)}"
                    style="text-align:center;padding:40px"
                >

                    No records found

                </td>

            </tr>

        `;

        updateTableCount(0);

        return;

    }


    body.innerHTML =
        displayRows.map(
            item => `

            <tr>

            ${showWeekday ? `<td>${new Intl.DateTimeFormat("en", { weekday: "long" }).format(new Date(`${item.date}T00:00:00`))}</td>` : ""}

                ${config.columns.map(
                    column =>
                    `<td>
                        ${formatCell(
                            column[0],
                            item[column[0]]
                        )}
                    </td>`
                ).join("")}

                <td>

                    <button
                        class="table-action edit"
                        onclick="editRecord(${item.id})"
                        title="Edit"
                    >
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button
                        class="table-action delete"
                        onclick="deleteRecord(${item.id})"
                        title="Delete"
                    >
                        <i class="bi bi-trash"></i>
                    </button>

                    ${extraActions(item)}

                </td>

            </tr>

        `
        ).join("");


    updateTableCount(displayRows.length);

}

async function initializeWeeklyMenuPlanner() {
    const status = document.getElementById("weeklyMenuStatus");
    status.textContent = "Loading weekly menu...";
    try {
        const result = await api("/api/mess/menu");
        renderWeeklyMenuDays(result.days);
        status.textContent = "";
    } catch (error) {
        status.textContent = error.message || "Could not load the weekly menu.";
    }
}

function renderWeeklyMenuDays(days) {
    const container = document.getElementById("weeklyMenuDays");
    const mealLabels = { breakfast: "Breakfast", lunch: "Lunch", snacks: "Snacks", dinner: "Dinner" };
    container.innerHTML = days.map(day => `
        <fieldset class="weekly-menu-day" data-day-of-week="${day.day_of_week}">
            <legend>${day.day_of_week[0] + day.day_of_week.slice(1).toLowerCase()}</legend>
            <div class="weekly-menu-meals">
                ${day.meals.map(meal => `
                    <label>
                        <span>${mealLabels[meal.meal_type]}</span>
                        <textarea name="${meal.meal_type}" rows="2" placeholder="One dish per line">${escapeHtml(meal.dishes.map(dish => dish.name).join("\n"))}</textarea>
                    </label>
                `).join("")}
            </div>
        </fieldset>
    `).join("");
}

async function saveWeeklyMenu() {
    const status = document.getElementById("weeklyMenuStatus");
    const button = document.getElementById("publishWeeklyMenu");
    const days = [...document.querySelectorAll(".weekly-menu-day")].map(day => ({
        day_of_week: day.dataset.dayOfWeek,
        meals: Object.fromEntries([...day.querySelectorAll("textarea")].map(textarea => [
            textarea.name,
            textarea.value.split(/\r?\n/).map(name => name.trim()).filter(Boolean)
        ]))
    }));
    if (days.length !== 7) {
        status.textContent = "The weekly menu needs all seven days. Refresh and try again.";
        return;
    }

    button.disabled = true;
    status.textContent = "Saving weekly menu...";
    try {
        const result = await api("/api/mess/menu", {
            method: "PUT",
            body: JSON.stringify({ days })
        });
        renderWeeklyMenuDays(result.days);
        status.textContent = "Weekly menu saved.";
        showToast("Weekly menu saved successfully.", "success");
        await loadMealDemand();
    } catch (error) {
        status.textContent = error.message || "Could not save the weekly menu.";
        showToast(status.textContent, "danger");
    } finally {
        button.disabled = false;
    }
}


/* =========================================================
   FORMAT CELL
   ========================================================= */

function formatCell(key, value) {

    if (
        key === "status"
    ) {

        return statusBadge(value);

    }


    if (
        key === "total" ||
        key === "paid" ||
        key === "pending"
    ) {

        return formatCurrency(value);

    }


    if (
        key === "priority"
    ) {

        const className =
            value === "High"
                ? "status-danger"
                : value === "Medium"
                    ? "status-warning"
                    : "status-info";


        return `
            <span class="status-badge ${className}">
                ${escapeHtml(value)}
            </span>
        `;

    }


    return escapeHtml(value);

}


/* =========================================================
   STATUS BADGE
   ========================================================= */

function escapeHtml(value) {
    return String(value ?? "-").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function statusBadge(status) {

    let className =
        "status-gray";


    if (
        status === "Paid" ||
        status === "Approved" ||
        status === "Resolved" ||
        status === "Available" ||
        status === "Exited"
    ) {

        className =
            "status-success";

    }


    if (
        status === "Pending" ||
        status === "In Progress" ||
        status === "Inside"
    ) {

        className =
            "status-warning";

    }


    if (
        status === "Open" ||
        status === "Rejected" ||
        status === "Occupied"
    ) {

        className =
            "status-danger";

    }


    if (status === "Active") {

        className =
            "status-info";

    }


    return `
        <span class="status-badge ${className}">
            ${escapeHtml(status)}
        </span>
    `;

}


/* =========================================================
   EXTRA ACTIONS
   ========================================================= */

function extraActions(item) {

    if (currentPage === "leave") {

        if (item.status === "Pending") {

            return `

                <button
                    class="table-action"
                    onclick="approveLeave(${item.id})"
                    title="Approve"
                >
                    <i class="bi bi-check-lg"></i>
                </button>

                <button
                    class="table-action"
                    onclick="rejectLeave(${item.id})"
                    title="Reject"
                >
                    <i class="bi bi-x-lg"></i>
                </button>

            `;

        }

    }


    if (
        currentPage === "complaints"
    ) {

        if (item.status !== "Resolved") {

            return `

                <button
                    class="table-action"
                    onclick="resolveComplaint(${item.id})"
                    title="Resolve"
                >
                    <i class="bi bi-check-circle"></i>
                </button>

            `;

        }

    }


    if (
        currentPage === "allocation" &&
        item.status === "Active"
    ) {

        return `

            <button
                class="table-action"
                onclick="vacateRoom(${item.id})"
                title="Vacate"
            >
                <i class="bi bi-box-arrow-right"></i>
            </button>

        `;

    }


    if (
        currentPage === "visitors" &&
        item.status === "Inside"
    ) {

        return `

            <button
                class="table-action"
                onclick="checkoutVisitor(${item.id})"
                title="Exit"
            >
                <i class="bi bi-box-arrow-right"></i>
            </button>

        `;

    }


    return "";

}


/* =========================================================
   ADD MODAL
   ========================================================= */

function openAddModal() {

    editingId = null;

    document
        .getElementById("modalTitle")
        .textContent =
        "Add " +
        moduleConfig[currentPage].title;


    document
        .getElementById("dataForm")
        .reset();


    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "dataModal"
            )
        );

    modal.show();

}


/* =========================================================
   EDIT
   ========================================================= */

function editRecord(id) {

    const record =
        data[currentPage].find(
            item =>
                item.id === id
        );


    if (!record) return;


    editingId = id;


    const config =
        moduleConfig[currentPage];


    config.fields.forEach(
        field => {

            const key =
                field[0];

            const input =
                document.getElementById(
                    "field_" + key
                );


            if (input) {

                input.value =
                    record[key] ?? "";

            }

        }
    );


    document
        .getElementById("modalTitle")
        .textContent =
        "Edit " +
        config.title;


    new bootstrap.Modal(
        document.getElementById(
            "dataModal"
        )
    ).show();

}


/* =========================================================
   SAVE
   ========================================================= */

async function saveRecord() {

    const config =
        moduleConfig[currentPage];


    const record = {};


    let valid = true;


    config.fields.forEach(
        field => {

            const key =
                field[0];

            const input =
                document.getElementById(
                    "field_" + key
                );


            if (
                field[3] &&
                !input.value.trim()
            ) {

                valid = false;

                input.classList.add(
                    "is-invalid"
                );

            } else {

                input.classList.remove(
                    "is-invalid"
                );

            }


            record[key] =
                input.value.trim();

        }
    );


    if (!valid) {

        showToast(
            "Please fill all required fields.",
            "danger"
        );

        return;

    }


    if (
        currentPage === "fees"
    ) {

        record.total =
            Number(record.total);

        record.paid =
            Number(record.paid);

        record.pending =
            record.total -
            record.paid;

        record.status =
            record.pending <= 0
                ? "Paid"
                : "Pending";

    }


    if (
        currentPage === "rooms"
    ) {

        record.floor =
            Number(record.floor);

        record.capacity =
            Number(record.capacity);

        record.occupied =
            Number(record.occupied || 0);

        record.status =
            record.occupied >= record.capacity
                ? "Occupied"
                : "Available";

    }


    if (
        currentPage === "complaints"
    ) {

        record.date =
            new Date()
                .toISOString()
                .split("T")[0];

        record.status =
            "Open";

    }


    if (
        currentPage === "leave"
    ) {

        record.applied =
            new Date()
                .toISOString()
                .split("T")[0];

        record.status =
            "Pending";

    }


    if (
        currentPage === "visitors"
    ) {

        record.exit =
            "-";

        record.status =
            "Inside";

    }


    if (
        currentPage === "allocation"
    ) {

        record.status =
            "Active";

    }


    try {
        await api(editingId
            ? `/api/data/${currentPage}/${editingId}`
            : `/api/data/${currentPage}`, {
            method: editingId ? "PATCH" : "POST",
            body: JSON.stringify(record)
        });
        await refreshData();
        showToast(editingId ? "Record updated successfully." : "Record added successfully.", "success");
    } catch (error) {
        showToast(error.message || "Could not save record.", "danger");
        return;
    }


    bootstrap.Modal
        .getInstance(
            document.getElementById(
                "dataModal"
            )
        )
        .hide();


    loadModule(currentPage);

    loadDashboard();

}


/* =========================================================
   DELETE
   ========================================================= */

async function deleteRecord(id) {

    if (
        !confirm(
            "Are you sure you want to delete this record?"
        )
    ) {

        return;

    }


    try {
        await api(`/api/data/${currentPage}/${id}`, { method: "DELETE" });
        await refreshData();
    } catch (error) {
        showToast(error.message || "Could not delete record.", "danger");
        return;
    }


    showToast(
        "Record deleted successfully.",
        "success"
    );


    loadModule(currentPage);

    loadDashboard();

}


/* =========================================================
   SEARCH
   ========================================================= */

function searchTable() {

    const query =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    const filtered =
        currentModuleData.filter(
            item =>

                Object
                    .values(item)
                    .some(
                        value =>
                            String(value)
                                .toLowerCase()
                                .includes(query)
                    )

        );


    renderTable(
        moduleConfig[currentPage],
        filtered
    );

}


/* =========================================================
   FILTER
   ========================================================= */

function setupFilter(moduleName) {

    const select =
        document.getElementById(
            "filterSelect"
        );


    select.innerHTML =
        `<option value="">All</option>`;


    let values = [];


    if (
        moduleName === "students"
    ) {

        values = [
            ...new Set(
                data.students.map(
                    student =>
                        student.department
                )
            )
        ];

    }


    if (
        moduleName === "rooms"
    ) {

        values = [
            ...new Set(
                data.rooms.map(
                    room =>
                        room.status
                )
            )
        ];

    }


    if (
        moduleName === "fees"
    ) {

        values = [
            "Paid",
            "Pending"
        ];

    }


    if (
        moduleName === "complaints"
    ) {

        values = [
            "Open",
            "In Progress",
            "Resolved"
        ];

    }


    if (
        moduleName === "leave"
    ) {

        values = [
            "Pending",
            "Approved",
            "Rejected"
        ];

    }


    values.forEach(
        value => {

            select.innerHTML +=
                `
                <option value="${value}">
                    ${value}
                </option>
                `;

        }
    );

}


function filterTable() {

    const value =
        document
            .getElementById(
                "filterSelect"
            )
            .value;


    if (!value) {

        renderTable(
            moduleConfig[currentPage],
            currentModuleData
        );

        return;

    }


    let filtered = [];


    if (
        currentPage === "students"
    ) {

        filtered =
            currentModuleData.filter(
                item =>
                    item.department === value
            );

    } else {

        filtered =
            currentModuleData.filter(
                item =>
                    item.status === value
            );

    }


    renderTable(
        moduleConfig[currentPage],
        filtered
    );

}


/* =========================================================
   LEAVE ACTIONS
   ========================================================= */

async function approveLeave(id) {
    await updateRecord("leave", id, { status: "Approved" }, "Leave request approved.");
}


async function rejectLeave(id) {
    await updateRecord("leave", id, { status: "Rejected" }, "Leave request rejected.");
}


/* =========================================================
   COMPLAINT
   ========================================================= */

async function resolveComplaint(id) {
    await updateRecord("complaints", id, { status: "Resolved" }, "Complaint marked as resolved.");
}


/* =========================================================
   ROOM VACATE
   ========================================================= */

async function vacateRoom(id) {
    try {
        await api(`/api/actions/vacate/${id}`, { method: "POST" });
        await refreshData();
        showToast("Student vacated successfully.", "success");
        loadModule("allocation");
        loadDashboard();
    } catch (error) {
        showToast(error.message || "Could not vacate student.", "danger");
    }
}


/* =========================================================
   VISITOR CHECKOUT
   ========================================================= */

async function checkoutVisitor(id) {
    const exit = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    await updateRecord("visitors", id, { exit, status: "Exited" }, "Visitor checkout recorded.", false);
    loadModule("visitors");
}


/* =========================================================
   HELPERS
   ========================================================= */

function getNextId(items) {

    if (!items.length) {
        return 1;
    }

    return Math.max(
        ...items.map(
            item =>
                Number(item.id)
        )
    ) + 1;

}


function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(
        Number(amount || 0)
    );

}


function updateTableCount(count) {

    document
        .getElementById(
            "tableCount"
        )
        .textContent =
        `Showing ${count} records`;

}


function updateDate() {

    const date =
        new Date();


    document
        .getElementById(
            "currentDate"
        )
        .textContent =
        date.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "toastContainer"
        );


    const icon =
        type === "success"
            ? "check-circle-fill"
            : type === "danger"
                ? "x-circle-fill"
                : "info-circle-fill";


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast align-items-center text-bg-${type} border-0`;


    toast.setAttribute(
        "role",
        "alert"
    );


    toast.innerHTML = `

        <div class="d-flex">

            <div class="toast-body">

                <i class="bi bi-${icon} me-2"></i>

                ${message}

            </div>

            <button
                type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
            ></button>

        </div>

    `;


    container.appendChild(toast);


    const bsToast =
        new bootstrap.Toast(
            toast,
            {
                delay: 3000
            }
        );


    bsToast.show();


    toast.addEventListener(
        "hidden.bs.toast",
        () => toast.remove()
    );

}


/* =========================================================
   SIDEBAR
   ========================================================= */

function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList.toggle("show");

}


/* =========================================================
   LOCAL STORAGE LOGIN
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (authToken) {
            api("/api/auth/me")
                .then(async result => {
                    currentUser = result.user;
                    await showApplication();
                })
                .catch(() => logout());
        }

        document.getElementById("aiQuestionForm").addEventListener("submit", askAiQuestion);

    }
);


/* =========================================================
    API CLIENT
   =========================================================

   ========================================================= */

async function api(
    endpoint,
    options = {}
) {

    const defaultOptions = {

        headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },

        credentials: "include"

    };


    const response =
        await fetch(
            endpoint,
            {
                ...defaultOptions,
                ...options,

                headers: {
                    ...defaultOptions.headers,
                    ...(options.headers || {})
                }
            }
        );


    const contentType =
        response.headers
            .get("content-type");


    const result =
        contentType &&
        contentType.includes(
            "application/json"
        )
            ? await response.json()
            : await response.text();


    if (!response.ok) {

        if (response.status === 401) logout();
        throw new Error(result.error || "Request failed");

    }


    return result;

}

async function refreshData() {
    const result = await api("/api/data");
    data = result.data;
}

async function updateRecord(moduleName, id, changes, message, refreshModule = true) {
    try {
        await api(`/api/data/${moduleName}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(changes)
        });
        await refreshData();
        showToast(message, "success");
        if (refreshModule) loadModule(moduleName);
        loadDashboard();
    } catch (error) {
        showToast(error.message || "Could not update record.", "danger");
    }
}

async function loadStudentMealDays() {
    const container = document.getElementById("studentMealDays");
    container.textContent = "Loading the weekly menu...";
    try {
        const [menuResult, selectionResult] = await Promise.all([
            api("/api/mess/menu"),
            api("/api/mess/selections")
        ]);
        const selectedDishes = new Set(selectionResult.selections.map(selection =>
            JSON.stringify([selection.day_of_week, selection.meal_type, selection.dish_id])
        ));
        const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const mealLabels = { breakfast: "Breakfast", lunch: "Lunch", snacks: "Snacks", dinner: "Dinner" };
        const menuByDay = new Map(menuResult.days.map(day => [day.day_of_week, day]));
        container.innerHTML = weekdays.map(dayName => {
            const dayMenu = menuByDay.get(dayName);
            const mealSections = Object.entries(mealLabels).map(([mealType, label]) => {
                const meal = dayMenu?.meals.find(item => item.meal_type === mealType);
                const dishes = meal?.dishes || [];
                const choices = dishes.length
                    ? `<div class="meal-dish-chips">${dishes.map(dish => {
                        const key = JSON.stringify([dayName, mealType, dish.id]);
                        return `
                            <label class="meal-dish-chip${selectedDishes.has(key) ? " is-selected" : ""}">
                                <input type="checkbox" data-day-of-week="${dayName}" data-meal-type="${mealType}" value="${dish.id}" ${selectedDishes.has(key) ? "checked" : ""}>
                                <span>${escapeHtml(dish.name)}</span>
                            </label>
                        `;
                    }).join("")}</div>`
                    : "<p class=\"meal-empty\">No dishes on the menu yet.</p>";
                return `
                    <section class="student-meal-group">
                        <h4>${label}</h4>
                        ${choices}
                    </section>
                `;
            }).join("");
            const count = [...selectedDishes].filter(key => JSON.parse(key)[0] === dayName).length;
            return `
                <article class="meal-day" data-day-of-week="${dayName}">
                    <div class="meal-day-heading">
                        <h3>${dayName[0] + dayName.slice(1).toLowerCase()}</h3>
                        <p class="meal-day-summary">${count} ${count === 1 ? "dish" : "dishes"} selected</p>
                    </div>
                    <div class="student-meal-sections">${mealSections}</div>
                </article>
            `;
        }).join("");
        container.onchange = event => {
            if (event.target.matches("input[type=checkbox]")) {
                event.target.closest(".meal-dish-chip").classList.toggle("is-selected", event.target.checked);
                updateStudentMealSummary(event.target.closest(".meal-day"));
            }
        };
    } catch (error) {
        container.textContent = error.message || "Could not load your meal choices.";
    }
}

function updateStudentMealSummary(day) {
    const count = day.querySelectorAll("input[type=checkbox]:checked").length;
    day.querySelector(".meal-day-summary").textContent = `${count} ${count === 1 ? "dish" : "dishes"} selected`;
}

async function saveStudentMealWeek() {
    const button = document.getElementById("saveStudentMealWeek");
    const status = document.getElementById("studentMealStatus");
    const selections = [...document.querySelectorAll("#studentMealDays .meal-day")].flatMap(day =>
        [...day.querySelectorAll("input[type=checkbox]:checked")].map(input => ({
            day_of_week: input.dataset.dayOfWeek,
            meal_type: input.dataset.mealType,
            dish_id: input.value
        }))
    );
    button.disabled = true;
    status.textContent = "Saving your weekly selections...";
    try {
        await api("/api/mess/selections", {
            method: "PUT",
            body: JSON.stringify({ selections })
        });
        await loadStudentMealDays();
        status.textContent = "Your weekly selections have been saved.";
        showToast("Your weekly selections have been saved.", "success");
    } catch (error) {
        status.textContent = error.message || "Could not save your weekly selections.";
        showToast(status.textContent, "danger");
    } finally {
        button.disabled = false;
    }
}

async function loadMealDemand() {
    const container = document.getElementById("mealDemandContent");
    container.textContent = "Loading meal counts...";
    try {
        const result = await api("/api/mess/demand");
        mealDemandDays = result.days;
        renderMealDemand();
    } catch (error) {
        container.textContent = error.message || "Could not load meal demand.";
    }
}

function getFilteredMealDemand() {
    const selectedDay = document.getElementById("mealDemandDayFilter").value;
    const search = document.getElementById("mealDemandSearch").value.trim().toLowerCase();
    return mealDemandDays
        .filter(day => !selectedDay || day.day_of_week === selectedDay)
        .map(day => ({
            ...day,
            meals: day.meals.map(meal => ({
                ...meal,
                dishes: meal.dishes.filter(dish => !search || dish.name.toLowerCase().includes(search))
            }))
        }));
}

function getMealPrepBuffer() {
    const input = document.getElementById("mealDemandBuffer");
    const value = Number(input.value);
    const buffer = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
    input.value = String(buffer);
    return buffer;
}

function renderMealDemand() {
    const container = document.getElementById("mealDemandContent");
    if (!container) return;
    const days = getFilteredMealDemand();
    const buffer = getMealPrepBuffer();
    const labels = { breakfast: "Breakfast", lunch: "Lunch", snacks: "Snacks", dinner: "Dinner" };

    container.innerHTML = days.map(day => {
        const daySelections = day.meals.reduce((total, meal) =>
            total + meal.dishes.reduce((sum, dish) => sum + dish.count, 0), 0);
        const mealSections = day.meals.map(meal => {
            return `
                <section class="meal-demand-meal">
                    <h4>${labels[meal.meal_type]}</h4>
                    ${meal.dishes.length
                        ? `<ul>${meal.dishes.map(dish => {
                            const prepTarget = Math.ceil(dish.count * (1 + buffer / 100));
                            return `<li><span>${escapeHtml(dish.name)}<small>${dish.count} student ${dish.count === 1 ? "selection" : "selections"}</small></span><strong>${prepTarget}<small>prep target</small></strong></li>`;
                        }).join("")}</ul>`
                        : "<p class=\"meal-empty\">No dishes published.</p>"}
                </section>
            `;
        }).join("");
        return `
            <article class="meal-demand-day">
                <div class="meal-day-heading">
                    <h3>${day.day_of_week[0] + day.day_of_week.slice(1).toLowerCase()}</h3>
                    <p class="meal-day-summary">${day.has_selections ? `${daySelections} dish selections` : ""}</p>
                </div>
                ${!day.has_selections ? "<p class=\"meal-demand-empty\">No student choices yet</p>" : ""}
                <div class="meal-demand-meals">${mealSections}</div>
            </article>
        `;
    }).join("");

    const totalSelections = days.reduce((total, day) => total + day.meals.reduce((sum, meal) =>
        sum + meal.dishes.reduce((dishSum, dish) => dishSum + dish.count, 0), 0), 0);
    document.getElementById("mealDemandSummary").textContent = `${days.length} ${days.length === 1 ? "day" : "days"} shown · ${totalSelections} student dish selections · ${buffer}% prep buffer`;
}

function exportMealDemandCsv() {
    const buffer = getMealPrepBuffer();
    const rows = [["Day", "Meal", "Dish", "Student selections", "Prep buffer (%)", "Prep target"]];
    for (const day of getFilteredMealDemand()) {
        for (const meal of day.meals) {
            for (const dish of meal.dishes) {
                rows.push([
                    day.day_of_week,
                    meal.meal_type,
                    dish.name,
                    dish.count,
                    buffer,
                    Math.ceil(dish.count * (1 + buffer / 100))
                ]);
            }
        }
    }
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "weekly-kitchen-meal-counts.csv";
    link.click();
    URL.revokeObjectURL(url);
}

function printMealDemand() {
    window.print();
}

async function loadAiInsights() {
    const container = document.getElementById("aiInsights");
    container.textContent = "Analyzing hostel activity...";
    try {
        const result = await api("/api/ai/insights");
        document.getElementById("aiModeLabel").textContent = result.assistantMode === "openai"
            ? "Rule-based alerts · AI chat enabled"
            : "Rule-based alerts · local assistant";
        container.replaceChildren(...result.insights.map(insight => {
            const item = document.createElement("div");
            item.className = `ai-insight ${insight.level}`;
            const icon = document.createElement("i");
            icon.className = `bi ${insight.icon}`;
            icon.setAttribute("aria-hidden", "true");
            const copy = document.createElement("span");
            copy.textContent = insight.text;
            item.append(icon, copy);
            return item;
        }));
    } catch (error) {
        container.textContent = error.message;
    }
}

async function askAiQuestion(event) {
    event.preventDefault();
    const input = document.getElementById("aiQuestion");
    const answer = document.getElementById("aiAnswer");
    const question = input.value.trim();
    if (!question) return;
    answer.textContent = "Thinking...";
    try {
        const result = await api("/api/ai/assistant", {
            method: "POST",
            body: JSON.stringify({ question })
        });
        answer.textContent = result.answer;
        input.value = "";
    } catch (error) {
        answer.textContent = error.message;
    }
}