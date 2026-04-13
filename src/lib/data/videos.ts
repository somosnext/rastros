export interface Video {
  titulo: string;
  subtitulo: string;
  youtubeId: string;
  url: string;
  categoria: "encontros" | "ensinamentos" | "terceiros";
}

export const videos: Video[] = [
  { titulo: "Brasil", subtitulo: "Encontro Completo · 1974", youtubeId: "tMYEFXgscmQ", url: "https://www.youtube.com/watch?v=tMYEFXgscmQ", categoria: "encontros" },
  { titulo: "Caracas, Venezuela", subtitulo: "Resumo Longo · 1975", youtubeId: "C7aReWhr3gU", url: "https://www.youtube.com/watch?v=C7aReWhr3gU", categoria: "encontros" },
  { titulo: "Barcelona, Espanha", subtitulo: "Encontro Completo · 1972", youtubeId: "imi-7DvONc4", url: "https://www.youtube.com/watch?v=imi-7DvONc4", categoria: "encontros" },
  { titulo: "Valle Grande, Peru", subtitulo: "Encontro Completo · 1974", youtubeId: "GtxhwgcaySo", url: "https://www.youtube.com/watch?v=GtxhwgcaySo", categoria: "encontros" },
  { titulo: "Valência, Espanha", subtitulo: "Perguntas e Respostas", youtubeId: "COFJ_FpPCTM", url: "https://www.youtube.com/watch?v=COFJ_FpPCTM", categoria: "encontros" },
  { titulo: "Buenos Aires, Argentina", subtitulo: "Teatro Coliseo", youtubeId: "2_NdvFB4jqk", url: "https://www.youtube.com/watch?v=2_NdvFB4jqk", categoria: "encontros" },
  { titulo: "Encontro com Jovens", subtitulo: "Parte 1", youtubeId: "Let9DRG9DNk", url: "https://www.youtube.com/watch?v=Let9DRG9DNk", categoria: "encontros" },
  { titulo: "Encontro com Jovens", subtitulo: "Parte 3", youtubeId: "QUOiHwIokVQ", url: "https://www.youtube.com/watch?v=QUOiHwIokVQ", categoria: "encontros" },
  { titulo: "Trabalhar por Amor", subtitulo: "Ensinamento", youtubeId: "Btris3T6ZlI", url: "https://www.youtube.com/watch?v=Btris3T6ZlI", categoria: "ensinamentos" },
  { titulo: "Sentido de Autenticidade", subtitulo: "Fazer sem vontade", youtubeId: "s0CFg1B0LYA", url: "https://www.youtube.com/watch?v=s0CFg1B0LYA", categoria: "ensinamentos" },
  { titulo: "Padre, sou judeu", subtitulo: "Resposta de São Josemaria", youtubeId: "6dto-dePqN4", url: "https://www.youtube.com/watch?v=6dto-dePqN4", categoria: "ensinamentos" },
  { titulo: "Superação Pessoal Diária", subtitulo: "Ensinamento", youtubeId: "UF2yioZsCHc", url: "https://www.youtube.com/watch?v=UF2yioZsCHc", categoria: "ensinamentos" },
  { titulo: "Padre, sou rebelde", subtitulo: "Ensinamento", youtubeId: "Zem8re9QSlI", url: "https://www.youtube.com/watch?v=Zem8re9QSlI", categoria: "ensinamentos" },
  { titulo: "Deus Nunca Nos Abandona", subtitulo: "Ensinamento", youtubeId: "PaQkoRr--_U", url: "https://www.youtube.com/watch?v=PaQkoRr--_U", categoria: "ensinamentos" },
  { titulo: "O Segredo do Bom Humor", subtitulo: "Ensinamento", youtubeId: "-yy0OsWJ65k", url: "https://www.youtube.com/watch?v=-yy0OsWJ65k", categoria: "ensinamentos" },
  { titulo: "O Menino Jesus de São Josemaria", subtitulo: "Ensinamento", youtubeId: "r_24ZpF1h6s", url: "https://www.youtube.com/watch?v=r_24ZpF1h6s", categoria: "ensinamentos" },
  { titulo: "Oração e Vontade", subtitulo: "Ensinamento", youtubeId: "t3xusIZM6pM", url: "https://www.youtube.com/watch?v=t3xusIZM6pM", categoria: "ensinamentos" },
  { titulo: "Sobre o Futuro do Opus Dei", subtitulo: "Ensinamento", youtubeId: "OBdZvcMjzzo", url: "https://www.youtube.com/watch?v=OBdZvcMjzzo", categoria: "ensinamentos" },
  { titulo: "O que Ele Quer Deixar no Coração", subtitulo: "Ensinamento", youtubeId: "kUPlrMI-ajM", url: "https://www.youtube.com/watch?v=kUPlrMI-ajM", categoria: "ensinamentos" },
  { titulo: "Profecia sobre o Povo Brasileiro", subtitulo: "Ensinamento", youtubeId: "X8puq5FomOs", url: "https://www.youtube.com/watch?v=X8puq5FomOs", categoria: "ensinamentos" },
  { titulo: "O Segredo do Sucesso no Trabalho", subtitulo: "Análise · Corte", youtubeId: "NvwHTIQdUyo", url: "https://www.youtube.com/watch?v=NvwHTIQdUyo", categoria: "terceiros" },
  { titulo: "Conselho para Marido e Mulher", subtitulo: "Corte de Podcast", youtubeId: "TO49mnQap8Y", url: "https://www.youtube.com/watch?v=TO49mnQap8Y", categoria: "terceiros" },
  { titulo: "O Quarto de São Josemaria", subtitulo: "Tour · Exibição", youtubeId: "1QkuGtGXfeo", url: "https://www.youtube.com/watch?v=1QkuGtGXfeo", categoria: "terceiros" },
  { titulo: "Pe. Faus e São Josemaria Escrivá", subtitulo: "Depoimento", youtubeId: "15A24Q855EE", url: "https://www.youtube.com/watch?v=15A24Q855EE", categoria: "terceiros" },
  { titulo: "O que é o Opus Dei", subtitulo: "Explicação Teológica", youtubeId: "vlR77uxJGpo", url: "https://www.youtube.com/watch?v=vlR77uxJGpo", categoria: "terceiros" },
  { titulo: "Como Conheceu São Josemaria", subtitulo: "Depoimento", youtubeId: "ihNLl76y1-M", url: "https://www.youtube.com/watch?v=ihNLl76y1-M", categoria: "terceiros" },
  { titulo: "A Vivacidade de São Josemaria", subtitulo: "Depoimento", youtubeId: "xKkWLkNsiis", url: "https://www.youtube.com/watch?v=xKkWLkNsiis", categoria: "terceiros" },
  { titulo: "Esboços do Perfil de um Santo", subtitulo: "São Josemaria no Brasil", youtubeId: "jnjAJL4SfX4", url: "https://www.youtube.com/watch?v=jnjAJL4SfX4", categoria: "terceiros" },
  { titulo: "Documentário Um Santo Entre Nós", subtitulo: "Trailer · Trechos", youtubeId: "ylb-VlfY43A", url: "https://www.youtube.com/watch?v=ylb-VlfY43A", categoria: "terceiros" },
];
