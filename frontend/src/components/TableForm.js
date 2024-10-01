import { v4 as uuidv4 } from "uuid";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useEffect } from "react";

export default function TableForm({
  rows, setRows, discount, setDiscount, tax, setTax, shipping, setShipping,
  showDiscountInput, setShowDiscountInput, showTaxInput, setShowTaxInput, showShippingInput,
  setShowShippingInput, notes, setNotes, terms, setTerms, amountPaid, setAmountPaid,
  setBalanceDue
}) {
  // Calculate subtotal
  const calculateSubtotal = rows.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // Calculate discount amount
  const calculateDiscount = (calculateSubtotal * (parseFloat(discount) || 0)) / 100;

  // Calculate tax amount
  const calculateTax = (calculateSubtotal * (parseFloat(tax) || 0)) / 100;

  // Calculate shipping amount
  const shippingAmount = parseFloat(shipping) || 0;

  // Calculate grand total
  let calculateGrandTotal = calculateSubtotal - calculateDiscount + calculateTax + shippingAmount;

  // Update grand total based on amount paid
  if (amountPaid) {
    calculateGrandTotal -= parseFloat(amountPaid);
  }

  // Balance due
  const balanceDue = calculateGrandTotal;

  useEffect(() => {
    setBalanceDue(balanceDue); // Update balance due in App.js
  }, [balanceDue, setBalanceDue]); // Re-run when balanceDue changes

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [name]: value };

    if (name === "quantity" || name === "price") {
      const quantity = parseFloat(updatedRows[index].quantity) || 0;
      const price = parseFloat(updatedRows[index].price) || 0;
      updatedRows[index].amount = (quantity * price).toFixed(2);
    }

    setRows(updatedRows);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRows([...rows, { id: uuidv4(), description: "", quantity: "", price: "", amount: 0 }]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table id="table" className="w-full border-collapse border light:border-gray-200 dark:border-gray-600 mb-10">
            <thead>
              <tr className="light:bg-gray-100 dark:border-gray-300">
                <th className="border light:border-gray-300 dark:border-gray-600 p-2">Item</th>
                <th className="border light:border-gray-300 dark:border-gray-600 p-2">Kuantitas</th>
                <th className="border light:border-gray-300 dark:border-gray-600 p-2">Harga</th>
                <th className="border light:border-gray-300 dark:border-gray-600 p-2">Jumlah</th>
                <th className="border light:border-gray-300 dark:border-gray-600 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td className="border light:border-gray-300 dark:border-gray-600 p-2">
                    <input
                      type="text"
                      name="description"
                      value={row.description}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-1"
                      placeholder="Item description"
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
                      type="number"
                      name="price"
                      value={row.price}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-1"
                      placeholder="Price"
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
          className="bg-black text-white font-bold py-2 px-8 rounded shadow border-2 border-black hover:bg-transparent hover:text-black transition-all duration-300"
        >
          <FaPlus />
        </button>

        {/* Notes and Terms Section */}
       {/* Notes and Terms Section */}
<div className="mt-12 flex flex-col md:flex-row">
  {/* Left Column: Notes */}
  <div className="w-full md:w-1/2 md:pr-4 mb-4">
    <label htmlFor="notes" className="block font-medium">Catatan:</label>
    <textarea
      name="notes"
      id="notes"
      rows="3"
      placeholder="Catatan tambahan"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      className="w-full max-w-full p-2 border rounded-lg"
    ></textarea>
    <label htmlFor="terms" className="block font-medium mt-4">Ketentuan:</label>
    <textarea
      name="terms"
      id="terms"
      rows="3"
      placeholder="Syarat dan ketentuan - biaya keterlambatan, metode pembayaran, jadwal pengiriman"
      value={terms}
      onChange={(e) => setTerms(e.target.value)}
      className="w-full max-w-full p-2 border rounded-lg"
    ></textarea>
  </div>

  {/* Right Column: Discount, Tax, Shipping */}
  <div className="w-full md:w-1/2 md:pl-4">
    <div className="text-right">
      <h2 className="text-lg sm:text-xl">Subtotal: Rp.{calculateSubtotal.toLocaleString()}</h2>

      {/* Discount Input Section */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setShowDiscountInput(!showDiscountInput)}
          className="bg-transparent rounded-lg dark:text-white py-1 px-4"
        >
          {showDiscountInput ? "- Diskon (%) :" : "+ Diskon (%) :"}
        </button>
        {showDiscountInput && (
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Diskon (%)"
            className="p-1 border rounded-lg border-gray-300 w-24 bg-transparent"
          />
        )}
      </div>

      {/* Tax Input Section */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setShowTaxInput(!showTaxInput)}
          className="bg-transparent rounded-lg dark:text-white py-1 px-4"
        >
          {showTaxInput ? "- Pajak (%) :" : "+ Pajak (%) :"}
        </button>
        {showTaxInput && (
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            placeholder="Pajak (%)"
            className="p-1 border rounded-lg border-gray-300 w-24 bg-transparent"
          />
        )}
      </div>

      {/* Shipping Input Section */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setShowShippingInput(!showShippingInput)}
          className="bg-transparent rounded-lg dark:text-white py-1 px-4"
        >
          {showShippingInput ? "- Pengiriman :" : "+ Pengiriman :"}
        </button>
        {showShippingInput && (
          <input
            type="number"
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            placeholder="Pengiriman"
            className="p-1 border rounded-lg border-gray-300 w-24 bg-transparent"
          />
        )}
      </div>

      <div className="flex justify-end mt-4">
        <label className="mr-4">Jumlah yang dibayarkan: </label>
        <input
          type="number"
          value={amountPaid}
          onChange={(e) => setAmountPaid(Math.max(0, parseFloat(e.target.value)))}
          className="p-1 border rounded-lg border-gray-300 w-24 bg-transparent"
          placeholder="Amount Paid"
        />
      </div>

      {/* Grand Total */}
      <h1 className="text-lg sm:text-lg mt-4">Sisa pembayaran: Rp.{balanceDue.toLocaleString()}</h1>
      <h2 className="text-xl sm:text-2xl font-bold mt-4">Total Keseluruhan: Rp.{calculateGrandTotal.toLocaleString()}</h2>
    </div>
  </div>
</div>
      </form>
    </>
  );
}
