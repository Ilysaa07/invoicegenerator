export default function Dates({ invoiceNumber, invoiceDate, dueDate }) {
  return (
    <>
      <article className="mt-5 mr-10 flex items-end justify-end">
        <ul className="space-y-1">
          <li className="p-1 dark:text-gray-200">
            <span className="font-bold">Invoice number: </span>{invoiceNumber}
          </li>
          <li className="p-1 light:bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
            <span className="font-bold">Invoice date: </span>{invoiceDate}
          </li>
          <li className="p-1 dark:text-gray-200">
            <span className="font-bold">Due date: </span>{dueDate}
          </li>
        </ul>
      </article>
    </>
  );
}
