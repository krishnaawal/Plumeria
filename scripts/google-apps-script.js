const SHEET_NAME = "Plumeria Orders";
const DASHBOARD_SHEET_NAME = "Dashboard";
const LOG_SHEET_NAME = "Submission Logs";
const SCRIPT_VERSION = "2026-07-11-fast-orders-background-receipts";
const PRODUCT_NAME = "White Flower Plumeria Plant";
const PRODUCT_PRICE = 500;
const DELIVERY_CHARGE = 150;
const MAX_QUANTITY = 8;

const HEADERS = [
  "Order ID",
  "Order Date",
  "Order Time",
  "Customer Name",
  "Phone",
  "Email",
  "Full Location",
  "Product ID",
  "Product Name",
  "Quantity",
  "Unit Price",
  "Subtotal",
  "Delivery Charge",
  "Total Amount",
  "Payment Method",
  "Payment Transaction Code",
  "Order Notes",
  "Order Status",
  "Payment Status",
  "Source",
  "Created At",
  "Receipt PDF"
];

function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = HEADERS.every((header, index) => firstRow[index] === header);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).clearContent();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#dce9d3");
  compactOrders(sheet);
  repairBlankFormulaRows(sheet);
  sheet.getRange("A:V").setVerticalAlignment("middle");
  sheet.getRange("J:N").setNumberFormat('"Rs." #,##0');
  sheet.autoResizeColumns(1, HEADERS.length);
  applySheetAutomation(sheet);
  setupSubmissionLog(spreadsheet);
  setupDashboard(spreadsheet);
  installReceiptTrigger();
}

function doGet() {
  return jsonResponse({
    success: true,
    message: "Plumeria order API is running",
    version: SCRIPT_VERSION
  });
}

function compactOrdersNow() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ensureOrderSheet(spreadsheet);

  compactOrders(sheet);
  repairBlankFormulaRows(sheet);
  setupDashboard(spreadsheet);
  logSubmission("Compacted", "", "Moved saved orders directly under the header");
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  let payload = null;

  try {
    lock.waitLock(10000);
    payload = parseRequest(e);
    logSubmission("Received", payload.orderId || "", "Request parsed");

    if (payload.honeypot) {
      logSubmission("Blocked", payload.orderId || "", "Honeypot filled");
      return jsonResponse({ success: false, message: "Unable to save the order" });
    }

    const validation = validatePayload(payload);
    if (!validation.success) {
      logSubmission("Validation failed", payload.orderId || "", validation.message);
      return jsonResponse(validation);
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ensureOrderSheet(spreadsheet);
    setupSubmissionLog(spreadsheet);
    setupDashboard(spreadsheet);
    const existingIds = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();

    if (existingIds.includes(payload.orderId)) {
      logSubmission("Duplicate", payload.orderId, "Order ID already exists");
      return jsonResponse({
        success: false,
        message: "This order has already been saved"
      });
    }

    const quantity = Number(payload.item.quantity);
    const nextRow = getNextOrderRow(sheet);
    const subtotal = quantity * PRODUCT_PRICE;
    const totalAmount = subtotal + DELIVERY_CHARGE;
    const receiptStatus = "Receipt pending";

    sheet.getRange(nextRow, 1, 1, HEADERS.length).setValues([[
      payload.orderId,
      payload.orderDate,
      payload.orderTime,
      payload.customer.fullName,
      payload.customer.phone,
      payload.customer.email,
      payload.customer.fullLocation,
      payload.item.productId,
      PRODUCT_NAME,
      quantity,
      PRODUCT_PRICE,
      `=J${nextRow}*K${nextRow}`,
      DELIVERY_CHARGE,
      `=L${nextRow}+M${nextRow}`,
      payload.paymentMethod,
      payload.paymentTransactionCode || "",
      payload.customer.orderNotes || "",
      "New",
      payload.paymentMethod === "cash_on_delivery" ? "Pending" : "Verification Required",
      "Website",
      payload.createdAt,
      receiptStatus
    ]]);

    sheet.getRange(nextRow, 10, 1, 5).setNumberFormat('"Rs." #,##0');
    sheet.autoResizeColumns(1, HEADERS.length);
    logSubmission("Order saved", payload.orderId, `Saved to row ${nextRow}`);

    return jsonResponse({
      success: true,
      message: "Order saved successfully",
      orderId: payload.orderId,
      receiptUrl: "",
      version: SCRIPT_VERSION
    });
  } catch (error) {
    logSubmission(
      "Error",
      payload && payload.orderId ? payload.orderId : "",
      error && error.message ? error.message : "Unable to save the order"
    );
    return jsonResponse({
      success: false,
      message: error && error.message ? error.message : "Unable to save the order"
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (error) {
      // Lock may not have been acquired if parsing failed very early.
    }
  }
}

function ensureOrderSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = HEADERS.every((header, index) => firstRow[index] === header);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).clearContent();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#dce9d3");
  compactOrders(sheet);
  repairBlankFormulaRows(sheet);
  sheet.getRange("A:V").setVerticalAlignment("middle");
  sheet.getRange("J:N").setNumberFormat('"Rs." #,##0');
  applySheetAutomation(sheet);

  return sheet;
}

