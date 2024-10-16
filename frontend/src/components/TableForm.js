import { v4 as uuidv4 } from "uuid";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useEffect } from "react";


export default function TableForm({
  rows, setRows, discount, setDiscount, tax, setTax, shipping, setShipping,
  showDiscountInput, setShowDiscountInput, showTaxInput, setShowTaxInput, showShippingInput,
  setShowShippingInput, notes, setNotes, terms, setTerms, amountPaid, setAmountPaid,
  setBalanceDue, discountInRupiah, setDiscountInRupiah, taxInRupiah, setTaxInRupiah, 
  shippingInRupiah, setShippingInRupiah, formattedAmountPaid, setFormattedAmountPaid
}) {
  
  // Calculate subtotal
  const calculateSubtotal = rows.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // Calculate discount and tax amounts
  const calculateDiscount = (calculateSubtotal * (parseFloat(discount) || 0)) / 100;
  const calculateTax = (calculateSubtotal * (parseFloat(tax) || 0)) / 100;

  // Calculate shipping and grand total
  const shippingAmount = parseFloat(shipping) || 0;
  let calculateGrandTotal = calculateSubtotal - calculateDiscount + calculateTax + shippingAmount;

  // Deduct amount paid
  if (amountPaid) {
    calculateGrandTotal -= parseFloat(amountPaid);
  }

  // Balance due
  const balanceDue = calculateGrandTotal;

  useEffect(() => {
    setShippingInRupiah(formatRupiah(shipping));
    setFormattedAmountPaid(formatRupiah(amountPaid));
    setBalanceDue(balanceDue);
    setShowDiscountInput(true); // Always show discount input
    setShowTaxInput(true); // Always show tax input
    setShowShippingInput(true); // Always show shipping input
  }, [balanceDue, setBalanceDue, discount, tax, shipping, rows, setShowDiscountInput, setShowTaxInput, setShowShippingInput, amountPaid, setFormattedAmountPaid, setShippingInRupiah]);

  // Handle changes in the row data
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [name]: value };
  
    if (name === "quantity" || name === "price") {
      const quantity = parseFloat(updatedRows[index].quantity) || 0;
      
      // Hapus format Rp. saat menyimpan harga
      const price = parseFloat(value.replace(/[^0-9]/g, "")) || 0;
      
      updatedRows[index].price = price; // Simpan harga sebagai angka
      updatedRows[index].amount = (quantity * price).toFixed(2); // Hitung jumlah
    }
  
    setRows(updatedRows);
  };
  
  // Format harga untuk ditampilkan dengan Rp.
  const formatRupiah = (number) => {
    return "Rp." + Number(number).toLocaleString("id-ID");
  };
  

  // Add new row
  const handleSubmit = (e) => {
    e.preventDefault();
    setRows([...rows, { id: uuidv4(), description: "", quantity: "", price: "", amount: 0 }]);
  };

  // Delete row
  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleDiscountPercentageChange = (e) => {
    const newDiscountPercentage = e.target.value === "" ? "" : parseFloat(e.target.value) || 0;
    setDiscount(newDiscountPercentage);
  
    // Calculate discount in Rupiah based on the new percentage
    if (calculateSubtotal > 0) {
      const newDiscountInRupiah = newDiscountPercentage ? ((newDiscountPercentage / 100) * calculateSubtotal).toFixed(2) : 0;
      setDiscountInRupiah(formatRupiah(parseFloat(newDiscountInRupiah))); // Format as Rp.
    } else {
      setDiscountInRupiah(formatRupiah(0));
    }
  };
  
  const handleDiscountInRupiahChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, "");
    const newDiscountInRupiah = input === "" ? 0 : parseFloat(input);
    setDiscountInRupiah(formatRupiah(newDiscountInRupiah));
  
    // Calculate discount percentage based on the new Rupiah value
    if (calculateSubtotal > 0) {
      const newDiscountPercentage = newDiscountInRupiah === 0 ? 0 : ((newDiscountInRupiah / calculateSubtotal) * 100).toFixed(2);
      setDiscount(newDiscountPercentage);
    } else {
      setDiscount(0);
    }
  };
  

  const handleTaxPercentageChange = (e) => {
    const newTaxPercentage = e.target.value === "" ? "" : parseFloat(e.target.value) || 0;
    setTax(newTaxPercentage);
  
    // Calculate tax in Rupiah based on the new percentage
    if (calculateSubtotal > 0) {
      const newTaxInRupiah = newTaxPercentage ? ((newTaxPercentage / 100) * calculateSubtotal).toFixed(2) : 0;
      setTaxInRupiah(formatRupiah(parseFloat(newTaxInRupiah)));
    } else {
      setTaxInRupiah(formatRupiah(0));
    }
  };
  
  const handleTaxInRupiahChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, "");
    const newTaxInRupiah = input === "" ? 0 : parseFloat(input);
    setTaxInRupiah(formatRupiah(newTaxInRupiah));
  
    // Calculate tax percentage based on the new Rupiah value
    if (calculateSubtotal > 0) {
      const newTaxPercentage = newTaxInRupiah === 0 ? 0 : ((newTaxInRupiah / calculateSubtotal) * 100).toFixed(2);
      setTax(newTaxPercentage);
    } else {
      setTax(0);
    }
  };
  

  const handleAmountPaidChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Strip non-numeric characters
    const numericValue = inputValue === "" ? 0 : parseFloat(inputValue); // Convert input to number or 0
    setFormattedAmountPaid(formatRupiah(numericValue)); // Format for display
    setAmountPaid(numericValue); // Update amountPaid with numeric value
  };

  const handleShippingChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Strip non-numeric characters
    const numericValue = inputValue === "" ? 0 : parseFloat(inputValue); // Convert to number or 0
    setShippingInRupiah(formatRupiah(numericValue)); // Format for display
    setShipping(numericValue); // Update shipping with numeric value
  };
  
  return (
    <form onSubmit={handleSubmit} className="text-right"> {/* Align all text to the right */}
      <div className="overflow-x-auto">
        <table id="table" className="w-full border-collapse border light:border-gray-200 dark:border-gray-600 mb-10">
          <thead>
            <tr className="light:bg-gray-100 dark:border-gray-300">
              <th className="border light:border-gray-300 dark:border-gray-600 p-2 text-center">Item</th>
              <th className="border light:border-gray-300 dark:border-gray-600 p-2 text-center">Kuantitas</th>
              <th className="border light:border-gray-300 dark:border-gray-600 p-2 text-center">Harga</th>
              <th className="border light:border-gray-300 dark:border-gray-600 p-2 text-center">Jumlah</th>
              <th className="border light:border-gray-300 dark:border-gray-600 p-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="border light:border-gray-300 dark:border-gray-600 p-2">
                  <textarea
                    name="description"
                    value={row.description}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-1"
                    placeholder="Item description"
                    rows="2"
                  />
                </td>
                <td className="border light:border-gray-300 dark:border-gray-600 p-2">
                  <input
                    type="number"
                    name="quantity"
                    value={row.quantity}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-1"
                    placeholder="Quantity"
                  />
                </td>
                <td className="border light:border-gray-300 dark:border-gray-600 p-2">
  <input
    type="text"
    name="price"
    value={formatRupiah(row.price)}
    onChange={(e) => handleChange(index, e)} // Handle changes and format
    className="w-full p-1"
    placeholder="Harga"
  />
</td>
                <td className="border light:border-gray-300 dark:border-gray-600 p-2">
                  <input
                    type="text"
                    name="amount"
                    value={`Rp.${parseFloat(row.amount).toLocaleString()}`}
                    readOnly
                    className="w-full p-1"
                  />
                </td>
                <td className="border light:border-gray-300 dark:border-gray-600 p-2 text-center">
                  <button type="button" onClick={() => deleteRow(row.id)} className="text-red-500">
                    <MdDelete className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="submit"
        className="flex items-center mb-2 border rounded-md bg-black text-white p-2"
      >
        <FaPlus className="mr-2" /> Tambah Item
      </button>
      <div className="flex justify-end mb-2">
  <h2 className="light:text-gray-800 dark:text-gray-200 text-base text-right w-40 mr-5">Subtotal:</h2>
  <h2 className="light:text-gray-800 dark:text-gray-200 font-bold text-base text-left">
    Rp.{calculateSubtotal.toLocaleString()}
  </h2>
</div>

<div className="flex justify-end items-center mb-2"> {/* Align discount and tax fields */}
  {showDiscountInput && (
    <>
      <div className="mr-4">
        <label className="block text-sm font-medium">Diskon (%)</label>
        <input
          type="number"
          value={discount}
          onChange={handleDiscountPercentageChange}
          className="p-2 border rounded w-20" // Reduced width
          placeholder="Diskon (%)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Diskon (Rp)</label>
        <input
          type="text"
          value={discountInRupiah}
          onChange={handleDiscountInRupiahChange}
          className="p-2 border rounded w-36" // Adjusted width
        />
      </div>
    </>
  )}
</div>

<div className="flex justify-end items-center mb-2">
  {showTaxInput && (
    <>
      <div className="mr-4">
        <label className="block text-sm font-medium">Pajak (%)</label>
        <input
          type="number"
          value={tax}
          onChange={handleTaxPercentageChange}
          className="p-2 border rounded w-20" // Reduced width
          placeholder="Pajak (%)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Pajak (Rp)</label>
        <input
          type="text"
          value={taxInRupiah}
          onChange={handleTaxInRupiahChange}
          className="p-2 border rounded w-36" // Adjusted width
        />
      </div>
    </>
  )}
</div>

<div className="flex justify-end items-center mb-2">
  {showShippingInput && (
    <div>
      <label className="block text-sm font-medium">Pengiriman</label>
      <input
        type="text"
        value={shippingInRupiah}
        onChange={handleShippingChange}
        className="p-2 border rounded w-36" // Adjusted width
      />
    </div>
  )}
</div>

<div className="mb-4">
  <label className="block text-sm font-medium">Jumlah yang telah dibayar</label>
  <input
    type="text"
    value={formattedAmountPaid}
    onChange={handleAmountPaidChange}
    className="p-2 border rounded w-36" // Adjusted width
  />
</div>

      <div className="flex justify-end p-2 pr-5 rounded">
                        <h2 className="light:text-gray-800 dark:text-gray-200 text-base font-bold text-right mr-5 w-40">Total Keseluruhan:</h2>
                        <h2 className="light:text-gray-800 dark:text-gray-200 text-base font-bold text-left">Rp.{balanceDue.toLocaleString()}</h2>
                    </div>
      <div className="">
        <label className="block text-left">Catatan</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Catatan..."
          className="w-full p-1 border border-gray-300 rounded"
          rows="3"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 text-left">Ketentuan</label>
        <textarea
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          placeholder="Ketentuan..."
          className="w-full p-1 border border-gray-300 rounded"
          rows="3"
        />
      </div>
    </form>
  );
}
