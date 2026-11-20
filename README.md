# SaveUs — App Mobile

**Global Solution 2026/2 · CitizenTech · Mobile Application Development**

| Nome | RM |
|---|---|
| Anna Clara Russo Luca | 561928 |
| Gabriel Duarte Maciel | 565754 |
| Tiago Guedes da Costa | 564731 |
| Gustavo Tavares da Silva | 562827 |

O **SaveUs** ajuda pessoas idosas a passar as ondas de calor em segurança. Prédios públicos frescos
(bibliotecas, CEUs, UBSs, centros comunitários) viram **refúgios climáticos**: o idoso encontra um refúgio aberto
no bairro, reserva uma vaga e mostra o comprovante com QR code na porta. O gestor público cadastra, edita, pausa
e exclui os refúgios. ODS 3, 11 e 13.

- **Vídeo (até 5 min):** _a preencher_
- **Firebase App Distribution:** _a preencher_ (o e-mail do professor entra como tester)

## Telas

| Área | Tela | Rota |
|---|---|---|
| Autenticação | Login | `/(auth)/login` |
| Autenticação | Cadastro (cria sempre um IDOSO) | `/(auth)/cadastro` |
| Idoso | Início: refúgios abertos por bairro e data, com selo de vagas | `/(idoso)/(tabs)` |
| Idoso | Detalhe do refúgio e reserva da vaga | `/(idoso)/refugio/[id]` |
| Idoso | Comprovante com QR code | `/(idoso)/reserva/[id]` |
| Idoso | Minhas reservas, com cancelamento | `/(idoso)/(tabs)/reservas` |
| Idoso | Perfil e contato de emergência | `/(idoso)/(tabs)/perfil` |
| Idoso | Guia do Calor (personalizado por IA quando o backend Java está configurado) | `/(idoso)/guia-calor` |
| Gestor | Lista de refúgios, pausar e reativar | `/gestor` |
| Gestor | Novo refúgio (endereço pelo CEP) | `/gestor/refugio/novo` |
| Gestor | Editar e excluir refúgio | `/gestor/refugio/[id]` |
| Todos | Sobre o App (versão e commit do build) | `/sobre` |

As rotas são protegidas por papel com `Stack.Protected` (`src/app/_layout.tsx`): sem sessão só se vê o login e
o cadastro; o idoso não abre telas do gestor e vice-versa. O logout apaga a sessão e volta para o login.

## Integração com as APIs

O app fala com os dois backends da solução, que usam o **mesmo banco Oracle, o mesmo JWT e o mesmo contrato
JSON e de erro**. Por isso o token do login (.NET) vale também no Java, e o tratamento de erro é um só.

| Área | Backend | Cliente HTTP |
|---|---|---|
| Login, cadastro, refúgios (leitura), reservas e perfil | .NET (`refugio_.net`) | `api` |
| Gestor: listar, criar, editar, pausar, excluir refúgios e CEP | Java (`saveUs-java`, refugio-service) | `apiJava` |
| Guia do Calor com IA (`POST /api/v1/ia/guia-do-calor`) | Java | `apiJava` |

`src/services/api/client.ts` cria os dois clientes com a mesma fábrica (`criarCliente`): token no header,
erros em `ApiError` (lê `title`, `detail`, `errors` por campo e `Retry-After`) e logout automático em 401.
Sem `EXPO_PUBLIC_JAVA_API_URL`, `apiJava` aponta para o .NET (que tem o mesmo CRUD do gestor) e o Guia do Calor
mostra só os cuidados fixos.

**Regras que o app reflete:** reserva com `Idempotency-Key` (toque duplo não cria duas reservas), uma reserva por
dia, refúgio pausado sem vagas, selo "Só N vagas" até 3 vagas ou 10% da capacidade, datas sempre no fuso de São
Paulo e informação de saúde (sinais de alerta e SAMU 192) fixa no app, nunca gerada pela IA.

## Arquitetura

```
src/
  app/            rotas (Expo Router): (auth), (idoso), gestor, sobre
  components/     componentes de UI reutilizáveis e de formulário
  features/       uma pasta por funcionalidade: auth, refugios, reservas, gestor, perfil, guia-calor
                  (service da API, hooks com TanStack Query, componentes e regras da feature)
  services/       clientes HTTP, tratamento de erro, sessão e chaves de cache
  types/          schemas Zod do contrato da API (validam toda resposta)
  theme/, utils/  tokens de cor, navegação, datas no fuso de São Paulo, máscaras
assets/images/    logo, ícone e splash
```

Tecnologias: Expo SDK 58, Expo Router, TanStack Query, Axios, React Hook Form + Zod, NativeWind, Expo Secure
Store (sessão), Plus Jakarta Sans.

## Como rodar

```bash
npm ci
cp .env.example .env.local        # preencha EXPO_PUBLIC_JAVA_API_URL se for usar o backend Java
npm start                         # a = Android, i = iOS
npm run lint
```

Usuários de teste (senha `Senha@123`): `maria@email.com` e `jose@email.com` (idosos), `gestor@refugio.com`
(gestor).

## Publicação

O build publicado no Firebase App Distribution precisa ser do mesmo commit enviado. A tela **Sobre o App** mostra
o hash do commit do build (`app.config.js` grava `git rev-parse HEAD` em `extra.commitHash`; em CI, defina
`EXPO_PUBLIC_COMMIT_HASH`).

## Declaração de uso de IA

Usamos um assistente de IA generativa como apoio para revisar código, a integração com as APIs e a
documentação. Todo o código foi revisado e testado pelo grupo, responsável pelo conteúdo entregue.
