const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const HostelRecord = require("./models/HostelRecord");
const Counter = require("./models/Counter");
const MessMenu = require("./models/MessMenu");
const MealSelection = require("./models/MealSelection");
const fs = require("node:fs");
const path = require("node:path");
const { randomBytes } = require("node:crypto");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const MONGODB_URI = process.env.MONGODB_URI || (IS_PRODUCTION ? "" : "mongodb://127.0.0.1:27017/hostelhub");
const LEGACY_DATA_FILE = path.join(__dirname, "data", "hostel.json");
const JWT_SECRET = process.env.JWT_SECRET || (IS_PRODUCTION ? "" : randomBytes(32).toString("hex"));
const MODULES = ["students", "rooms", "allocation", "fees", "mess", "visitors", "complaints", "leave"];
const DAYS_OF_WEEK = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const MEAL_TYPES = ["breakfast", "lunch", "snacks", "dinner"];
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

if (!MONGODB_URI) throw new Error("MONGODB_URI must be configured in production.");
if (!JWT_SECRET) throw new Error("JWT_SECRET must be configured in production.");

function splitLegacyDishes(value) {
    return String(value || "").split(/[+,;\n]/).map(name => name.trim()).filter(Boolean);
}

const seedData = {
    students: [
        { id: 1, name: "Arun Kumar", rollNo: "IT2026001", department: "Information Technology", year: 3, phone: "9876543210", guardian: "Kumar", guardianPhone: "9876500000" },
        { id: 2, name: "Priya S", rollNo: "CSE2026002", department: "Computer Science", year: 2, phone: "9876543211", guardian: "Suresh", guardianPhone: "9876500001" },
        { id: 3, name: "Rahul M", rollNo: "ECE2026003", department: "Electronics", year: 3, phone: "9876543212", guardian: "Mani", guardianPhone: "9876500002" },
        { id: 4, name: "Divya R", rollNo: "IT2026004", department: "Information Technology", year: 2, phone: "9876543213", guardian: "Ramesh", guardianPhone: "9876500003" }
    ],
    rooms: [
        { id: 1, block: "A", floor: 1, room: "101", type: "Double", capacity: 2, occupied: 2, status: "Occupied" },
        { id: 2, block: "A", floor: 1, room: "102", type: "Triple", capacity: 3, occupied: 2, status: "Available" },
        { id: 3, block: "A", floor: 2, room: "201", type: "Single", capacity: 1, occupied: 1, status: "Occupied" },
        { id: 4, block: "B", floor: 1, room: "101", type: "Double", capacity: 2, occupied: 0, status: "Available" },
        { id: 5, block: "B", floor: 2, room: "201", type: "Triple", capacity: 3, occupied: 0, status: "Available" }
    ],
    allocation: [
        { id: 1, student: "Arun Kumar", rollNo: "IT2026001", room: "A-101", allocatedOn: "2026-06-10", status: "Active" },
        { id: 2, student: "Priya S", rollNo: "CSE2026002", room: "A-101", allocatedOn: "2026-06-12", status: "Active" },
        { id: 3, student: "Rahul M", rollNo: "ECE2026003", room: "A-201", allocatedOn: "2026-06-15", status: "Active" }
    ],
    fees: [
        { id: 1, student: "Arun Kumar", rollNo: "IT2026001", fee: "Hostel Semester Fee", total: 45000, paid: 20000, pending: 25000, status: "Pending" },
        { id: 2, student: "Priya S", rollNo: "CSE2026002", fee: "Hostel Semester Fee", total: 45000, paid: 45000, pending: 0, status: "Paid" },
        { id: 3, student: "Rahul M", rollNo: "ECE2026003", fee: "Hostel Semester Fee", total: 45000, paid: 30000, pending: 15000, status: "Pending" },
        { id: 4, student: "Divya R", rollNo: "IT2026004", fee: "Hostel Semester Fee", total: 45000, paid: 15000, pending: 30000, status: "Pending" }
    ],
    mess: [
        { id: 1, date: "2026-10-11", breakfast: "Pongal + Medu Vada + Coconut Chutney", lunch: "Steamed Rice + Sambar + Avial + Beans Poriyal + Papad + Curd", snacks: "Masala Tea + Sundal", dinner: "Chapati + Chana Masala + Jeera Rice + Cucumber Raita" },
        { id: 2, date: "2026-10-12", breakfast: "Idli + Ghee Podi Idli + Sambar + Tomato Chutney", lunch: "Lemon Rice + Vegetable Poriyal + Pepper Rasam + Curd", snacks: "Filter Coffee + Banana + Vegetable Puff", dinner: "Chapati + Paneer Butter Masala + Jeera Rice + Green Salad" },
        { id: 3, date: "2026-10-13", breakfast: "Rava Upma + Medu Vada + Coconut Chutney", lunch: "Vegetable Biryani + Raita + Brinjal Salan + Boiled Egg", snacks: "Masala Chai + Onion Pakoda", dinner: "Dosa + Chicken Curry + Mixed Vegetable Kurma + Coconut Chutney" },
        { id: 4, date: "2026-10-14", breakfast: "Masala Dosa + Sambar + Peanut Chutney", lunch: "Sambar Rice + Cabbage Poriyal + Rasam + Appalam", snacks: "Sweet Corn + Lemon Tea", dinner: "Chicken Biryani + Onion Raita + Vegetable Pulao + Gobi 65" },
        { id: 5, date: "2026-10-15", breakfast: "Ven Pongal + Vada + Sambar + Coconut Chutney", lunch: "Tomato Rice + Potato Roast + Curd + Papad", snacks: "Samosa + Filter Coffee", dinner: "Parotta + Chicken Salna + Paneer Pepper Fry + Onion Raita" },
        { id: 6, date: "2026-10-16", breakfast: "Poori + Potato Masala + Kesari", lunch: "Curd Rice + Pepper Rasam + Carrot Beans Poriyal", snacks: "Vegetable Cutlet + Ginger Tea", dinner: "Chapati + Egg Masala + Mixed Vegetable Kurma + Jeera Rice" },
        { id: 7, date: "2026-10-17", breakfast: "Aloo Paratha + Curd + Mint Chutney", lunch: "Chicken Fried Rice + Vegetable Fried Rice + Gobi Manchurian + Cucumber Raita", snacks: "Pani Puri + Masala Chai", dinner: "Chapati + Dal Tadka + Paneer Tikka Masala + Vegetable Pulao" }
    ],
    visitors: [
        { id: 1, visitor: "Suresh Kumar", student: "Arun Kumar", relation: "Father", purpose: "Personal Visit", entry: "10:30 AM", exit: "12:00 PM", status: "Exited" },
        { id: 2, visitor: "Priya Mother", student: "Priya S", relation: "Mother", purpose: "Personal Visit", entry: "02:00 PM", exit: "-", status: "Inside" }
    ],
    complaints: [
        { id: 1, student: "Arun Kumar", title: "Bathroom tap leakage", category: "Plumbing", priority: "High", date: "2026-10-03", status: "Open" },
        { id: 2, student: "Priya S", title: "Fan not working", category: "Electrical", priority: "Medium", date: "2026-10-02", status: "In Progress" },
        { id: 3, student: "Rahul M", title: "Room light problem", category: "Electrical", priority: "Low", date: "2026-09-30", status: "Resolved" }
    ],
    leave: [
        { id: 1, student: "Arun Kumar", from: "2026-10-07", to: "2026-10-09", reason: "Family function", applied: "2026-10-04", status: "Pending" },
        { id: 2, student: "Priya S", from: "2026-10-10", to: "2026-10-11", reason: "Personal work", applied: "2026-10-04", status: "Approved" }
    ]
};

