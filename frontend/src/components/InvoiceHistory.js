import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'; // Icons for download buttons
import * as XLSX from 'xlsx';

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/invoiceHistory');
        setInvoices(response.data);
        setFilteredInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoice history:', error);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = invoices.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredInvoices(filtered);
    };

    applyFilters();
  }, [invoices, searchTerm]);

// Function to export table as PDF
const exportPDF = () => {
  const doc = new jsPDF();
  doc.text('Invoice History', 20, 10);
  
  const tableColumn = ['Nomor Invoice', 'Nama Klien', 'Tanggal', 'Tanggal Jatuh Tempo', 'Total', 'Status'];
  const tableRows = currentInvoices.map(invoice => [
    invoice.invoiceNumber,
    invoice.clientName,
    formatDate(invoice.invoiceDate),
    formatDate(invoice.dueDate),
    formatCurrency(invoice.totalAmount),
    invoice.status
  ]);
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20
  });
  
  doc.save('TABEL INVOICE HISTORY.pdf');
};

// Function to export table as Excel
const exportExcel = () => {
  const workSheet = XLSX.utils.json_to_sheet(currentInvoices.map(invoice => ({
    'Nomor Invoice': invoice.invoiceNumber,
    'Nama Klien': invoice.clientName,
    'Tanggal': formatDate(invoice.invoiceDate),
    'Tanggal Jatuh Tempo': formatDate(invoice.dueDate),
    'Total': formatCurrency(invoice.totalAmount),
    'Status': invoice.status,
  })));
  
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, 'Invoices');
  XLSX.writeFile(workBook, 'TABEL INVOICE HISTORY.xlsx');
};


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination logic
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const handleStatusChange = async (invoice) => {
    const { value: status } = await Swal.fire({
      title: 'Ubah Status Pembayaran',
      input: 'select',
      inputOptions: {
        Paid: 'Paid',
        Unpaid: 'Unpaid'
      },
      inputPlaceholder: 'Pilih status',
      showCancelButton: true,
      inputValidator: (value) => {
        return !value ? 'Anda harus memilih status!' : null;
      }
    });
  
    if (status) {
      try {
        // Memperbarui status di server
        await axios.put(`http://localhost:5000/updateStatus/${invoice.id}`, { status });
        // Memperbarui status di frontend
        setInvoices(invoices.map(inv => inv.id === invoice.id ? { ...inv, status } : inv));
        Swal.fire('Berhasil!', `Invoice telah ditandai sebagai ${status}.`, 'success');
      } catch (error) {
        console.error('Error updating status:', error);
        Swal.fire('Kesalahan', 'Gagal memperbarui status invoice.', 'error');
      }
    }
  };
  
  
  const handleDelete = async (id) => {
    console.log('Deleting invoice with ID:', id);  // Debug log
    try {
      await axios.delete(`http://localhost:5000/deleteInvoice/${id}`);
      setInvoices(invoices.filter(invoice => invoice.id !== id));
      setFilteredInvoices(filteredInvoices.filter(invoice => invoice.id !== id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleUpdate = (invoice) => {
    console.log('Updating invoice with ID:', invoice.id);  // Debug log
    window.location.href = `/?id=${invoice.id}`;
  };

  // Helper function to format dates (Indonesian format with month first)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // If no date provided, return 'N/A'
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options).replace(/(\d+)\s(\w+)\s(\d+)/, '$2 $1, $3');
  };

  // Helper function to format currency in Indonesian Rupiah
  const formatCurrency = (amount) => {
    const parsedAmount = parseFloat(amount);
    return !isNaN(parsedAmount)
      ? new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(parsedAmount)
      : 'N/A'; // Return 'N/A' if the amount is not a valid number
  };

  // Calculate the total amount of filtered invoices
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + (parseFloat(invoice.totalAmount) || 0), 0);

  return (
    <div className="m-5 p-5 rounded shadow light:bg-white dark:bg-black max-w-full overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Invoice History</h2>
      <div className="flex flex-wrap justify-between mb-4">
        <p>Kami secara otomatis menyimpan invoice yang Anda buat baru-baru ini di perangkat Anda.<br></br>Ini berguna ketika Anda perlu membuat perubahan cepat pada invoice.</p>
      </div>

      {/* Display Total Amount */}
      <div className="mb-4">
        <h3 className="text-lg font-bold">Total Invoice: {formatCurrency(totalAmount)}</h3>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan Nomor Invoice atau Nama Klien"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full pl-10"
        />
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nomor invoice</th>
              <th className="px-4 py-2 border">Nama klien</th>
              <th className="px-4 py-2 border">Tanggal</th>
              <th className="px-4 py-2 border">Tanggal jatuh tempo</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Status</th> 
              <th className="px-4 py-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length > 0 ? (
              currentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-2 border">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-2 border">{invoice.clientName}</td>
                  <td className="px-4 py-2 border">{formatDate(invoice.invoiceDate)}</td>
                  <td className="px-4 py-2 border">{formatDate(invoice.dueDate)}</td>
                  <td className="px-4 py-2 border">{formatCurrency(invoice.totalAmount)}</td>
                  <td className="px-4 py-2 border">
  <button 
    className={`px-3 py-1 rounded ${invoice.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'} text-white`}
    onClick={() => handleStatusChange(invoice)}
  >
    {invoice.status}
  </button>
</td>
                  <td className="px-4 py-2 border flex">
                    <MdDelete className="text-red-500 mr-2 text-2xl" 
                      onClick={() => handleDelete(invoice.id)} style={{ cursor: 'pointer' }} />
                    <MdEdit className="text-blue-500 text-2xl"
                      onClick={() => handleUpdate(invoice)} style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 border text-center">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredInvoices.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 m-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="flex justify-end mb-4">
  <button onClick={exportPDF} className="bg-red-500 text-white p-2 rounded flex items-center mr-2">
    <FaFilePdf className="mr-1" /> Download PDF
  </button>
  <button onClick={exportExcel} className="bg-green-500 text-white p-2 rounded flex items-center">
    <FaFileExcel className="mr-1" /> Download Excel
  </button>
</div>
    </div>
  );
}

export default InvoiceHistory;
