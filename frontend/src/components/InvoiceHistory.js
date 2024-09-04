import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination logic
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

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

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // If no date provided, return 'N/A'
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const parsedAmount = parseFloat(amount);
    return !isNaN(parsedAmount)
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(parsedAmount)
      : 'N/A'; // Return 'N/A' if the amount is not a valid number
  };

  return (
    <div className="m-5 p-5 rounded shadow light:bg-white dark:bg-black max-w-full overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Invoice History</h2>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by Invoice Number or Client Name"
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
              <th className="px-4 py-2 border">Invoice Number</th>
              <th className="px-4 py-2 border">Client Name</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Due Date</th>
              <th className="px-4 py-2 border">Total Amount</th>
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
                  <td className="px-4 py-2 border flex">
                      <MdDelete className="text-red-500 mr-2 text-2xl"
                      onClick={() => handleDelete(invoice.id)}/>
                      <MdEdit className="text-blue-500 text-2xl"
                      onClick={() => handleUpdate(invoice)}/>
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
    </div>
  );
}

export default InvoiceHistory;
