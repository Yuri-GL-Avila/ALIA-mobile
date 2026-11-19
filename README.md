# ALIA — Alerta Inteligente de Apoio

## Sobre o projeto

O **ALIA** é um protótipo acadêmico de aplicativo mobile desenvolvido com **React Native, Expo e TypeScript**, voltado à segurança feminina.

A proposta busca oferecer ferramentas de apoio e acompanhamento em situações de risco, reunindo funcionalidades como acionamento de SOS, check-in de segurança, contatos de confiança e monitoramento de ocorrências.

O projeto também contempla um dispositivo físico vestível, cuja conexão Bluetooth é simulada nesta versão.

Além do aplicativo, o ALIA conta com uma **plataforma web integrada**, que apresenta informações sobre a solução e disponibiliza uma Central para gerenciamento de ocorrências.

## Funcionalidades do aplicativo

- **SOS com long-press:** acionamento do alerta ao manter o botão pressionado por aproximadamente 1,2 segundo.
- **Check-in de segurança:** configuração de períodos de 5, 15 ou 30 minutos para confirmação de segurança.
- **Lugares seguros:** cadastro e gerenciamento de locais de referência.
- **Rede de confiança:** gerenciamento de contatos pessoais de apoio.
- **Linha do tempo:** acompanhamento dos eventos relacionados a uma ocorrência.
- **Central de atendimento demonstrativa:** interface de aceitação e acompanhamento de alertas.
- **Dispositivo físico simulado:** representação da conexão com um dispositivo vestível por Bluetooth Low Energy (BLE).
- **Histórico de ocorrências:** visualização dos registros apresentados pelo aplicativo.
- **Privacidade:** opções relacionadas ao compartilhamento de localização e notificações.
- **Canais de apoio:** acesso a informações sobre os serviços 180 e 190.

## Integração com a plataforma web

Uma das principais evoluções do projeto foi a integração do aplicativo mobile com a plataforma web ALIA, utilizando o **Supabase** como serviço de autenticação e banco de dados.

Anteriormente, o aplicativo utilizava dados demonstrativos armazenados localmente, sem comunicação efetiva com a plataforma web.

Com as modificações implementadas, o aplicativo passou a registrar ocorrências no banco de dados e consultar as atualizações realizadas pelos operadores da Central.

### Autenticação

O sistema de login demonstrativo foi adaptado para utilizar o **Supabase Auth**.

A autenticação passou a validar e-mail e senha, permitindo que as ocorrências sejam associadas ao identificador da usuária autenticada.

O aplicativo utiliza contas de usuárias, enquanto o acesso à Central web é restrito aos operadores autorizados.

### Envio de ocorrências

A função `triggerSOS()`, localizada no arquivo `src/context/AppContext.tsx`, foi modificada para enviar uma ocorrência à tabela `occurrences` do Supabase.

Cada registro possui um identificador único, o ID da usuária, a origem do alerta, o status e as datas de criação e atualização.

Após o envio, a ocorrência pode ser visualizada pela Central ALIA no navegador.

### Sincronização dos status

Foi implementada uma função de sincronização que consulta periodicamente o banco de dados para identificar alterações nas ocorrências.

Dessa forma, quando um operador modifica o status de um alerta na Central web, o aplicativo recebe essa atualização e a apresenta à usuária.

Os principais status utilizados são:

| Status | Significado |
|---|---|
| `sent` | Alerta enviado |
| `waiting` | Aguardando atendimento |
| `accepted` | Ocorrência aceita |
| `in_progress` | Atendimento em acompanhamento |
| `finished` | Ocorrência concluída |

Quando uma ocorrência é concluída pela Central, o aplicativo também encerra automaticamente o modo de emergência demonstrativo.

### Fluxo de funcionamento

1. A usuária realiza o login no aplicativo.
2. O botão SOS é acionado.
3. O aplicativo registra uma ocorrência no Supabase.
4. A Central web consulta e exibe a nova ocorrência.
5. Um operador autenticado aceita e atualiza o atendimento.
6. O aplicativo sincroniza o novo status.
7. Ao concluir a ocorrência, o modo de emergência é encerrado.

