import { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from "./components/Footer";
import Notes from "./components/Notes";
import Table from "./components/Table";
import MainDetails from "./components/MainDetails";
import ClientDetails from "./components/ClientDetails";
import Header from "./components/Header";
import Dates from "./components/Dates";
import TableForm from "./components/TableForm";
import ReactToPrint from "react-to-print";
import { IoIosCloseCircle } from "react-icons/io";
import axios from 'axios';
import Navbar from "./components/Navbar";
import Swal from 'sweetalert2';
import { MdManageHistory } from "react-icons/md";
import ReactDOMServer from 'react-dom/server';
import "./index.css";
import InvoiceHistory from "./components/InvoiceHistory"; // Import the new component

function App() {
  const [showInvoice, setShowInvoice] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [website, setWebsite] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setinvoiceDate] = useState("");
  const [dueDate, setdueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [logoUrl, setLogoUrl] = useState(""); // State for the logo data URL
  const [title, setTitle] = useState("INVOICE");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);

  const iconSweet = ReactDOMServer.renderToString(<MdManageHistory />);
  const componentRef = useRef();

  

  const handleSave = async () => {
    try {
      // Prepare data
      const dataToSend = {
        name, address, email, phone, bankName, bankAccount, website,
        clientName, clientAddress, invoiceNumber, invoiceDate, dueDate,
        notes, discount, tax, shipping,
        rows: rows.map(row => ({
          description: row.description,
          quantity: row.quantity,
          price: row.price,
          amount: row.amount
        }))
      };
  
      // Check if updating an existing invoice
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
  
      if (id) {
        // If an ID exists, update the existing invoice
        await axios.put(`http://localhost:5000/updateInvoice/${id}`, dataToSend);
      } else {
        // Otherwise, save a new invoice
        await axios.post('http://localhost:5000/saveForm', dataToSend);
      };
  
      // Notify user on success
      Swal.fire({
        title: "Invoice berhasil tersimpan!",
        html: `Untuk melihat riwayat invoice<br>klik ikon<div class="flex items-center justify-center text-xl font-bold">${iconSweet}</div>`,
        icon: "success",
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600'
        }
      });
     
  
    } catch (error) {
      // Handle error
      console.error('Error saving form:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "Ada sesuatu yang salah!",
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600'
        }
      });
    }
  };


  const formatDateForInput = (isoDate) => {
    return isoDate.split('T')[0];
  };
  
  useEffect(() => {
    const fetchInvoiceById = async (id) => {
      console.log('Fetching invoice with ID:', id);  // Debug log
      try {
        const response = await axios.get(`http://localhost:5000/invoice/${id}`);
        const invoice = response.data;
  
        console.log('Fetched invoice:', invoice);  // Debug log
  
        // Assign the fetched invoice data to the form fields
        setName(invoice.name);
        setAddress(invoice.address);
        setEmail(invoice.email);
        setPhone(invoice.phone);
        setBankName(invoice.bankName);
        setBankAccount(invoice.bankAccount);
        setWebsite(invoice.website);
        setClientName(invoice.clientName);
        setClientAddress(invoice.clientAddress);
        setInvoiceNumber(invoice.invoiceNumber);
        setinvoiceDate(formatDateForInput(invoice.invoiceDate));  // Format the date
        setdueDate(formatDateForInput(invoice.dueDate));  // Format the date
        setNotes(invoice.notes);
        setDiscount(invoice.discount);
        setTax(invoice.tax);
        setShipping(invoice.shipping);
        setRows(invoice.rows || []);  // Handle rows separately
  
      } catch (error) {
        console.error('Error fetching invoice:', error);
        // Optionally handle errors here, e.g., set an error state or display a message
      }
    };
  
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('Fetched ID from URL:', id);  // Debug log
    if (id) {
      fetchInvoiceById(id);
      setShowInvoice(false);  // Ensure form is shown for editing
    }
  }, []);
  

  
  


  useEffect(() => {
    const calculateTotal = () => {
      console.log('Rows:', rows);  // Log rows array
      console.log('Discount:', discount);  // Log discount
      console.log('Tax:', tax);  // Log tax
      console.log('Shipping:', shipping);  // Log shipping
  
      // Ensure rows contain valid numeric values
      let subtotal = rows.reduce((sum, item) => {
        const itemAmount = parseFloat(item.amount);
        console.log('Item amount:', itemAmount);  // Log each item amount
        return sum + (isNaN(itemAmount) ? 0 : itemAmount);
      }, 0);
  
      console.log('Subtotal:', subtotal);  // Log subtotal
  
      // Calculate discount, tax, and shipping with valid numbers
      let discountAmount = (subtotal * (parseFloat(discount) || 0)) / 100;
      let taxAmount = (subtotal * (parseFloat(tax) || 0)) / 100;
      let shippingCost = parseFloat(shipping) || 0;
  
      console.log('Discount amount:', discountAmount);  // Log discount amount
      console.log('Tax amount:', taxAmount);  // Log tax amount
      console.log('Shipping cost:', shippingCost);  // Log shipping cost
  
      // Calculate grand total
      let grandTotal = subtotal - discountAmount + taxAmount + shippingCost;
      console.log('Grand Total:', grandTotal);  // Log grand total
  
      setTotal(grandTotal);
    };
  
    calculateTotal();
  }, [rows, discount, tax, shipping]);
  
  

  // Function to handle file input and convert it to a data URL
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result); // Set the logo URL to the data URL
      };
      reader.readAsDataURL(file); // Convert the file to a data URL
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main className="m-5 p-5 md:max-w-xl md:mx-auto lg:max-w-2xl xl:max-w-4xl rounded shadow bg-white" id="main">
            {showInvoice ? (
              <>
                <div ref={componentRef}>
                  <Header 
                    image={logoUrl}
                    title={title} 
                  />
                  <MainDetails 
                    name={name} 
                    address={address} 
                  />
                  <ClientDetails
                    clientName={clientName}
                    clientAddress={clientAddress}
                  />
                  <Dates
                    invoiceNumber={invoiceNumber}
                    invoiceDate={invoiceDate}
                    dueDate={dueDate}
                  />
                  <Table
                    description={description}
                    amount={amount}
                    price={price}
                    quantity={quantity}
                    rows={rows}
                    setRows={setRows}
                    total={total}
                    setTotal={setTotal}
                    discount={discount}
                    tax={tax}
                    shipping={shipping}
                  />
                  <Notes notes={notes} />
                  <Footer
                    name={name}
                    address={address}
                    website={website}
                    email={email}
                    phone={phone}
                    bankAccount={bankAccount}
                    bankName={bankName}
                  />
                </div>
                <button
                  onClick={() => setShowInvoice(false)}
                  className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow 
                  border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 
                  transition-all duration-300"
                >
                  Edit Informasi
                </button>
                <ReactToPrint
                  trigger={() => (
                    <button
                      className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow 
                      border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 
                      transition-all duration-300 ml-5 mt-5"
                    >
                      Print / Download
                    </button>
                  )}
                  content={() => componentRef.current}
                />
              </>
            ) : (
              <>
                {/* Form to input the logo file */}
                <div className="flex items-center justify-between mb-5">
                  {/* Logo section */}
                  <div className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg relative">
                    <input
                      type="file"
                      name="logoFile"
                      id="logoFile"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {logoUrl ? (
                      <>
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <IoIosCloseCircle 
                          onClick={() => setLogoUrl("")}
                          className="absolute top-2 left-2 text-red-500 font-bold text-xl"
                        />
                      </>
                    ) : (
                      <label
                        htmlFor="logoFile"
                        className="cursor-pointer text-center light:text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        Tambah logo<br />
                        <span className="text-sm text-gray-500">+</span>
                      </label>
                    )}
                  </div>
                  {/* Title section */}
                  <input
                    type="text"
                    value={title}
                    id="titlename"
                    onChange={handleTitleChange}
                    placeholder="Masukkan judul"
                    className="text-4xl dark:text-gray-200 font-bold p-2 ml-4 w-60 dark:bg-gray-800"
                  />
                </div>
                <div className="">
                  <input
                    type="text"
                    name="invoiceNumber"
                    id="invoiceNumber"
                    placeholder="Nomor invoice"
                    autoComplete="off"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="text-lg dark:text-gray-200 p-2 w-52 dark:bg-gray-800"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <article className="md:grid grid-cols-2 gap-10">
                    <div className="flex flex-col">
                      <label htmlFor="name">Nama lengkap</label>
                      <input
                        type="text"
                        name="text"
                        id="name"
                        placeholder="Masukkan nama lengkap"
                        autoComplete="off"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="address">Alamat</label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Masukkan alamat"
                        autoComplete="off"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </article>
                  <article className="md:grid grid-cols-3 gap-10">
                    <div className="flex flex-col">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Masukkan email"
                        autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="website">Website</label>
                      <input
                        type="url"
                        name="website"
                        id="website"
                        placeholder="Masukkan url website"
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="phone">Nomor handphone</label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="Masukkan nomor handphone"
                        autoComplete="off"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </article>
                  <article className="md:grid grid-cols-2 gap-10">
                    <div className="flex flex-col">
                      <label htmlFor="bankName">Nama akun bank</label>
                      <input
                        type="text"
                        name="bankName"
                        id="bankName"
                        placeholder="Masukkan nama akun bank"
                        autoComplete="off"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="bankAccount">Nomor rekening bank</label>
                      <input
                        type="text"
                        name="bankAccount"
                        id="bankAccount"
                        placeholder="Masukkan nomor rekening bank"
                        autoComplete="off"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                      />
                    </div>
                  </article>
                  <article className="md:grid grid-cols-2 gap-10 md:mt-16">
                    <div className="flex flex-col">
                      <label htmlFor="clientName">Nama klien</label>
                      <input
                        type="text"
                        name="clientName"
                        id="clientName"
                        placeholder="Masukkan nama klien"
                        autoComplete="off"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="clientAddress">Alamat klien</label>
                      <input
                        type="text"
                        name="clientAddress"
                        id="clientAddress"
                        placeholder="Masukkan alamat klien"
                        autoComplete="off"
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                      />
                    </div>
                  </article>
                  <article className="md:grid grid-cols-3 gap-10">
                    <div className="flex flex-col">
                      <label htmlFor="invoiceDate">Tanggal invoice</label>
                      <input
                        type="date"
                        name="invoiceDate"
                        id="invoiceDate"
                        placeholder="Masukkan tanggal invoice"
                        autoComplete="off"
                        value={invoiceDate}
                        onChange={(e) => setinvoiceDate(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="dueDate">Tanggal jatuh tempo</label>
                      <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        placeholder="Due Date"
                        autoComplete="off"
                        value={dueDate}
                        onChange={(e) => setdueDate(e.target.value)}
                      />
                    </div>
                  </article>
                  <article>
                    <TableForm
                      description={description}
                      setDescription={setDescription}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      price={price}
                      setPrice={setPrice}
                      amount={amount}
                      setAmount={setAmount}
                      rows={rows}
                      setRows={setRows}
                      total={total}
                      setTotal={setTotal}
                      discount={discount}
                      setDiscount={setDiscount}
                      tax={tax}
                      setTax={setTax}
                      shipping={shipping}
                      setShipping={setShipping}
                    />
                  </article>
                  <div id="dpp" className="flex flex-wrap justify-end gap-4 mb-4 mt-4">
                    <div className="w-full sm:w-auto">
                      <label>Diskon (%): </label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="p-1 border border-gray-300 w-full sm:w-24"
                      />
                    </div>
                    <div className="w-full sm:w-auto">
                      <label>Pajak (%): </label>
                      <input
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        className="p-1 border border-gray-300 w-full sm:w-24"
                      />
                    </div>
                    <div className="w-full sm:w-auto">
                      <label>Pengiriman: </label>
                      <input
                        type="number"
                        value={shipping}
                        onChange={(e) => setShipping(e.target.value)}
                        className="p-1 border border-gray-300 w-full sm:w-24"
                      />
                    </div>
                  </div>
                  <label htmlFor="notes">Catatan tambahan</label>
                  <textarea
                    name="notes"
                    id="notes"
                    cols="30"
                    rows="10"
                    placeholder="Catatan tambahan"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                  <button
                    onClick={() => { setShowInvoice(true); handleSave(); }}
                    className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow 
                    border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 
                    transition-all duration-300"
                  >
                    Lihat Invoice
                  </button>
                </div>
              </>
            )}
          </main>
        } />
        <Route path="/history" element={<InvoiceHistory />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;
