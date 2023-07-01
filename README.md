# ProManage
O ProManage é uma solução poderosa de gestão do tempo dos consultores, projetada para facilitar o controle e a organização das atividades diárias. Com essa ferramenta, os consultores podem registrar e acompanhar de forma simples e eficiente as tarefas realizadas, além de gerenciar o tempo dedicado a cada uma delas. Essa abordagem possibilita a extração de relatórios e indicadores detalhados, fornecendo informações valiosas aos líderes para avaliar a aderência dos projetos.

## Pré-requisitos
Antes de iniciar, certifique-se de ter o seguinte instalado em sua máquina:

-   Node.js: [https://nodejs.org](https://nodejs.org)
-   Yarn: [https://yarnpkg.com](https://yarnpkg.com)
-   MySQL: [https://www.mysql.com](https://www.mysql.com)

## Configuração do Banco de Dados
1. Crie um banco de dados no MySQL para o seu sistema.

2. Renomeie o arquivo `.env.example` para `.env` no diretório raiz do projeto.

3. Abra o arquivo `.env` e atualize as seguintes variáveis de ambiente com as configurações do seu banco de dados:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco_de_dados
```

Certifique-se de fornecer o nome de usuário, senha e nome do banco de dados corretos.

## Instalação
1. Clone este repositório:

```shell
git clone https://github.com/estudante-lucas/pi3.git
```

Navegue até o diretório raiz do projeto:

```shell
cd pi3
```

Instale as dependências do projeto usando o Yarn:

```shell
yarn install
```

## Executando o Sistema
Após concluir as etapas de configuração e instalação, você pode executar o sistema usando o seguinte comando:

```shell
yarn dev
```
Isso iniciará o sistema e estará pronto para ser acessado em http://localhost:3000.

## Contribuição
Se você quiser contribuir para este projeto, fique à vontade para enviar pull requests ou relatar problemas na seção de issues.

## Licença
Este projeto está licenciado sob a Licença Academic Free License ("AFL") v. 3.0. Consulte o arquivo LICENSE para obter mais informações.