let data = Object.fromEntries(MODULES.map(module => [module, []]));

async function readData() {
    const records = await HostelRecord.find().sort({ module: 1, recordId: 1 }).lean();
    const currentData = Object.fromEntries(MODULES.map(module => [module, []]));
    for (const item of records) currentData[item.module].push(item.record);
    return currentData;
}

async function initializeDatabase() {
    await HostelRecord.init();
    await Counter.init();
    if (await HostelRecord.estimatedDocumentCount() === 0) {
        const initialData = fs.existsSync(LEGACY_DATA_FILE)
            ? JSON.parse(fs.readFileSync(LEGACY_DATA_FILE, "utf8"))
            : seedData;
        const documents = MODULES.flatMap(module =>
            (Array.isArray(initialData[module]) ? initialData[module] : []).map(record => ({
                module,
                recordId: Number(record.id),
                record
            }))
        );
        if (documents.length) await HostelRecord.insertMany(documents, { ordered: true });
    }
    for (const module of MODULES) {
        const lastRecord = await HostelRecord.findOne({ module }).sort({ recordId: -1 }).select("recordId").lean();
        await Counter.updateOne(
            { name: module },
            { $max: { sequence: Number(lastRecord?.recordId || 0) } },
            { upsert: true }
        );
    }
    data = await readData();
}

