import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const nomeCandidate = formData.get("nome") as string;
    const emailCandidato = formData.get("email") as string;
    const mensagem = formData.get("mensagem") as string;
    const emailEmpregador = formData.get("emailEmpregador") as string;
    const tituloVaga = formData.get("tituloVaga") as string;
    const empresaVaga = formData.get("empresaVaga") as string;
    const curriculo = formData.get("curriculo") as File | null;

    if (!nomeCandidate || !emailCandidato || !emailEmpregador || !tituloVaga) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos." }, { status: 400 });
    }

    const attachments: { filename: string; content: Buffer }[] = [];
    if (curriculo && curriculo.size > 0) {
      const bytes = await curriculo.arrayBuffer();
      attachments.push({
        filename: curriculo.name,
        content: Buffer.from(bytes),
      });
    }

    const assunto = `Candidatura: ${tituloVaga}${empresaVaga ? ` — ${empresaVaga}` : ""}`;

    const { error } = await resend.emails.send({
      from: `Deixe Rastros <${process.env.RESEND_FROM_EMAIL || "vagas@deixerastros.com"}>`,
      to: emailEmpregador,
      replyTo: emailCandidato,
      subject: assunto,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #0a0a0a; border-bottom: 1px solid #ddd; padding-bottom: 12px;">
            Nova candidatura para: ${tituloVaga}
          </h2>
          ${empresaVaga ? `<p style="color: #666; font-size: 14px;">${empresaVaga}</p>` : ""}

          <table style="margin: 24px 0; font-size: 14px;">
            <tr><td style="color: #888; padding: 4px 16px 4px 0;">Nome:</td><td><strong>${nomeCandidate}</strong></td></tr>
            <tr><td style="color: #888; padding: 4px 16px 4px 0;">E-mail:</td><td><a href="mailto:${emailCandidato}">${emailCandidato}</a></td></tr>
          </table>

          ${mensagem ? `
            <div style="background: #f5f5f5; padding: 16px 20px; border-left: 3px solid #0a0a0a; margin: 24px 0;">
              <p style="font-size: 13px; color: #888; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Mensagem do candidato</p>
              <p style="font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${mensagem}</p>
            </div>
          ` : ""}

          ${attachments.length > 0 ? `<p style="font-size: 13px; color: #888;">Currículo em anexo.</p>` : ""}

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
          <p style="font-size: 11px; color: #aaa;">
            Enviado via Pontos de Encontro — São Josemaria Escrivá<br/>
            Para responder, use o botão "Responder" do seu email.
          </p>
        </div>
      `,
      attachments,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Erro ao enviar email. Tente novamente." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Candidatura error:", err);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
