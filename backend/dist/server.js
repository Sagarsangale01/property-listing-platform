"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/v1/authRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/v1/propertyRoutes"));
const enquiryRoutes_1 = __importDefault(require("./routes/v1/enquiryRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/v1/notificationRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Main Root route
app.get('/', (req, res) => {
    res.json({ message: 'Property API is running...' });
});
// APIs Versioning
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/properties', propertyRoutes_1.default);
app.use('/api/v1/enquiries', enquiryRoutes_1.default);
app.use('/api/v1/notifications', notificationRoutes_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.initDb)();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