async function migrateLegacyMessData() {
    const legacyMenus = data.mess.filter(menu => /^\d{4}-\d{2}-\d{2}$/.test(menu.date));
    const menuByDate = new Map(legacyMenus.map(menu => [menu.date, menu]));
    for (const menu of legacyMenus) {
        const weekday = DAYS_OF_WEEK[new Date(`${menu.date}T00:00:00`).getDay()];
        for (const meal_type of MEAL_TYPES) {
            for (const name of splitLegacyDishes(menu[meal_type])) {
                await MessMenu.updateOne(
                    { day_of_week: weekday, meal_type, name },
                    { $setOnInsert: { day_of_week: weekday, meal_type, name } },
                    { upsert: true }
                );
            }
        }
    }

    const legacySelections = await MealSelection.collection.find({ date: { $exists: true } }).toArray().catch(() => []);
    const indexes = await MealSelection.collection.indexes().catch(() => []);
    for (const index of indexes) {
        if (index.name !== "_id_" && Object.hasOwn(index.key || {}, "date")) {
            await MealSelection.collection.dropIndex(index.name);
        }
    }

    for (const selection of legacySelections) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(selection.date || "")) continue;
        const student = data.students.find(item => item.name === selection.student || (selection.rollNo && item.rollNo === selection.rollNo));
        if (!student) continue;
        const day_of_week = DAYS_OF_WEEK[new Date(`${selection.date}T00:00:00`).getDay()];
        const legacyMenu = menuByDate.get(selection.date);
        const chosenDishes = Array.isArray(selection.dishes) && selection.dishes.length
            ? selection.dishes.map(dish => ({ meal_type: dish.meal, name: dish.name }))
            : (selection.meals || []).flatMap(meal_type => splitLegacyDishes(legacyMenu?.[meal_type]).map(name => ({ meal_type, name })));

        for (const chosen of chosenDishes) {
            if (!MEAL_TYPES.includes(chosen.meal_type) || !chosen.name) continue;
            const dish = await MessMenu.findOneAndUpdate(
                { day_of_week, meal_type: chosen.meal_type, name: chosen.name },
                { $setOnInsert: { day_of_week, meal_type: chosen.meal_type, name: chosen.name } },
                { upsert: true, new: true }
            );
            const now = new Date();
            await MealSelection.collection.updateOne(
                { student_id: Number(student.id), day_of_week, meal_type: chosen.meal_type, dish_id: dish._id },
                { $setOnInsert: {
                    student_id: Number(student.id),
                    username: selection.username || "legacy",
                    student: student.name,
                    day_of_week,
                    meal_type: chosen.meal_type,
                    dish_id: dish._id,
                    createdAt: now,
                    updatedAt: now
                } },
                { upsert: true }
            );
        }
    }

    if (legacySelections.length) await MealSelection.collection.deleteMany({ date: { $exists: true } });
    if (legacyMenus.length) {
        await HostelRecord.deleteMany({ module: "mess" });
        data = await readData();
    }
    await Promise.all([MessMenu.init(), MealSelection.init()]);
}

