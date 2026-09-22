export default async function handler(req, res) {
  const apiKey = process.env.ASAAS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "ASAAS_API_KEY não configurada na Vercel"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Método não permitido"
    });
  }

  const {
    customer,
    value,
    dueDate,
    description,
    externalReference
  } = req.body || {};

  if (!customer) {
    return res.status(400).json({
      ok: false,
      error: "ID do cliente Asaas é obrigatório"
    });
  }

  if (!value || !dueDate) {
    return res.status(400).json({
      ok: false,
      error: "Valor e vencimento são obrigatórios"
    });
  }

  try {
    const response = await fetch(
      "https://api.asaas.com/v3/payments",
      {
        method: "POST",
        headers: {
          "access_token": apiKey,
          "Content-Type": "application/json",
          "User-Agent": "WM-Crediario/1.0"
        },
        body: JSON.stringify({
          customer,
          billingType: "BOLETO",
          value,
          dueDate,
          description,
          externalReference
        })
      }
    );

    const data = await response.json();

    return res.status(response.status).json({
      ok: response.ok,
      cobranca: data
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Erro ao comunicar com o Asaas",
      detalhe: error.message
    });
  }
}