function compactOrders(sheet) {
  const maxRows = sheet.getMaxRows();

  if (maxRows < 2) {
    return;
  }

  const rowCount = maxRows - 1;
  const values = sheet.getRange(2, 1, rowCount, HEADERS.length).getValues();
  const receiptFormulas = sheet.getRange(2, 22, rowCount, 1).getFormulas();
  const realRows = [];
  const realReceiptFormulas = [];

  values.forEach((row, index) => {
    if (String(row[0] || "").trim()) {
      realRows.push(row);
      realReceiptFormulas.push(receiptFormulas[index][0]);
    }
  });

  sheet.getRange(2, 1, rowCount, HEADERS.length).clearContent();

  if (realRows.length === 0) {
    return;
  }

  sheet.getRange(2, 1, realRows.length, HEADERS.length).setValues(realRows);

  realReceiptFormulas.forEach((formula, index) => {
    if (formula) {
      sheet.getRange(index + 2, 22).setFormula(formula);
    }
  });

  sheet.getRange(2, 10, realRows.length, 5).setNumberFormat('"Rs." #,##0');
}

function parseRequest(e) {
  const rawBody = e && e.postData && e.postData.contents ? String(e.postData.contents) : "";

  if (!rawBody) {
    throw new Error("Missing request body");
  }

  try {
    return JSON.parse(rawBody);
  } catch (error) {
    if (e && e.parameter && e.parameter.payload) {
      return JSON.parse(e.parameter.payload);
    }

    throw new Error("Invalid JSON request body");
  }
}

function validatePayload(payload) {
  const requiredCustomerFields = ["fullName", "phone", "email", "fullLocation"];

  if (!payload.orderId || !/^PLM-\d{8}-\d{4}$/.test(payload.orderId)) {
    return { success: false, message: "Invalid order ID" };
  }

  if (!payload.customer) {
    return { success: false, message: "Customer details are required" };
  }

  for (const field of requiredCustomerFields) {
    if (!String(payload.customer[field] || "").trim()) {
      return { success: false, message: "Missing required customer details" };
    }
  }

  if (!/^(98|97)\d{8}$/.test(String(payload.customer.phone))) {
    return { success: false, message: "Invalid phone number" };
  }

  if (!payload.item || payload.item.productName !== PRODUCT_NAME) {
    return { success: false, message: "Invalid product" };
  }

  const quantity = Number(payload.item.quantity);
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    return { success: false, message: "Invalid quantity" };
  }

  if (!["cash_on_delivery", "esewa_qr"].includes(payload.paymentMethod)) {
    return { success: false, message: "Invalid payment method" };
  }

  if (payload.paymentMethod === "esewa_qr" && !String(payload.paymentTransactionCode || "").trim()) {
    return { success: false, message: "Payment transaction code is required" };
  }

  return { success: true };
}

function getNextOrderRow(sheet) {
  const maxRows = sheet.getMaxRows();
  const orderIds = sheet.getRange(2, 1, Math.max(maxRows - 1, 1), 1).getValues();

  for (let index = orderIds.length - 1; index >= 0; index--) {
    if (String(orderIds[index][0] || "").trim()) {
      return index + 3;
    }
  }

  return 2;
}