async function nextId(module) {
    const counter = await Counter.findOneAndUpdate(
        { name: module },
        { $inc: { sequence: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return counter.sequence;
}

const demoUsers = [
    { username: "admin", password: "Admin@123", name: "Administrator", role: "Admin" },
    { username: "warden", password: "Warden@123", name: "Main Warden", role: "Warden" },
    { username: "student1", password: "Student@123", name: "Arun Kumar", role: "Student" }
];

function requiredDeploymentValue(name) {
    const value = String(process.env[name] || "").trim();
    if (!value) throw new Error(`${name} must be configured in production.`);
    return value;
}

function deploymentPassword(name) {
    const password = requiredDeploymentValue(name);
    if (password.length < 12) throw new Error(`${name} must be at least 12 characters long.`);
    return password;
}

const users = IS_PRODUCTION ? [
    { username: requiredDeploymentValue("HOSTEL_ADMIN_USERNAME").toLowerCase(), password: deploymentPassword("HOSTEL_ADMIN_PASSWORD"), name: "Administrator", role: "Admin" },
    { username: requiredDeploymentValue("HOSTEL_WARDEN_USERNAME").toLowerCase(), password: deploymentPassword("HOSTEL_WARDEN_PASSWORD"), name: "Main Warden", role: "Warden" },
    { username: requiredDeploymentValue("HOSTEL_STUDENT_USERNAME").toLowerCase(), password: deploymentPassword("HOSTEL_STUDENT_PASSWORD"), name: "Arun Kumar", role: "Student" }
] : demoUsers;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin(origin, callback) {
        callback(null, !origin || FRONTEND_ORIGINS.includes(origin));
    },
    credentials: true
}));
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

function authenticate(req, res, next) {
    const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Sign in to continue." });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: "Session expired. Please sign in again." });
    }
}

function requireStaff(req, res, next) {
    if (req.user.role === "Student") return res.status(403).json({ error: "Staff access is required for this action." });
    next();
}

function visibleData(user) {
    if (user.role !== "Student") return data;
    const visible = Object.fromEntries(Object.entries(data).map(([key, records]) => [key,
        records.filter(record => record.name === user.name || record.student === user.name)
    ]));
    const assignedRooms = new Set(visible.allocation.filter(item => item.status === "Active").map(item => item.room));
    visible.rooms = data.rooms.filter(room => assignedRooms.has(`${room.block}-${room.room}`));
    visible.mess = data.mess;
    return visible;
}

function hostelSummary() {
    const activeComplaints = data.complaints.filter(item => item.status !== "Resolved");
    const summary = {
        beds: data.rooms.reduce((sum, room) => sum + Number(room.occupied || 0), 0),
        capacity: data.rooms.reduce((sum, room) => sum + Number(room.capacity || 0), 0),
        activeComplaints: activeComplaints.length,
        priorityComplaints: activeComplaints.filter(item => item.priority === "High").length,
        pendingLeaves: data.leave.filter(item => item.status === "Pending").length,
        studentsWithDues: data.fees.filter(item => Number(item.pending) > 0).length,
        outstanding: data.fees.reduce((sum, item) => sum + Number(item.pending || 0), 0)
    };
    summary.occupancy = summary.capacity ? Math.round(summary.beds / summary.capacity * 100) : 0;
    return summary;
}

