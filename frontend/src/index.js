import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


// import { useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { MdDelete } from "react-icons/md";
// import { CiEdit } from "react-icons/ci";

// export default function TableForm({
//   description,
//   setDescription,
//   quantity,
//   setQuantity,
//   price,
//   setPrice,
//   amount,
//   setAmount,
//   list,
//   setList,
//   total,
//   onItemAdded,
// }) {
//   const [isEditing, setIsEditing] = useState(false);

//   // Calculate total amount of items in the table
//   const calculateTotal = () => {
//     return list.reduce((acc, item) => acc + item.amount, 0);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!description || !quantity || !price) {
//       alert("Mohon isi semua input!");
//     } else {
//       const newItem = {
//         id: uuidv4(),
//         description,
//         quantity: parseFloat(quantity),
//         price: parseFloat(price),
//         amount: parseFloat(quantity) * parseFloat(price),
//       };

//       // Kirim data ke komponen induk
//       onItemAdded(newItem);

//       // Reset form
//       setDescription("");
//       setQuantity("");
//       setPrice("");
//       setAmount("");
//       setIsEditing(false);
//     }
//   };

//   useEffect(() => {
//     setAmount(quantity * price);
//   }, [quantity, price, setAmount]);

//   // Edit function
//   const editRow = (id) => {
//     const editingRow = list.find((row) => row.id === id);
//     setList(list.filter((row) => row.id !== id));
//     setIsEditing(true);
//     setDescription(editingRow.description);
//     setQuantity(editingRow.quantity);
//     setPrice(editingRow.price);
//   };

//   // Delete function
//   const deleteRow = (id) => setList(list.filter((row) => row.id !== id));

//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <div className="md:grid grid-cols-4 gap-10">
//           <div className="flex flex-col">
//             <label htmlFor="description">Item</label>
//             <input
//               type="text"
//               name="description"
//               id="description"
//               placeholder="Item description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label htmlFor="quantity">Kuantitas</label>
//             <input
//               type="text"
//               name="quantity"
//               id="quantity"
//               placeholder="Quantity"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label htmlFor="price">Harga</label>
//             <input
//               type="text"
//               name="price"
//               id="price"
//               placeholder="Item price"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label htmlFor="amount">Jumlah</label>
//             <p>{amount}</p>
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="mb-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
//         >
//           {isEditing ? "Editing Row Item" : "Add Table Item"}
//         </button>
//       </form>

//       {/* Table items */}
//       <table width="100%" className="mb-10">
//         <thead>
//           <tr className="bg-gray-100 p-1">
//             <td className="pr-60">Item</td>
//             <td className="">Kuantitas</td>
//             <td className="">Harga</td>
//             <td className="">Total</td>
//             <td className="">Actions</td>
//           </tr>
//         </thead>
//         <tbody>
//           {list.map(({ id, description, quantity, price, amount }) => (
//             <tr key={id}>
//               <td>{description}</td>
//               <td>{quantity}</td>
//               <td>{price}</td>
//               <td className="amount">{amount}</td>
//               <td>
//                 <button onClick={() => deleteRow(id)}>
//                   <MdDelete className="text-red-500 font-bold text-xl" />
//                 </button>
//                 <button onClick={() => editRow(id)}>
//                   <CiEdit className="text-green-500 font-bold text-xl" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div>
//         <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
//           Total. {calculateTotal().toLocaleString()}
//         </h2>
//       </div>
//     </>
//   );
// }
