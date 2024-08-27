import { v4 as uuidv4 } from "uuid";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

export default function TableForm({
  rows, setRows, discount, setDiscount, tax, setTax, shipping, setShipping
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
  const calculateGrandTotal = calculateSubtotal - calculateDiscount + calculateTax + shippingAmount;

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
          className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
        >
          <FaPlus />
        </button>
      </form>

      <div className="mt-4">
        <div className="text-right">
          <h2 className="text-lg sm:text-xl">Subtotal: Rp.{calculateSubtotal.toLocaleString()}</h2>
          <h2 className="text-lg sm:text-xl">Diskon: -Rp.{calculateDiscount.toLocaleString()}</h2>
          <h2 className="text-lg sm:text-xl">Pajak: +Rp.{calculateTax.toLocaleString()}</h2>
          <h2 className="text-lg sm:text-xl">Pengiriman: +Rp.{shippingAmount.toLocaleString()}</h2>
          <h2 className="text-xl sm:text-2xl font-bold">Total Keseluruhan: Rp.{calculateGrandTotal.toLocaleString()}</h2>
        </div>
      </div>
    </>
  );
}