function getInsights() {
    const summary = hostelSummary();
    const insights = [];
    if (summary.priorityComplaints) insights.push({ level: "urgent", icon: "bi-wrench-adjustable", text: `${summary.priorityComplaints} high-priority maintenance request${summary.priorityComplaints === 1 ? "" : "s"} need attention.` });
    if (summary.pendingLeaves) insights.push({ level: "notice", icon: "bi-calendar2-check", text: `${summary.pendingLeaves} leave request${summary.pendingLeaves === 1 ? " is" : "s are"} waiting for review.` });
    if (summary.studentsWithDues) insights.push({ level: "notice", icon: "bi-cash-coin", text: `${summary.studentsWithDues} residents have outstanding fees totalling ₹${summary.outstanding.toLocaleString("en-IN")}.` });
    if (summary.occupancy >= 90) insights.push({ level: "urgent", icon: "bi-door-closed", text: `Bed occupancy is ${summary.occupancy}%; review remaining capacity before new allocations.` });
    if (!insights.length) insights.push({ level: "positive", icon: "bi-check2-circle", text: "No urgent hostel actions found. Core operations are up to date." });
    return insights;
}

async function askModel(prompt) {
    if (!process.env.OPENAI_API_KEY) return null;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.2, messages: [
            { role: "system", content: "You are HostelHub's operations assistant. Give concise, practical recommendations based only on aggregate hostel data. Do not invent facts or make decisions about students." },
            { role: "user", content: prompt }
        ] }),
        signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error("AI provider request failed.");
    const result = await response.json();
    return result.choices?.[0]?.message?.content?.trim() || null;
}

