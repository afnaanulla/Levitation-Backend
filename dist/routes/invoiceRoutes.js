"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const invoiceController_1 = require("../controllers/invoiceController");
const router = (0, express_1.Router)();
router.post('/generate', auth_1.default, invoiceController_1.generateInvoice);
exports.default = router;
