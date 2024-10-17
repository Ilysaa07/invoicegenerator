import { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Notes from "./components/Notes";
import Table from "./components/Table";
import MainDetails from "./components/MainDetails";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getYear, getMonth } from 'date-fns'; // Make sure to install date-fns if you haven't already
import range from 'lodash/range'; // Install lodash for the range function


function App() {
  const [showInvoice, setShowInvoice] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date()); // Use Date object
  const [dueDate, setDueDate] = useState(new Date()); // Use Date object
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");  // State for "Ketentuan"
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
  const [poNumber, setPoNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);
  

  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [showTaxInput, setShowTaxInput] = useState(false);
  const [showShippingInput, setShowShippingInput] = useState(false);

  const [discountInRupiah, setDiscountInRupiah] = useState(0);
  const [taxInRupiah, setTaxInRupiah] = useState(0);
  const [shippingInRupiah, setShippingInRupiah] = useState(0);
  const [formattedAmountPaid, setFormattedAmountPaid] = useState("");


  const iconSweet = ReactDOMServer.renderToString(<MdManageHistory />);
  const componentRef = useRef();

const years = range(1990, getYear(new Date()) + 1, 1);
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const handleSave = async () => {
    if (!name || !address || !clientName || !clientAddress || !invoiceNumber || !invoiceDate || !dueDate) {
      Swal.fire({
        title: "Error",
        text: "Pastikan semua field terisi!",
        icon: "error",
        confirmButtonText: 'OK',
      });
      return; // Stop the save process if validation fails
    }
    const dataToSend = {
      name, address,
      clientName, clientAddress, invoiceNumber, 
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0], 
      notes, terms, discount, discountInRupiah, tax, taxInRupiah, shipping, poNumber, amountPaid, logo: logoUrl, // Send Base64 logo here
      rows: rows.map(row => ({
        description: row.description,
        quantity: row.quantity,
        price: row.price,
        amount: row.amount
      }))
    };

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      
      if (id) {
        await axios.put(`http://localhost:5000/updateInvoice/${id}`, dataToSend);
      } else {
        await axios.post('http://localhost:5000/saveForm', dataToSend);
      }
      
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
      console.error('Error saving invoice:', error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || 'Something went wrong!',
        icon: "error",
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600'
        }
      });
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('id-ID', options);
    // Split and reorder to ensure month comes first
    const [day, month, year] = formattedDate.split(' ');
    return `${month} ${day}, ${year}`;
  };
  

  useEffect(() => {
    const fetchInvoiceById = async (id) => {
      try {
        const response = await axios.get(`http://localhost:5000/invoice/${id}`);
        const invoice = response.data;
        console.log(response.data);  // Debugging: Check if poNumber and paymentTerms exist
  
        setName(invoice.name || "");
        setAddress(invoice.address || "");
        setClientName(invoice.clientName || "");
        setClientAddress(invoice.clientAddress || "");
        setInvoiceNumber(invoice.invoiceNumber || "");
        setInvoiceDate(new Date(invoice.invoiceDate || ""));
        setDueDate(new Date(invoice.dueDate || ""));
        setNotes(invoice.notes || "");
        setTerms(invoice.terms || "");  // Ensure terms is a string
        setDiscount(invoice.discount || 0);
        setTax(invoice.tax || 0);
        setShipping(invoice.shipping || 0);
        setRows(invoice.rows || []);  // Handle rows separately
        setLogoUrl(invoice.logo || ""); // Set logo if available
        // setPaymentTerms(invoice.paymentTerms || ""); 
        setPoNumber(invoice.poNumber || ""); 
        setAmountPaid(invoice.amountPaid || ""); 
      } catch (error) {
        console.error('Error fetching invoice:', error.response?.data || error.message);
      }
    };
  
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      fetchInvoiceById(id);
    }
  }, []);
  
  const handleNewInvoice = () => {
    setName("");
    setAddress("");
    setClientName("");
    setClientAddress("");
    setInvoiceNumber("");
    setInvoiceDate(null);
    setDueDate(null); 
    setNotes("");
    setTerms("");
    setDescription("");
    setQuantity("");
    setPrice("");
    setAmount("");
    setRows([]);
    setTotal(0);
    setLogoUrl("");
    setDiscount(0);
    setTax(0);
    setShipping(0);
    // setPaymentTerms("");
    setPoNumber("");
    setAmountPaid(0);
    setBalanceDue(0);
    setTitle("INVOICE");
  };
  

  useEffect(() => {
    const calculateTotal = () => {
      let subtotal = rows.reduce((sum, item) => {
        const itemAmount = parseFloat(item.amount);
        return sum + (isNaN(itemAmount) ? 0 : itemAmount);
      }, 0);

      let discountAmount = (subtotal * (parseFloat(discount) || 0)) / 100;
      let taxAmount = (subtotal * (parseFloat(tax) || 0)) / 100;
      let shippingCost = parseFloat(shipping) || 0;

      let grandTotal = subtotal - discountAmount + taxAmount + shippingCost;
      setTotal(grandTotal);
    };

    if (rows.length > 0 || discount || tax || shipping) {
      calculateTotal();
    }
  }, [rows, discount, tax, shipping]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 1 * 1024 * 1024; // 1 MB limit

    if (file) {
        if (file.size > maxSize) {
            Swal.fire({
                title: "File too large",
                text: "Logo size should not exceed 1MB.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;

            img.onload = () => {
                const originalWidth = img.width;
                const originalHeight = img.height;

                // Check if the image dimensions are greater than or equal to 1000
                if (originalWidth >= 1000 || originalHeight >= 1000) {
                    // Create a canvas element to resize the image
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    // Set the canvas size to the desired dimensions
                    canvas.width = 180;
                    canvas.height = 60;

                    // Draw the resized image onto the canvas
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Convert the canvas to a Base64 encoded image URL and set it
                    const resizedLogoUrl = canvas.toDataURL("image/png");
                    setLogoUrl(resizedLogoUrl); // Set the resized image as logo
                } else {
                    // If the image doesn't need resizing, just use the original
                    setLogoUrl(reader.result);
                }
            };
        };

        reader.readAsDataURL(file);
    }
};

  

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <Router>
      <Navbar 
      handleNewInvoice={handleNewInvoice}/>
      <Routes>
        <Route path="/" element={
          // <main className="m-5 p-5 md:max-w-md md:mx-auto lg:max-w-lg xl:max-w-xl rounded shadow bg-white" id="main">
          <main className={`m-5 p-5 rounded shadow bg-white items-center justify-center flex flex-col mx-auto 
            ${showInvoice ? 'md:max-w-2xl lg:max-w-3xl xl:max-w-4xl sm:max-w-full' : 'md:max-w-lg lg:max-w-lg xl:max-w-xl sm:max-w-full'}`} id="main">
            
            {showInvoice ? (
              <>
                <div ref={componentRef}>
                  <section className="flex justify-between">
                    <div className="flex flex-col">
                  <MainDetails 
                  image={logoUrl}
                    name={name} 
                    address={address} 
                    clientName={clientName}
                    clientAddress={clientAddress}
                  />
                  </div>
                  <div className="flex flex-col">
                  <Dates
                     dueDate={formatDate(dueDate)}
                     invoiceDate={formatDate(invoiceDate)}
                    poNumber={poNumber}
                    title={title}
                    invoiceNumber={invoiceNumber} 
                    balanceDue={balanceDue}
                    setBalanceDue={setBalanceDue}
                  />
                  </div>
                  </section>
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
                    amountPaid={amountPaid}
                    setAmountPaid={setAmountPaid} 
                  />
                  <Notes notes={notes}
                  terms={terms} />
                </div>
                <div className="flex justify-center mt-5 space-x-5">
      <button
        onClick={() => setShowInvoice(false)}
        className="bg-black text-white font-bold py-2 px-8 rounded shadow 
        border-2 border-black hover:bg-transparent hover:text-black 
        transition-all duration-300"
      >
        Edit Informasi
      </button>
      <ReactToPrint
        trigger={() => (
          <button
            className="bg-black text-white font-bold py-2 px-8 rounded shadow 
            border-2 border-black hover:bg-transparent hover:text-black 
            transition-all duration-300"
          >
            Print / Download
          </button>
        )}
        content={() => componentRef.current}
      />
    </div>
              </>
            ) : (
              <>
                {/* Form to input the logo file */}
                <div className="flex flex-col md:flex-row items-center justify-between">
  {/* Logo section */}
  <div className="flex flex-col items-center md:mb-0">
    {/* Logo Upload Box */}
    <div className="flex items-center justify-center w-40 h-40 mr-14 mb-10 border-2 border-dashed border-gray-300 rounded-lg relative">
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
            className="absolute top-2 left-2 text-red-500 font-bold text-xl"
            onClick={() => {
              setLogoUrl("");
              document.getElementById("logoFile").value = null;
            }}
          />
        </>
      ) : (
        <label
          htmlFor="logoFile"
          className="cursor-pointer text-center text-blue-500 hover:text-blue-700 transition-colors absolute inset-0 flex flex-col items-center justify-center"
        >
          Tambah logo
          <span className="text-sm text-gray-500">+</span>
        </label>
      )}
    </div>

    {/* Form Fields Below Logo */}
    <article className="space-y-1">
      <div className="flex flex-col">
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Masukkan nama lengkap"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Masukkan alamat"
          autoComplete="off"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-1"
        />
      </div>
    </article>
  </div>

  {/* Title section */}
  <article className="md:grid grid-rows-8">
  <div className="flex justify-end">
    <input
      type="text"
      value={title}
      id="titlename"
      onChange={handleTitleChange}
      placeholder="Masukkan judul"
      className="text-4xl dark:text-gray-200 font-bold p-2 w-full md:w-60 dark:bg-gray-800 border-transparent bg-transparent hover:border-black text-right"
    />
  </div>

  <div className="flex flex-col md:flex-row items-center justify-end">
    <input
      type="text"
      name="invoiceNumber"
      id="invoiceNumber"
      placeholder="Nomor invoice"
      autoComplete="off"
      value={"#" + invoiceNumber}
      onChange={(e) => setInvoiceNumber(e.target.value.replace(/^#/, ""))}
      className="dark:text-gray-200 dark:bg-gray-800 px-2 py-1 w-full md:w-auto text-right"
    />
  </div>

  {/* Tanggal Invoice */}
  <div className="flex flex-col md:flex-row items-center justify-between">
    <label htmlFor="invoiceDate" className="md:w-1/3 text-left md:text-right">Tanggal invoice:</label>
    <DatePicker
      renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
        <div className="flex justify-center">
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{"<"}</button>
          <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)}>
            {years.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
            {months.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>{">"}</button>
        </div>
      )}
      selected={invoiceDate}
      onChange={(date) => setInvoiceDate(date)}
      id="invoiceDate"
      value={formatDate(invoiceDate)}
      autoComplete="off"
      className="w-full md:w-auto text-right"
    />
  </div>

  {/* Tanggal Jatuh Tempo */}
  <div className="flex flex-col md:flex-row items-center justify-between">
    <label htmlFor="dueDate" className="md:w-1/3 text-left md:text-right">Tanggal jatuh tempo:</label>
    <DatePicker
      renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
        <div className="flex justify-center">
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{"<"}</button>
          <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)}>
            {years.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
            {months.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>{">"}</button>
        </div>
      )}
      selected={dueDate}
      onChange={(date) => setDueDate(date)}
      id="dueDate"
      value={formatDate(dueDate)}
      autoComplete="off"
      className="w-full md:w-auto text-right"
    />
  </div>

  {/* Nomor PO */}
  <div className="flex flex-col md:flex-row items-center justify-between">
    <label htmlFor="poNumber" className="md:w-1/3 text-left md:text-right">Nomor PO:</label>
    <input
      type="text"
      id="poNumber"
      autoComplete="off"
      placeholder="Masukkan nomor PO"
      value={poNumber}
      onChange={(e) => setPoNumber(e.target.value)}
      className="dark:text-gray-200 dark:bg-gray-800 px-2 py-1 w-full md:w-auto text-right"
    />
  </div>
</article>
</div>
                <div className="flex flex-col justify-center">
                <article className="md:grid grid-cols-2 mb-5 mt-5">
  <div className="flex flex-col">
    <label htmlFor="clientName">Pembayaran kepada :</label>
    <input
      type="text"
      name="clientName"
      id="clientName"
      placeholder="Masukkan nama klien"
      autoComplete="off"
      value={clientName}
      onChange={(e) => setClientName(e.target.value)}
      className="border border-gray-300 rounded-lg px-2 py-1 mx-2" // Tambahkan mx-2 untuk margin kiri dan kanan
    />
  </div>
  <div className="flex flex-col">
    <label htmlFor="clientAddress">Dikirim ke :</label>
    <input
      type="text"
      name="clientAddress"
      id="clientAddress"
      placeholder="Masukkan alamat klien"
      autoComplete="off"
      value={clientAddress}
      onChange={(e) => setClientAddress(e.target.value)}
      className="border border-gray-300 rounded-lg px-2 py-1" // Tambahkan mx-2 untuk margin kiri dan kanan
    />
  </div>
</article>

                  <article className="">
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
                      showDiscountInput={showDiscountInput}
                      setShowDiscountInput={setShowDiscountInput}
                      showTaxInput={showTaxInput}
                      setShowTaxInput={setShowTaxInput}
                      showShippingInput={showShippingInput}
                      setShowShippingInput={setShowShippingInput}
                      notes={notes}
                      setNotes={setNotes}
                      terms={terms}
                      setTerms={setTerms}
                      amountPaid={amountPaid}
                      setAmountPaid={setAmountPaid}
                      balanceDue={balanceDue}
                      setBalanceDue={setBalanceDue}
                      discountInRupiah={discountInRupiah}
                      setDiscountInRupiah={setDiscountInRupiah}
                      taxInRupiah={taxInRupiah}
                      setTaxInRupiah={setTaxInRupiah}
                      shippingInRupiah={shippingInRupiah}
                      setShippingInRupiah={setShippingInRupiah}
                      formattedAmountPaid={formattedAmountPaid}
                      setFormattedAmountPaid={setFormattedAmountPaid}
                    />
                  </article>
                  <button
                    onClick={() => { setShowInvoice(true); handleSave(); }}
                    className="bg-black text-white font-bold py-2 px-8 rounded shadow 
                    border-2 border-black hover:bg-transparent hover:text-black
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