app.post("/api/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false }), async (req, res) => {
    const username = String(req.body?.username || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const account = users.find(user => user.username === username);
    const valid = account && await bcrypt.compare(password, account.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid username or password." });
    const user = { username: account.username, name: account.name, role: account.role };
    res.json({ token: jwt.sign(user, JWT_SECRET, { expiresIn: "8h" }), user });
});

app.get("/api/auth/me", authenticate, (req, res) => res.json({ user: req.user }));
app.get("/api/data", authenticate, async (req, res) => {
    data = await readData();
    res.json({ data: visibleData(req.user) });
});

async function getWeeklyMenu() {
    const dishes = await MessMenu.find().sort({ day_of_week: 1, meal_type: 1, name: 1 }).lean();
    return DAYS_OF_WEEK.map(day_of_week => ({
        day_of_week,
        meals: MEAL_TYPES.map(meal_type => ({
            meal_type,
            dishes: dishes
                .filter(dish => dish.day_of_week === day_of_week && dish.meal_type === meal_type)
                .map(dish => ({ id: String(dish._id), name: dish.name }))
        }))
    }));
}

app.get("/api/mess/menu", authenticate, async (_req, res) => {
    res.json({ days: await getWeeklyMenu() });
});

app.put("/api/mess/menu", authenticate, requireStaff, async (req, res) => {
    const days = req.body?.days;
    if (!Array.isArray(days) || days.length !== DAYS_OF_WEEK.length) {
        return res.status(400).json({ error: "A complete Sunday-to-Saturday menu is required." });
    }

    const desired = [];
    for (const [index, day] of days.entries()) {
        if (day?.day_of_week !== DAYS_OF_WEEK[index] || !day.meals || typeof day.meals !== "object") {
            return res.status(400).json({ error: "Menu days must be ordered Sunday through Saturday." });
        }
        for (const meal_type of MEAL_TYPES) {
            if (!Array.isArray(day.meals[meal_type])) {
                return res.status(400).json({ error: `Provide a dish list for ${DAYS_OF_WEEK[index]} ${meal_type}.` });
            }
            for (const rawName of day.meals[meal_type]) {
                if (typeof rawName !== "string" || rawName.trim().length > 100) {
                    return res.status(400).json({ error: "Dish names must be text under 100 characters." });
                }
                const name = rawName.trim();
                if (name && !desired.some(dish => dish.day_of_week === day.day_of_week && dish.meal_type === meal_type && dish.name === name)) {
                    desired.push({ day_of_week: day.day_of_week, meal_type, name });
                }
            }
        }
    }

    for (const dish of desired) {
        await MessMenu.updateOne(
            dish,
            { $setOnInsert: dish },
            { upsert: true }
        );
    }
    const desiredNames = new Set(desired.map(dish => JSON.stringify([dish.day_of_week, dish.meal_type, dish.name])));
    const currentDishes = await MessMenu.find().select("day_of_week meal_type name").lean();
    const removedIds = currentDishes
        .filter(dish => !desiredNames.has(JSON.stringify([dish.day_of_week, dish.meal_type, dish.name])))
        .map(dish => dish._id);
    if (removedIds.length) {
        await MealSelection.deleteMany({ dish_id: { $in: removedIds } });
        await MessMenu.deleteMany({ _id: { $in: removedIds } });
    }
    res.json({ days: await getWeeklyMenu() });
});

app.get("/api/mess/selections", authenticate, async (req, res) => {
    if (req.user.role !== "Student") return res.status(403).json({ error: "Student access is required." });
    const student = data.students.find(item => item.name === req.user.name);
    if (!student) return res.status(404).json({ error: "Student profile not found." });
    const selections = await MealSelection.find({ student_id: Number(student.id) }).populate("dish_id", "name").lean();
    res.json({ selections: selections.map(selection => ({
        day_of_week: selection.day_of_week,
        meal_type: selection.meal_type,
        dish_id: String(selection.dish_id?._id || selection.dish_id),
        dish_name: selection.dish_id?.name || ""
    })) });
});

app.put("/api/mess/selections", authenticate, async (req, res) => {
    if (req.user.role !== "Student") return res.status(403).json({ error: "Meal choices can only be submitted by a student account." });
    const student = data.students.find(item => item.name === req.user.name);
    if (!student) return res.status(404).json({ error: "Student profile not found." });
    const selections = req.body?.selections;
    if (!Array.isArray(selections)) return res.status(400).json({ error: "Submit a weekly selection list." });

    const uniqueSelections = [...new Map(selections.map(selection => [
        JSON.stringify([selection?.day_of_week, selection?.meal_type, selection?.dish_id]), selection
    ])).values()];
    if (uniqueSelections.some(selection => !selection
        || !DAYS_OF_WEEK.includes(selection.day_of_week)
        || !MEAL_TYPES.includes(selection.meal_type)
        || !mongoose.Types.ObjectId.isValid(String(selection.dish_id || "")))) {
        return res.status(400).json({ error: "Choose valid dishes for each weekday meal." });
    }
    const menuDishes = await MessMenu.find({ _id: { $in: uniqueSelections.map(selection => selection?.dish_id).filter(Boolean) } }).lean();
    const dishesById = new Map(menuDishes.map(dish => [String(dish._id), dish]));
    const validMeals = new Set(MEAL_TYPES);
    for (const selection of uniqueSelections) {
        const dish = dishesById.get(String(selection?.dish_id));
        if (!DAYS_OF_WEEK.includes(selection?.day_of_week) || !validMeals.has(selection?.meal_type)
            || !dish || dish.day_of_week !== selection.day_of_week || dish.meal_type !== selection.meal_type) {
            return res.status(400).json({ error: "Selections must match dishes in the weekly menu." });
        }
    }

    const records = uniqueSelections.map(selection => ({
        student_id: Number(student.id),
        username: req.user.username,
        student: student.name,
        day_of_week: selection.day_of_week,
        meal_type: selection.meal_type,
        dish_id: dishesById.get(String(selection.dish_id))._id
    }));
    await MealSelection.deleteMany({ student_id: Number(student.id) });
    if (records.length) await MealSelection.insertMany(records, { ordered: true });
    res.json({ selections: records.map(selection => ({
        day_of_week: selection.day_of_week,
        meal_type: selection.meal_type,
        dish_id: String(selection.dish_id)
    })) });
});

app.get("/api/mess/demand", authenticate, requireStaff, async (_req, res) => {
    const [menuDays, selections] = await Promise.all([
        getWeeklyMenu(),
        MealSelection.find().select("day_of_week meal_type dish_id").lean()
    ]);
    const counts = new Map();
    for (const selection of selections) {
        const key = JSON.stringify([selection.day_of_week, selection.meal_type, String(selection.dish_id)]);
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    res.json({ days: menuDays.map(day => {
        const daySelections = selections.filter(selection => selection.day_of_week === day.day_of_week);
        return {
            day_of_week: day.day_of_week,
            has_selections: daySelections.length > 0,
            meals: day.meals.map(meal => ({
                meal_type: meal.meal_type,
                dishes: meal.dishes.map(dish => ({
                    id: dish.id,
                    name: dish.name,
                    count: counts.get(JSON.stringify([day.day_of_week, meal.meal_type, dish.id])) || 0
                }))
            }))
        };
    }) });
});

app.post("/api/data/:module", authenticate, requireStaff, async (req, res) => {
    if (!MODULES.includes(req.params.module)) return res.status(404).json({ error: "Unknown hostel module." });
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) return res.status(400).json({ error: "A record is required." });
    const record = { ...req.body, id: await nextId(req.params.module) };
    if (req.params.module === "fees") {
        record.total = Number(record.total); record.paid = Number(record.paid);
        if (!Number.isFinite(record.total) || !Number.isFinite(record.paid) || record.total < 0 || record.paid < 0 || record.paid > record.total) return res.status(400).json({ error: "Fee amounts must be valid and paid cannot exceed total." });
        record.pending = Math.max(0, record.total - record.paid); record.status = record.pending ? "Pending" : "Paid";
    }
    if (req.params.module === "rooms") {
        record.capacity = Number(record.capacity); record.occupied = Number(record.occupied || 0);
        if (record.capacity < 1 || record.occupied < 0 || record.occupied > record.capacity) return res.status(400).json({ error: "Room occupancy must be within its capacity." });
        record.status = record.occupied >= record.capacity ? "Occupied" : "Available";
    }
    await HostelRecord.create({ module: req.params.module, recordId: record.id, record });
    data = await readData();
    res.status(201).json({ record });
});

app.patch("/api/data/:module/:id", authenticate, requireStaff, async (req, res) => {
    if (!MODULES.includes(req.params.module)) return res.status(404).json({ error: "Unknown hostel module." });
    const document = await HostelRecord.findOne({ module: req.params.module, recordId: Number(req.params.id) });
    if (!document) return res.status(404).json({ error: "Record not found." });
    const record = document.record;
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) return res.status(400).json({ error: "A record update is required." });
    const changes = { ...req.body };
    delete changes.id;
    const updated = { ...record, ...changes };
    if (req.params.module === "fees") {
        updated.total = Number(updated.total); updated.paid = Number(updated.paid);
        if (!Number.isFinite(updated.total) || !Number.isFinite(updated.paid) || updated.total < 0 || updated.paid < 0 || updated.paid > updated.total) return res.status(400).json({ error: "Fee amounts must be valid and paid cannot exceed total." });
        updated.pending = Math.max(0, updated.total - updated.paid); updated.status = updated.pending ? "Pending" : "Paid";
    }
    if (req.params.module === "rooms") {
        updated.capacity = Number(updated.capacity); updated.occupied = Number(updated.occupied || 0);
        if (!Number.isFinite(updated.capacity) || !Number.isFinite(updated.occupied) || updated.capacity < 1 || updated.occupied < 0 || updated.occupied > updated.capacity) return res.status(400).json({ error: "Room occupancy must be within its capacity." });
        updated.status = updated.occupied >= updated.capacity ? "Occupied" : "Available";
    }
    document.record = updated;
    await document.save();
    data = await readData();
    res.json({ record: updated });
});

