export default async function handler(req, res) {
  const apiKey = process.env.ASAAS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "ASAAS_API_KEY não configurada na Vercel"
    });
  }

  const headers = {
    "access_token": apiKey,
    "Content-Type": "application/json",
    "User-Agent": "WM-Crediario/1.0"
  };

  try {
    // TESTE DA CONTA
    if (req.method === "GET") {
      const response = await fetch(
        "https://api.asaas.com/v3/myAccount/status/",
        {
          method: "GET",
          headers
        }
      );

      const data = await response.json();

      return res.status(response.status).json({
        ok: response.ok,
        asaas: data
      });
    }

    // CADASTRAR CLIENTE
    if (req.method === "POST") {
      const {
        name,
        cpfCnpj,
        email,
        mobilePhone,
        externalReference
      } = req.body || {};

      if (!name) {
        return res.status(400).json({
          ok: false,
          error: "Nome do cliente é obrigatório"
        });
      }

      const cliente = {
        name,
        notificationDisabled: false
      };

      if (cpfCnpj) cliente.cpfCnpj = cpfCnpj;
      if (email) cliente.email = email;
      if (mobilePhone) cliente.mobilePhone = mobilePhone;
      if (externalReference) {
        cliente.externalReference = externalReference;
      }

      const response = await fetch(
        "https://api.asaas.com/v3/customers",
        {
          method: "POST",
          headers,
          body: JSON.stringify(cliente)
        }
      );

      const data = await response.json();

      return res.status(response.status).json({
        ok: response.ok,
        cliente: data
      });
    }

    return res.status(405).json({
      ok: false,
      error: "Método não permitido"
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Erro ao comunicar com o Asaas",
      detalhe: error.message
    });
  }
}