Essa integração permite demonstrar a comunicação entre duas plataformas independentes utilizando um banco de dados compartilhado.

## Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| React Native | Desenvolvimento da interface mobile |
| Expo | Ambiente de desenvolvimento e execução |
| TypeScript | Tipagem e organização do código |
| React Context API | Gerenciamento de estados globais |
| Supabase Auth | Autenticação das usuárias |
| Supabase / PostgreSQL | Armazenamento e consulta das ocorrências |
| AsyncStorage | Persistência local da sessão de autenticação |
| Git e GitHub | Versionamento e disponibilização do projeto |

A plataforma web integrada utiliza React, Vite, JavaScript e Supabase.

## Como executar o aplicativo

### Pré-requisitos

- Node.js e npm instalados.
- VS Code ou outro editor de código.
- Expo Go instalado no celular ou um emulador compatível.
- Acesso a um projeto Supabase configurado.

### Instalação

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Caso seja necessário ajustar as versões das dependências para o SDK do Expo:

```bash
npx expo install --check
npx expo install --fix
```

### Configuração do Supabase

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=URL_DO_PROJETO_SUPABASE
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=CHAVE_PUBLICAVEL_SUPABASE
```

As variáveis devem apontar para um projeto Supabase com autenticação, tabela de ocorrências e políticas de acesso configuradas.

Não publique senhas ou chaves secretas no repositório. As variáveis `EXPO_PUBLIC_` são incorporadas ao aplicativo e não devem conter informações confidenciais.

### Inicialização

Execute:

```bash
npx expo start -c
```

Após iniciar o servidor, escaneie o QR Code utilizando o Expo Go ou execute o aplicativo em um emulador compatível.

Para testar o envio de ocorrências, utilize uma conta de demonstração previamente cadastrada no Supabase.

## Estrutura principal

```text
alia-mobile/
├── src/
│   ├── context/
│   │   └── AppContext.tsx
│   ├── services/
│   │   └── supabase.ts
│   └── ...
├── App.tsx
├── package.json
├── .env
└── README.md
```

O arquivo `AppContext.tsx` concentra o gerenciamento dos estados globais, incluindo autenticação, ocorrências, contatos, locais seguros e configurações do aplicativo.

O arquivo `supabase.ts` é responsável por configurar a comunicação com o Supabase.

## Limitações do protótipo

O ALIA foi desenvolvido para fins acadêmicos e de demonstração.

Embora o envio de ocorrências e a sincronização de status utilizem um banco de dados real, algumas funcionalidades permanecem simuladas ou parcialmente locais:

- O dispositivo vestível e a conexão BLE são simulados.
- A localização utilizada no fluxo demonstrativo não representa necessariamente o GPS real.
- O aplicativo não aciona serviços policiais ou equipes de emergência.
- O envio de notificações reais aos contatos de confiança não foi implementado.
- O histórico completo de ocorrências ainda não é recuperado automaticamente do servidor após reiniciar o aplicativo.
- A sincronização de status utiliza consultas periódicas ao banco de dados.

Portanto, o aplicativo não deve ser utilizado como ferramenta real de atendimento emergencial.

## Melhorias futuras

- Integração com um dispositivo físico vestível.
- Utilização de localização GPS em tempo real, mediante consentimento.
- Notificações push para atualizações das ocorrências.
- Sincronização em tempo real com o Supabase Realtime.
- Recuperação completa do histórico de ocorrências.
- Aprimoramento dos recursos de acessibilidade.
- Ampliação dos testes de segurança e confiabilidade.

## Considerações finais

O desenvolvimento do ALIA permitiu aplicar conceitos de desenvolvimento mobile, gerenciamento de estados, autenticação e integração entre sistemas.

A conexão com a plataforma web representa uma evolução importante do protótipo, permitindo que alertas registrados pelo aplicativo sejam visualizados e gerenciados em uma Central administrativa.

O resultado demonstra o funcionamento de uma solução integrada entre aplicativo mobile, plataforma web e banco de dados, mantendo o foco em acessibilidade, usabilidade e segurança feminina.

**ALIA — Alerta Inteligente de Apoio**