function repairBlankFormulaRows(sheet) {
  const nextOrderRow = getNextOrderRow(sheet);
  const maxRows = sheet.getMaxRows();

  if (nextOrderRow <= maxRows) {
    sheet.getRange(nextOrderRow, 1, maxRows - nextOrderRow + 1, HEADERS.length).clearContent();
  }
}

function applySheetAutomation(sheet) {
  const maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  const orderStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["New", "Confirmed", "Packed", "Delivered", "Cancelled"], true)
    .setAllowInvalid(false)
    .build();
  const paymentStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pending", "Verification Required", "Paid", "Failed", "Refunded"], true)
    .setAllowInvalid(false)
    .build();
  const paymentMethodRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["cash_on_delivery", "esewa_qr"], true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange(2, 15, maxRows, 1).setDataValidation(paymentMethodRule);
  sheet.getRange(2, 18, maxRows, 1).setDataValidation(orderStatusRule);
  sheet.getRange(2, 19, maxRows, 1).setDataValidation(paymentStatusRule);
}

function setupDashboard(spreadsheet) {
  let dashboard = spreadsheet.getSheetByName(DASHBOARD_SHEET_NAME);

  if (!dashboard) {
    dashboard = spreadsheet.insertSheet(DASHBOARD_SHEET_NAME);
  }

  dashboard.clear();
  dashboard.getRange("A1:B1").setValues([["Plumeria Plant Shop", "Order Dashboard"]]);
  dashboard.getRange("A3:B10").setValues([
    ["Total Orders", `=COUNTA('${SHEET_NAME}'!A2:A)`],
    ["Total Plant Quantity", `=SUM('${SHEET_NAME}'!J2:J)`],
    ["Gross Sales", `=SUM('${SHEET_NAME}'!N2:N)`],
    ["Cash on Delivery Orders", `=COUNTIF('${SHEET_NAME}'!O2:O,"cash_on_delivery")`],
    ["Online QR Orders", `=COUNTIF('${SHEET_NAME}'!O2:O,"esewa_qr")`],
    ["New Orders", `=COUNTIF('${SHEET_NAME}'!R2:R,"New")`],
    ["Delivered Orders", `=COUNTIF('${SHEET_NAME}'!R2:R,"Delivered")`],
    ["Payments to Verify", `=COUNTIF('${SHEET_NAME}'!S2:S,"Verification Required")`]
  ]);
  dashboard.getRange("A1:B1").setFontWeight("bold").setBackground("#18301c").setFontColor("#ffffff");
  dashboard.getRange("A3:A10").setFontWeight("bold");
  dashboard.getRange("B5").setNumberFormat('"Rs." #,##0');
  dashboard.autoResizeColumns(1, 2);
}

function setupSubmissionLog(spreadsheet) {
  let logSheet = spreadsheet.getSheetByName(LOG_SHEET_NAME);

  if (!logSheet) {
    logSheet = spreadsheet.insertSheet(LOG_SHEET_NAME);
  }

  const headers = ["Timestamp", "Status", "Order ID", "Message"];
  const firstRow = logSheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = headers.every((header, index) => firstRow[index] === header);

  if (!hasHeaders) {
    logSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  logSheet.setFrozenRows(1);
  logSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#fff4dc");
  logSheet.autoResizeColumns(1, headers.length);
}

function installReceiptTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  const hasTrigger = triggers.some((trigger) => trigger.getHandlerFunction() === "generatePendingReceipts");

  if (!hasTrigger) {
    ScriptApp.newTrigger("generatePendingReceipts").timeBased().everyMinutes(1).create();
  }
}

