import React from 'react';

export default function Table({ rows, discount, tax, shipping, amountPaid }) {
    // Perhitungan subtotal
    const subtotal = rows.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    // Perhitungan diskon
    const discountAmount = (subtotal * (parseFloat(discount) || 0)) / 100;

    // Perhitungan pajak
    const taxAmount = (subtotal * (parseFloat(tax) || 0)) / 100;

    // Perhitungan pengiriman
    const shippingAmount = parseFloat(shipping) || 0;

    // Perhitungan total keseluruhan
    let grandTotal = subtotal - discountAmount + taxAmount + shippingAmount;

    // Kurangi dengan jumlah yang telah dibayar jika ada
    if (amountPaid) {
        grandTotal = grandTotal - parseFloat(amountPaid);
    }

    // Balance due (Sisa pembayaran)
    const balanceDue = grandTotal;

    return (
        <>
            <div className="overflow-x-auto">
                <table id="table" className="w-11/12 mb-10 mt-10 mx-auto border-collapse">
                    <thead>
                        <tr className="bg-black dark:th-dark p-1 ">
                            <th className="font-bold text-center p-2 text-white text-base">Item</th>
                            <th className="font-bold text-center p-2 text-white text-base">Kuantitas</th>
                            <th className="font-bold text-center p-2 text-white text-base">Harga</th>
                            <th className="font-bold text-center p-2 text-white text-base">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(({ id, description, quantity, price, amount }) => (
                            <tr key={id}>
                                <td className="p-2 border border-gray dark:border-gray-600 light:bg-white dark:bg-black text-sm">{description}</td>
                                <td className="p-2 border border-gray dark:border-gray-600 light:bg-white dark:bg-black text-sm">{quantity}</td>
                                <td className="p-2 border border-gray dark:border-gray-600 light:bg-white dark:bg-black text-right text-sm">Rp.{parseFloat(price).toLocaleString()}</td>
                                <td className="p-2 border border-gray dark:border-gray-600 light:bg-white dark:bg-black text-right text-sm">Rp.{parseFloat(amount).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col items-end mr-10 space-y-2 mt-10">
                <div className="w-max max-w-md">
                    <div className="flex justify-between mb-2">
                        <h2 className="light:text-gray-800 dark:text-gray-200 text-sm text-right w-40">Subtotal:</h2>
                        <h2 className="light:text-gray-800 dark:text-gray-200 font-bold text-base text-left">Rp.{subtotal.toLocaleString()}</h2>
                    </div>

                    {/* Render Diskon only if discount is greater than 0 */}
                    {discount > 0 && (
                        <div className="flex justify-between mb-2">
                            <h2 className="light:text-gray-800 dark:text-gray-200 text-sm text-right w-40">Diskon ({discount}%):</h2>
                            <h2 className="light:text-gray-800 dark:text-gray-200 font-bold text-base text-left">-Rp.{discountAmount.toLocaleString()}</h2>
                        </div>
                    )}

                    {/* Render Pajak only if tax is greater than 0 */}
                    {tax > 0 && (
                        <div className="flex justify-between mb-2">
                            <h2 className="light:text-gray-800 dark:text-gray-200 text-sm text-right w-40">Pajak ({tax}%):</h2>
                            <h2 className="light:text-gray-800 dark:text-gray-200 font-bold text-base text-left">+Rp.{taxAmount.toLocaleString()}</h2>
                        </div>
                    )}

                    {/* Render Pengiriman */}
                    {shippingAmount > 0 && (
                        <div className="flex justify-between mb-2">
                            <h2 className="light:text-gray-800 dark:text-gray-200 text-sm text-right w-40">Pengiriman:</h2>
                            <h2 className="light:text-gray-800 dark:text-gray-200 font-bold text-base text-left">+Rp.{shippingAmount.toLocaleString()}</h2>
                        </div>
                    )}

                    <div className="flex justify-between mb-2">
                        <h2 className="light:text-gray-800 dark:text-gray-200 text-sm text-right w-40">Jumlah yang dibayarkan:</h2>
                        <h2 className="light:text-gray-800 dark:text-gray-200 font-bold text-base text-left">-Rp.{parseFloat(amountPaid).toLocaleString()}</h2>
                    </div>

                    <div className="flex justify-between bg-gray-200 p-2 pr-5 rounded">
                        <h2 className="light:text-gray-800 dark:text-gray-200 text-base font-bold text-right mr-5 w-40">Total Keseluruhan:</h2>
                        <h2 className="light:text-gray-800 dark:text-gray-200 text-base font-bold text-left">Rp.{balanceDue.toLocaleString()}</h2>
                    </div>
                </div>
            </div>
        </>
    );
}
