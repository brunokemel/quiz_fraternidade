const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function getApiUrl() {
  if (!API_URL) {
    throw new Error('O endereço da API ainda não foi configurado.')
  }

  return API_URL
}

async function readResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) return {}

  try {
    return await response.json()
  } catch {
    return {}
  }
}

export async function salvarPontuacao(nome, pontos) {
  const nomeLimpo = nome.trim()

  if (!nomeLimpo || nomeLimpo.length > 30) {
    throw new Error('Informe um nome com até 30 caracteres.')
  }

  if (!Number.isInteger(pontos) || pontos < 0 || pontos > 10) {
    throw new Error('A pontuação precisa ser um número inteiro entre 0 e 10.')
  }

  const response = await fetch(`${getApiUrl()}/ranking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: nomeLimpo,
      pontos,
    }),
  })
  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível salvar a pontuação.')
  }

  return data
}

export async function buscarRanking() {
  const response = await fetch(`${getApiUrl()}/ranking`)
  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível carregar o ranking.')
  }

  if (!Array.isArray(data)) {
    throw new Error('A API retornou um ranking inválido.')
  }

  return data
}
