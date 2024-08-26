export default function ClientDetails({ clientName, clientAddress }) {
    return (
        <>
      <section className="flex flex-col items-start justify-start mb-15 ml-10">
<h2 className="text-2xl uppercase font-bold">{clientName}</h2>
<p>{clientAddress}</p>
      </section>
        </>
    )
}