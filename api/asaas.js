export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const apiKey = process.env.ASAAS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "ASAAS_API_KEY não configurada na Vercel"
    });
  }

  try {
    const response = await fetch(
      "https://api.asaas.com/v3/myAccount/status/",
      {
        method: "GET",
        headers: {
          "access_token": apiKey,
          "Content-Type": "application/json",
          "User-Agent": "WM-Crediario/1.0"
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json({
      ok: response.ok,
      asaas: data
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Erro ao conectar com o Asaas"
    });
  }
}
