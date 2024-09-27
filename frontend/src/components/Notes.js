export default function Notes({notes,terms}) {
    return (
        <>
        <section className="mt-5 mb-10 ml-10">
          <label className="text-sm">Catatan :</label>
        <p className="lg:w-1/2 text-justify text-base mb-10 font-bold">{notes}</p>
          <label className="text-sm">Kebijakan :</label>
        <p className="lg:w-1/2 text-justify text-base font-bold">{terms}</p>
      </section>
        </>
    )
}