import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hi">
        <Image
          src="/hero.png"
          alt="São Josemaria Escrivá"
          width={900}
          height={600}
          priority
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
      </div>
      <div className="ht">
        <p className="eyebrow">Pontos de Encontro</p>
        <h1 className="htitle">
          São Josemaria<br />
          <em>Escrivá</em>
        </h1>
        <p className="hsub">Fundador do Opus Dei</p>
        <div className="hdiv"></div>
        <p className="hdesc">
          Uma coleção de encontros, catequeses e ensinamentos do Santo Josemaria
          Escrivá — sacerdote, fundador do Opus Dei e mestre da vida interior no
          meio do mundo.
        </p>
        <p className="hdates">1902 — 1975 &nbsp;&middot;&nbsp; Canonizado em 2002</p>
      </div>
    </section>
  );
}
