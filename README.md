# Trabalho Final - Tópicos Especiais em Algoritmo

## API para Gestão de Entregas (Deliveries)

A Associação Comercial Paranaense (ACP) solicitou o desenvolvimento de uma API que seja capaz de gerir as entregas realizadas por seus associados.Esta API será utilizada a partir de requisições feitas por um aplicativo para dispositivos móveis ou por um sistema Web. Ela será responsável  por fornecer  o  conjunto  de serviços  webpara  execução  das  funcionalidades  do sistema e por realizar a integração com um Banco de Dados MySQL.

## O Projeto

O  projeto consiste  no  desenvolvimento  de  uma  API  em  Node.js  capaz  de  receber requisições, executas ações e fornecer respostas. 

### Breve descrição:

Os associados da ACP são os usuários que usam o sistema para gerir seu negócio. Eles cadastram clientes, motoboys e entregas. Podem receber relatórios administrativos e financeiros, além de checar todas as entregas.

Os motoboys usam o sistema para receber suas entregas pendentes, informar o valor da entrega e finalizar a entrega. Podem receber relatórios pessoais financeiros e checar seu histórico de entregas.

Os clientes são cadastrados no sistema pelos associados da ACP. Estas informações, bem como qualquer outra informação, é pertencente a apenas um associado, não há compartilhamento de dados entre usuários do sistema. Os clientes não possuem acesso ao sistema.

As entregas são cadastradas pelos associados e executadas/finalizadas pelos motoboys.

## Requisitos de Sistemas

Para o desenvolvimento da API, a ACP solicitou as seguintes funcionalidades:

- CRUD de associados:
    - [x] Cadastro de associados com os campos: Nome da empresa, CNPJ, senha e endereço (sendo este último o único opcional). CNPJ deve ser único, cuide para não permitir duplicações neste campo.
    - [x] Listar todos os associados.
    - [x] Listar um associado específico dado o CNPJ.
    - [x] Editar um associado específico passando o ID. Novamente cuide o campo CNPJ que deve ser único.
    - [x] Remover associado independente se há registros de entregas relacionados a ele. Remover todos os registros junto.

- CRUD de clientes:
    - [x] Cadastro de clientes com os campos: Nome da empresa, CNPJ e endereço (todos obrigatórios).
    - [x] Listar todos os clientes.
    - [x] Listar um cliente específico dado o CNPJ.
    - [x] Editar um cliente específico passando o ID.
    - [x] Remover cliente independente se há registros de entregas relacionados a ele.

- CRUD de motoboys:
    - [x] Cadastro de motoboys com os campos: Nome, CPF, senha e telefone (todos obrigatórios). CPF deve ser único no sistema.
    - [x] Listar todos os motoboys.
    - [x] Listar um motoboy específico dado o CPF.
    - [x] Editar um motoboy específico passando o ID.
    - [x] Remover motoboy independente se há registros de entregas relacionados a ele.

- CRUD de entregas:
    - [ ] Cadastro de entregas com os campos: Descrição, cliente, motoboy (status e valor serão campos atualizados pelo motoboy). Cada entrega é única no sistema.
    - [ ] Listar todas as entregas
    - [ ] Listar todas as entregas realizadas
    - [ ] Listar todas as entregas pendentes
    - [ ] Listar todas as entregas por motoboy
    - [ ] Editar uma entrega pendente.
    - [ ] Remover uma entrega pendente.
 
 - Esquema de Segurança
    - [x] Os associados e motoboys devem ser capazes de logar no sistema de forma segura com uso de hash da senha gravada no BD e token de autenticação para uso do sistema; O login é o CNPJ para associados e o CPF para motoboys;
    - [x] A senha deve conter ao menos 8 caracteres, uma letra, um símbolo especial e um número;
    - [x] O token deve ter validade máxima de 5 horas e deve ser invalidado também no logout.

- A ACP possui acesso as seguintes funcionalidades:
    - [x] CRUD de associados;
    - [x] Considere que a ACP não tem login e/ou senha. Ela apenas acessa as rotas fornecidas pela API, de maneira direta, para realizar o CRUD dos associados.

- Os associados possuem acesso as seguintes funcionalidades:
    - [x] Verificação e edição de seus dados, incluindo troca de senha;
    - [ ] CRUD de seus clientes, motoboys e entregas;
    - Relatório administrativo retornando 
        - [x] à quantidade total de clientes, motoboys e entregas cadastradas; 
        - [x] os top 5 clientes que solicitaram mais entregas; 
        - [x] os top 5 motoboys que realizaram mais entregas; 
        - [x] a porcentagem de entregas realizadas até o momento;
        - [x] a porcentagem de entregas pendentes até o momento;
    - Relatório financeiro retornando indicador do 
        - [x] valor total em Reais cobrado nas entregas realizadas, 
        - [x] a porcentagem a ser paga para os motoboys (considerar 70% do valor da entrega) e 
        - [x] a porcentagem do associado (considerar 30% do valor da entrega).

- Os motoboys possuem acesso as seguintes funcionalidades:
    - [ ] Lista de suas entregas realizadas
    - [ ] Lista de suas entregas pendentes
    - [ ] Edição de uma entrega pessoal pendente, atualizando o status dela para realizada e o valor em Real do custo da entrega.
    - [ ] Relatório financeiro retornando indicador do valor total em Reais cobrado nas entregas realizadas e sua porcentagem a ser paga (considerar 70% do valor da entrega).

    - [x] A ACP solicita que arquivos de migrations e seeders para cada tabela do sistema, além disto, solicita também que API seja desenvolvida de acordo com o Padrão MVC, já que outros desenvolvedores serão responsáveis pelo frontend.

## Observações

- Qualquer validação necessária fica a cargo dos desenvolvedores, sendo item de desconto caso alguma validação não seja realizada e apresente um problema para a lógica ou execução da API.

- Para cada resposta à uma requisição retorne o status adequado e uma mensagem informando o resultado da ação, bem como qualquer outro objeto necessário para finalização da requisição.

- O valor deste trabalho é de 40% da nota final;

- Deve ser realizado em grupos de 3 pessoas (sem exceções);

- A data da entrega do trabalho está no teams e será realizada uma apresentação para o professor durante a aula. Caso uma equipe não compareça na data marcada, automaticamente receberá a nota 0;

- Para a apresentação é necessária a participação de todos os integrantes da equipe;

- Não será permitido o desenvolvimento de funcionalidades ou correção de bugs durante a defesa.

- Não será tolerado qualquer tipo de cópia, acarretando em nota 0 para todos os integrantes e grupos envolvidos.

## Critérios de avaliação

- [ ] Configuração .env, BD MySQL, Sequelize, arquivos de migrações e seeders (com pelo menos 3 cadastros para cada tabela) funcionando corretamente – 0,5 ponto

- [ ] Funcionalidades da ACP funcionando corretamente – 0,5 ponto

- [ ] Login de associado e motoboy desenvolvido de forma correta e funcional – 0,5 ponto

- [ ] Funcionalidades dos associados desenvolvidas corretamente – 1,5 ponto

- [ ] Funcionalidades dos motoboys desenvolvidas corretamente – 1 ponto

## Perda de nota (algumas dicas)

- Validação de rotas em relação ao uso do token não funcional

- Não validar ou validar de forma incorreta a entrada de dados nas requisições

- Permitir CNPJ ou CPF duplicados

- Não cumprimento de alguma regra ou requisito da especificação