function generatePendingReceipts() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ensureOrderSheet(spreadsheet);
  const lastOrderRow = getNextOrderRow(sheet) - 1;

  if (lastOrderRow < 2) {
    return;
  }

  const rows = sheet.getRange(2, 1, lastOrderRow - 1, HEADERS.length).getValues();

  rows.forEach((row, index) => {
    const sheetRow = index + 2;
    const orderId = String(row[0] || "").trim();
    const receiptCell = String(row[21] || "").trim();

    if (!orderId || receiptCell.startsWith("http") || receiptCell.includes("HYPERLINK")) {
      return;
    }

    if (receiptCell && !receiptCell.startsWith("Receipt pending")) {
      return;
    }

    const payload = {
      orderId,
      orderDate: row[1],
      orderTime: row[2],
      customer: {
        fullName: row[3],
        phone: row[4],
        email: row[5],
        fullLocation: row[6],
        orderNotes: row[16]
      },
      item: {
        productId: row[7],
        productName: row[8],
        quantity: Number(row[9])
      },
      paymentMethod: row[14]
    };
    const totals = {
      quantity: Number(row[9]),
      unitPrice: Number(row[10]),
      subtotal: Number(row[11]),
      deliveryCharge: Number(row[12]),
      totalAmount: Number(row[13])
    };

    try {
      const receiptUrl = createReceiptPdf(payload, totals);
      sheet.getRange(sheetRow, 22).setFormula(`=HYPERLINK("${receiptUrl}","Download / Print Receipt")`);
      logSubmission("Receipt created", orderId, receiptUrl);
    } catch (receiptError) {
      const message =
        "Receipt generation failed: " +
        (receiptError && receiptError.message ? receiptError.message : "Unknown error");
      sheet.getRange(sheetRow, 22).setValue(message);
      logSubmission("Receipt failed", orderId, message);
    }
  });
}

function logSubmission(status, orderId, message) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    setupSubmissionLog(spreadsheet);
    const logSheet = spreadsheet.getSheetByName(LOG_SHEET_NAME);

    logSheet.appendRow([new Date(), status, orderId, message]);
  } catch (error) {
    // Logging must never block order submission.
  }
}

function createReceiptPdf(payload, totals) {
  const folder = getReceiptFolder();
  const paymentLabel =
    payload.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Manual eSewa QR Payment";
  const doc = DocumentApp.create(`Receipt ${payload.orderId}`);
  const body = doc.getBody();

  body.clear();
  body.appendParagraph("PLUMERIA PLANT SHOP").setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph("Payment Receipt").setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(`Receipt / Order ID: ${payload.orderId}`);
  body.appendParagraph(`Date: ${payload.orderDate} ${payload.orderTime}`);
  body.appendParagraph("");
  body.appendParagraph("Customer Details").setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(`Name: ${payload.customer.fullName}`);
  body.appendParagraph(`Phone: ${payload.customer.phone}`);
  body.appendParagraph(`Email: ${payload.customer.email}`);
  body.appendParagraph(`Location: ${payload.customer.fullLocation}`);
  body.appendParagraph("");
  body.appendParagraph("Order Details").setHeading(DocumentApp.ParagraphHeading.HEADING3);

  const table = body.appendTable([
    ["Item", "Qty", "Unit Price", "Subtotal"],
    [PRODUCT_NAME, String(totals.quantity), `Rs. ${totals.unitPrice}`, `Rs. ${totals.subtotal}`],
    ["Delivery Charge", "", "", `Rs. ${totals.deliveryCharge}`],
    ["Total Amount", "", "", `Rs. ${totals.totalAmount}`],
    ["Payment Method", "", "", paymentLabel],
    ["Payment Status", "", "", payload.paymentMethod === "cash_on_delivery" ? "Pending" : "Verification Required"]
  ]);
  table.setBorderWidth(1);

  body.appendParagraph("");
  body.appendParagraph("Thank you for your purchase! Your order has been received successfully.");
  body.appendParagraph("We will contact you shortly to confirm your order and delivery details.");
  body.appendParagraph("");
  body.appendParagraph("Business: Plumeria Plant Shop");
  body.appendParagraph("Phone: 9861626549");
  body.appendParagraph("Email: unickbane@gmail.com");
  body.appendParagraph("Location: Kopundole, Lalitpur, Nepal");

  doc.saveAndClose();

  const docFile = DriveApp.getFileById(doc.getId());
  const pdfBlob = docFile.getAs(MimeType.PDF).setName(`Receipt-${payload.orderId}.pdf`);
  const pdfFile = folder.createFile(pdfBlob);
  docFile.setTrashed(true);

  return pdfFile.getUrl();
}

function getReceiptFolder() {
  const folders = DriveApp.getFoldersByName("Plumeria Receipts");

  if (folders.hasNext()) {
    return folders.next();
  }

  return DriveApp.createFolder("Plumeria Receipts");
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
