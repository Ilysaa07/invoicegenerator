const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');

const app = express();
const port = 5000;

// Enable GZIP compression
app.use(compression());

// Setup CORS
app.use(cors());

// Set the body size limits for JSON and URL-encoded requests
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'invoice_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Endpoint to save invoice
app.post('/saveForm', (req, res) => {
  const {
    name, address, clientName, clientAddress, invoiceNumber, invoiceDate, dueDate,
    notes, terms, discount, tax, shipping, logo, rows, poNumber, amountPaid
  } = req.body;

  // Validasi sederhana untuk memastikan field-field penting terisi
  if (!name || !address || !clientName || !clientAddress || !invoiceNumber || !invoiceDate || !dueDate) {
    return res.status(400).send({ message: 'Field wajib tidak boleh kosong' });
  }

  const query = `
    INSERT INTO invoices (name, address, clientName, clientAddress, invoiceNumber, invoiceDate, dueDate, notes, terms, discount, tax, shipping, logo,  poNumber, amountPaid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    name, address, clientName, clientAddress, invoiceNumber, invoiceDate, dueDate,
    notes, terms, discount, tax, shipping, logo, poNumber, amountPaid
  ], (err, result) => {
    if (err) throw err;
    const invoiceId = result.insertId;

    // Insert invoice rows
    const rowQuery = `INSERT INTO invoice_rows (invoice_id, description, quantity, price, amount) VALUES ?`;
    const rowsValues = rows.map(row => [invoiceId, row.description, row.quantity, row.price, row.amount]);

    db.query(rowQuery, [rowsValues], (err) => {
      if (err) throw err;
      res.send({ message: 'Invoice saved successfully!' });
    });
  });
});

// Endpoint to get invoice by ID
app.get('/invoice/:id', (req, res) => {
  const invoiceId = req.params.id;

  const invoiceQuery = `SELECT * FROM invoices WHERE id = ?`;
  db.query(invoiceQuery, [invoiceId], (err, invoice) => {
    if (err) throw err;

    const rowsQuery = `SELECT * FROM invoice_rows WHERE invoice_id = ?`;
    db.query(rowsQuery, [invoiceId], (err, rows) => {
      if (err) throw err;

      res.send({ ...invoice[0], rows });
    });
  });
});


// Endpoint to get all invoices
app.get('/invoiceHistory', (req, res) => {
  const query = `
    SELECT invoices.*, 
      (SELECT SUM(amount) FROM invoice_rows WHERE invoice_rows.invoice_id = invoices.id) as totalAmount
    FROM invoices
  `;
  db.query(query, (err, invoices) => {
    if (err) throw err;
    res.send(invoices);
  });
});

// Endpoint to delete an invoice
app.delete('/deleteInvoice/:id', (req, res) => {
  const invoiceId = req.params.id;

  const deleteRowsQuery = `DELETE FROM invoice_rows WHERE invoice_id = ?`;
  db.query(deleteRowsQuery, [invoiceId], (err) => {
    if (err) throw err;

    const deleteInvoiceQuery = `DELETE FROM invoices WHERE id = ?`;
    db.query(deleteInvoiceQuery, [invoiceId], (err) => {
      if (err) throw err;
      res.send({ message: 'Invoice deleted successfully!' });
    });
  });
});

// Endpoint to update an invoice
app.put('/updateInvoice/:id', (req, res) => {
  const invoiceId = req.params.id;
  const {
    name, address, clientName, clientAddress, invoiceNumber, invoiceDate, dueDate,
    notes, terms, discount, tax, shipping, logo, rows, poNumber, amountPaid
  } = req.body;

  const query = `UPDATE invoices SET 
    name = ?, address = ?, clientName = ?, clientAddress = ?, invoiceNumber = ?, invoiceDate = ?, dueDate = ?, 
    notes = ?, terms = ?, discount = ?, tax = ?, shipping = ?, logo = ?,  poNumber = ?, amountPaid = ?
    WHERE id = ?`;

  db.query(query, [
    name, address, clientName, clientAddress, invoiceNumber, invoiceDate, dueDate,
    notes, terms, discount, tax, shipping, logo, poNumber, amountPaid, invoiceId
  ], (err) => {
    if (err) throw err;

    const deleteRowsQuery = `DELETE FROM invoice_rows WHERE invoice_id = ?`;
    db.query(deleteRowsQuery, [invoiceId], (err) => {
      if (err) throw err;

      const insertRowsQuery = `INSERT INTO invoice_rows (invoice_id, description, quantity, price, amount) VALUES ?`;
      const rowsValues = rows.map(row => [invoiceId, row.description, row.quantity, row.price, row.amount]);
      db.query(insertRowsQuery, [rowsValues], (err) => {
        if (err) throw err;
        res.send({ message: 'Invoice updated successfully!' });
      });
    });
  });
});

// Endpoint to update invoice status
app.put('/updateStatus/:id', (req, res) => {
  const invoiceId = req.params.id;
  const { status } = req.body; // Expecting status from the request body

  const query = `UPDATE invoices SET status = ? WHERE id = ?`;

  db.query(query, [status, invoiceId], (err) => {
    if (err) throw err;
    res.send({ message: 'Invoice status updated successfully!' });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