app.delete("/api/data/:module/:id", authenticate, requireStaff, async (req, res) => {
    if (!MODULES.includes(req.params.module)) return res.status(404).json({ error: "Unknown hostel module." });
    const result = await HostelRecord.deleteOne({ module: req.params.module, recordId: Number(req.params.id) });
    if (!result.deletedCount) return res.status(404).json({ error: "Record not found." });
    data = await readData();
    res.status(204).end();
});

app.post("/api/actions/vacate/:id", authenticate, requireStaff, async (req, res) => {
    const allocationDocument = await HostelRecord.findOneAndUpdate(
        { module: "allocation", recordId: Number(req.params.id), "record.status": "Active" },
        { $set: { "record.status": "Vacated" } },
        { returnDocument: "after" }
    );
    if (!allocationDocument) return res.status(404).json({ error: "Active allocation not found." });
    const allocation = allocationDocument.record;
    const roomDocument = await HostelRecord.findOne({
        module: "rooms",
        "record.block": allocation.room.split("-")[0],
        "record.room": allocation.room.split("-").slice(1).join("-")
    });
    let room;
    if (roomDocument) {
        room = roomDocument.record;
        room.occupied = Math.max(0, Number(room.occupied) - 1);
        room.status = room.occupied >= room.capacity ? "Occupied" : "Available";
        roomDocument.record = room;
        await roomDocument.save();
    }
    data = await readData();
    res.json({ allocation, room });
});

