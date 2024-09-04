  // server.js

  const express = require('express');
  const mysql = require('mysql2');
  const bodyParser = require('body-parser');
  const cors = require('cors');

  const app = express();
  const port = 5000;

  // Setup CORS
  app.use(cors());

  // Parse JSON bodies
  app.use(bodyParser.json());

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
      name, address, email, phone, bankName, bankAccount, website,
      clientName, clientAddress, invoiceNumber, invoiceDate, dueDate,
      notes, discount, tax, shipping, rows
    } = req.body;

    const query = `
      INSERT INTO invoices (name, address, email, phone, bankName, bankAccount, website,
      clientName, clientAddress, invoiceNumber, invoiceDate, dueDate, notes, discount, tax, shipping)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      name, address, email, phone, bankName, bankAccount, website,
      clientName, clientAddress, invoiceNumber, invoiceDate, dueDate,
      notes, discount, tax, shipping
    ], (err, result) => {
      if (err) throw err;
      const invoiceId = result.insertId;

      // Insert rows
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

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
