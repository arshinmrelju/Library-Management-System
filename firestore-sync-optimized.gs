/**
 * INCREMENTAL SYNC: GOOGLE SHEETS → FIRESTORE
 * - Processes 300 records per run (Adjust BATCH_SIZE if needed)
 * - Resumes from where it left off using PropertiesService
 * - Zero FireStore Reads: Uses a 'Sync Hash' in Column M to detect changes
 * - Switch to 'Delta Mode' after full initial sync
 */

const FIREBASE_CONFIG = {
  project_id: "navodhayam-library"
};

const SYNC_CONFIG = {
  BATCH_SIZE: 300,
  HASH_COL: 13, // Column M
  STOCK_COL: 2,  // Column B
  START_ROW: 2   // Skip Header
};

/**
 * MAIN ENTRY POINT: Run this via Trigger or Menu
 */
function runIncrementalSync() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Book') || ss.getSheets()[0];
  const totalRows = sheet.getLastRow();
  
  const props = PropertiesService.getScriptProperties();
  let lastProcessed = parseInt(props.getProperty('LAST_SYNC_ROW')) || (SYNC_CONFIG.START_ROW - 1);
  
  // Reset if we reached the end
  if (lastProcessed >= totalRows) {
    console.log("Full sync cycle completed. Restarting from row 2...");
    lastProcessed = SYNC_CONFIG.START_ROW - 1;
  }

  const startRow = lastProcessed + 1;
  const numRows = Math.min(SYNC_CONFIG.BATCH_SIZE, totalRows - startRow + 1);
  
  if (numRows <= 0) {
    console.log("No new rows to sync.");
    return;
  }

  console.log(`Starting sync from row ${startRow} to ${startRow + numRows - 1}`);
  
  const dataRange = sheet.getRange(startRow, 1, numRows, SYNC_CONFIG.HASH_COL);
  const data = dataRange.getValues();
  const writeBatch = [];
  const updatedHashes = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const stock = String(row[1]); // Column B
    if (!stock || stock === "undefined") {
      updatedHashes.push([row[SYNC_CONFIG.HASH_COL - 1]]); // Keep same hash
      continue;
    }

    const docId = "BOOK-" + stock;
    const bookData = {
      stock_number: stock,
      call_number: String(row[2]),
      title: String(row[3]),
      author: String(row[4]),
      category: String(row[5]),
      language: String(row[6]),
      price: String(row[7]),
      publisher: String(row[8]),
      edition: String(row[9]),
      shelf: String(row[10]),
      available: true,
      last_updated: String(row[11] || "")
    };

    // Calculate Hash of current data
    const currentHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, JSON.stringify(bookData)));
    const storedHash = String(row[SYNC_CONFIG.HASH_COL - 1]);

    // 🚀 SKIP if data hasn't changed
    if (currentHash === storedHash) {
      updatedHashes.push([storedHash]);
      continue;
    }

    // ➕ ADD TO BATCH
    const docPath = `projects/${FIREBASE_CONFIG.project_id}/databases/(default)/documents/books/${docId}`;
    writeBatch.push({
      update: {
        name: docPath,
        fields: encodeFirestoreFields(bookData)
      }
    });

    updatedHashes.push([currentHash]);

    // Commit if batch is full
    if (writeBatch.length >= 500) {
      commitBatch(writeBatch);
      writeBatch.length = 0;
    }
  }

  // Final flush
  if (writeBatch.length > 0) {
    commitBatch(writeBatch);
  }

  // Update hash column for the processed batch
  sheet.getRange(startRow, SYNC_CONFIG.HASH_COL, numRows, 1).setValues(updatedHashes);

  // Save progress
  props.setProperty('LAST_SYNC_ROW', (startRow + numRows - 1).toString());
  
  console.log(`Successfully processed ${numRows} rows. Last row: ${startRow + numRows - 1}`);
}

/**
 * 📦 COMMIT BATCH TO FIRESTORE
 */
function commitBatch(writes) {
  const token = ScriptApp.getOAuthToken();
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.project_id}/databases/(default)/documents:commit`;

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + token },
    payload: JSON.stringify({ writes: writes }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {
    console.error("Batch Error:", response.getContentText());
    throw new Error("Batch commit failed.");
  }
}

/**
 * 🔄 ENCODE FOR FIRESTORE (REST API)
 */
function encodeFirestoreFields(data) {
  const fields = {};
  for (const key in data) {
    if (typeof data[key] === 'boolean') {
      fields[key] = { booleanValue: data[key] };
    } else {
      fields[key] = { stringValue: String(data[key]) };
    }
  }
  return fields;
}

/**
 * 📋 MENU BUTTONS
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Firebase Sync')
      .addItem('Run Incremental Sync (300 rows)', 'runIncrementalSync')
      .addItem('Reset Sync Progress', 'resetSyncPointer')
      .addToUi();
}

/**
 * 🧹 RESET POINTER
 */
function resetSyncPointer() {
  PropertiesService.getScriptProperties().deleteProperty('LAST_SYNC_ROW');
  SpreadsheetApp.getUi().alert("Sync pointer reset to Row 2.");
}

/**
 * ⏱️ AUTO UPDATE TIMESTAMP WHEN EDITING
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const row = range.getRow();
  if (row <= 1) return;

  const timestampCol = 12; // Column L
  sheet.getRange(row, timestampCol).setValue(new Date().toISOString());
}