app.get("/api/ai/insights", authenticate, requireStaff, async (_req, res) => {
    data = await readData();
    res.json({ mode: "local", assistantMode: process.env.OPENAI_API_KEY ? "openai" : "local", insights: getInsights() });
});
app.post("/api/ai/assistant", authenticate, requireStaff, rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false }), async (req, res) => {
    const question = String(req.body?.question || "").trim().slice(0, 500);
    if (!question) return res.status(400).json({ error: "Enter a question first." });
    data = await readData();
    const summary = hostelSummary();
    try {
        const answer = await askModel(`Question: ${question}\nAggregate hostel metrics: ${JSON.stringify(summary)}\nOperational insights: ${JSON.stringify(getInsights())}`);
        if (answer) return res.json({ answer, mode: "openai" });
    } catch (error) { console.error(error.message); }
    const normalized = question.toLowerCase();
    let answer;
    if (/occup|room|bed/.test(normalized)) answer = `${summary.beds} of ${summary.capacity} beds are occupied (${summary.occupancy}%); ${summary.capacity - summary.beds} are available.`;
    else if (/fee|due|payment/.test(normalized)) answer = `${summary.studentsWithDues} residents have outstanding fees totalling ₹${summary.outstanding.toLocaleString("en-IN")}. Review the Fees section for individual records.`;
    else if (/complaint|maintenance|repair/.test(normalized)) answer = `${summary.activeComplaints} maintenance requests remain open; ${summary.priorityComplaints} are marked high priority. Prioritize those first.`;
    else if (/leave|out-pass/.test(normalized)) answer = `${summary.pendingLeaves} leave request${summary.pendingLeaves === 1 ? " is" : "s are"} pending review.`;
    else answer = `I can summarize occupancy (${summary.occupancy}%), open maintenance (${summary.activeComplaints}), fee dues (₹${summary.outstanding.toLocaleString("en-IN")}) and pending leave (${summary.pendingLeaves}). Ask about one area for a focused recommendation.`;
    res.json({ answer, mode: "local" });
});

app.get("/api/health", (_req, res) => res.json({ status: mongoose.connection.readyState === 1 ? "ok" : "degraded", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));
app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ error: "An unexpected server error occurred." }); });

async function start() {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
    await initializeDatabase();
    await migrateLegacyMessData();
    for (const account of users) account.passwordHash = await bcrypt.hash(account.password, 12);
    app.listen(PORT, () => {
        console.log(`HostelHub running at http://localhost:${PORT}`);
        if (!process.env.JWT_SECRET) console.warn("JWT_SECRET is not set; sessions reset when the server restarts.");
    });
}

start();