export default function MainDetails({ image, name, address,  clientName, clientAddress }) {
  return (
    <>
      <section className="space-y-1 mb-5 ml-10">
      {image && (
        <img
          src={image}
          alt="Uploaded Logo"
          className="max-h-24 md:max-h-32 lg:max-h-40 w-auto mr-auto mb-16"
          // style={{ maxWidth: "40%" }} // Ensure the logo doesn't take up more than 40% of the width
        />
      )}
        <div className="flex flex-col">
          <h2 className="font-bold uppercase text-base">{name}</h2>
          <p className="text-base">{address}</p>
        </div>
      </section>
      <section className="md:grid grid-cols-2 gap-0 md:mt-1 ml-10" style={{ breakInside: "avoid" }}>
        <div className="flex flex-col w-full mr-10">
        <label className="text-base">Pembayaran kepada :</label>
<h2 className="uppercase font-bold text-base mb-5">{clientName}</h2>
</div>
<div className="flex flex-col w-full">
<label className="text-sm">Dikirim ke :</label>
<h2 className="uppercase font-bold text-base">{clientAddress}</h2>
</div>
      </section>
     
    </>
  );
}
