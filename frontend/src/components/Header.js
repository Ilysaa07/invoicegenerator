export default function Header({ image, title }) {
  return (
    <>
      <header className="flex items-center ml-10 mb-20 mt-10 dark:bg-gray-900 dark:text-gray-200">
        {image && (
          <img
            src={image}
            alt="Uploaded Logo"
            id="logo"
            className="w-32 h-32 mr-auto" // Ensures the logo is pushed to the right
          />
        )}
        <h2 className="font-bold uppercase tracking-wide text-4xl mr-10">
          {title || "INVOICE"}
        </h2>
      </header>
    </>
  );
}
