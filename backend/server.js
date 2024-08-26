const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Update with your MySQL password
  database: 'invoicedb'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('\x1b[31m','ERROR:', err);
    process.exit(1); // Exit if unable to connect
  } else {
    console.log("\x1b[30m","KONEKSI","\x1b[31m","DATABASE","\x1b[33m","BERHASIL");
  }
});

// Endpoint to save invoice data
app.post('/saveForm', (req, res) => {
  const {
    name, address, email, phone, bankName, bankAccount, website,
    clientName, clientAddress, invoiceNumber, invoiceDate, dueDate, notes, rows,
    discount, tax, shipping
  } = req.body;

  // Debug: Log the received request body
  console.log('Received request body:', req.body);

  // Insert main invoice data
  const invoiceQuery = `INSERT INTO invoices (name, address, email, phone, bankName, bankAccount, website, 
    clientName, clientAddress, invoiceNumber, invoiceDate, dueDate, notes, discount, tax, shipping) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  db.query(invoiceQuery, [name, address, email, phone, bankName, bankAccount, website, clientName, clientAddress, invoiceNumber, invoiceDate, dueDate, notes, discount, tax, shipping], (err, result) => {
    if (err) {
      // Debug: Log the error and query
      console.error('Error inserting invoice data:', err);
      console.error('SQL Query:', invoiceQuery);
      console.error('Values:', [name, address, email, phone, bankName, bankAccount, website, clientName, clientAddress, invoiceNumber, invoiceDate, dueDate, notes, discount, tax, shipping]);
      return res.status(500).send('Error saving invoice data');
    }

    const invoiceId = result.insertId;

    // Insert each row in the rows array
    if (rows.length > 0) {
      const rowQuery = `INSERT INTO invoice_rows (invoice_id, description, quantity, price, amount) VALUES ?`;
      const rowData = rows.map(row => [invoiceId, row.description, row.quantity, row.price, row.amount]);

      db.query(rowQuery, [rowData], (err, result) => {
        if (err) {
          // Debug: Log the error and query
          console.error('Error inserting row data:', err);
          console.error('SQL Query:', rowQuery);
          console.error('Row Data:', rowData);
          return res.status(500).send('Error saving row data');
        }

        res.status(200).send('Invoice data saved successfully');
      });
    } else {
      res.status(200).send('Invoice data saved successfully, but no rows to insert');
    }
  });
});



// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

