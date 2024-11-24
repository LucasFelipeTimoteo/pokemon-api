PT-BR

## Arquitetura
A escolha arquitetural do projeto foi a de Microsserviços para a aplicação inteira, e a arquiteura individual de cada serviço foi Clean Architecture (arquitetura limpa). A arquitetura também é fortemente lastreada nos conceitos de injeção de dependência (DI), OOP e DDD.

### DDD
O DDD (Domain-Driven Design) é uma metodologia de desenvolvimento que tem como objetivo colocar as regras de negócio no centro do desenvolvimento e do planejamento da aplicação. Do ponto de vista arquitetural, ele é um excelente complemento tanto para microsserviços — pois, através dos aggregates do DDD, é possível delimitar quais microsserviços serão criados — quanto para a Clean Architecture, que serve como guia principal na modelagem do domínio da aplicação.

### Microserviços
A escolha por microsserviços não foi baseada em uma necessidade técnica real do projeto, mas sim para fins puramente demonstrativos. Essa arquitetura é ideal para aplicações de grande porte que exigem uma alta demanda de escalabilidade, pois sua principal vantagem é a escalabilidade sob demanda de partes específicas do sistema, o desacoplamento e a possibilidade de uma alocação mais eficiente de squads. Cada squad pode focar-se em serviços específicos, e cada serviço pode ter suas próprias regras de negócio e demandas tecnológicas.

As desvantagens dessa arquitetura incluem o aumento substancial da complexidade do projeto, além de uma leve redução na performance devido à latência de rede gerada pela necessidade de comunicação entre os serviços. Esse problema pode ser mitigado com a implementação de protocolos de comunicação assíncrona, como o AMQP, embora isso também acrescente uma complexidade significativa ao projeto.

Portanto, considerando todos os trade-offs dessa arquitetura, eu não a escolheria para esse projeto caso se tratasse de uma aplicação comercial real.

### Clean Architecture
Essa arquitetura é ideal para aplicações de médio a grande porte que precisam acomodar escalabilidade, pois sua principal vantagem é o desacoplamento das regras de negócio e de aplicação em relação à implementação de ferramentas externas. Isso garante que o núcleo do negócio permaneça "limpo", sem influência de qualquer ferramenta ou implementação externa. Além de proporcionar maior clareza das regras de negócio, essa abordagem facilita a alteração de detalhes de implementação, como a troca de bancos de dados ou frameworks, sem impactar o núcleo, tornando essa transição muito mais fácil e segura.

Todavia, essa abordagem não é tão vantajosa para aplicações menores que não têm uma demanda de escalabilidade, pois o desacoplamento de um sistema não é algo que vem de graça! Em geral, o desacoplamento aumenta a complexidade e o tempo de desenvolvimento.

Dito isso, a minha escolha por essa arquitetura dependeria da situação. Se o projeto exigisse escalabilidade e houvesse tempo suficiente para o desenvolvimento, eu optaria pela Clean Architecture ou por uma versão simplificada dela. No entanto, se o projeto não precisasse escalar ou se o prazo de entrega fosse muito curto, eu escolheria uma abordagem MVC em vez da Clean Architecture.

### Injeção de dependência e OOP
Escolhi usar Injeção de Dependência e Programação Orientada a Objetos (OOP) na aplicação, pois essas abordagens têm uma boa sinergia com a Clean Architecture, além de facilitarem ainda mais o desacoplamento e os testes da aplicação. Além disso, outros patterns também foram aplicados na arquitetura, como o Strategy pattern e outros.

## Databases
Os bancos de dados escolhidos foram Mongodb e Redis

### MongoDB
Um banco de dados NoSQL baseado em documentos, extremamente rápido e com foco em sistemas distribuídos. Diferente de um banco SQL, onde a normalização é necessária para evitar duplicação e redundância de dados, o MongoDB adota uma premissa de trabalhar com dados denormalizados, permitindo algum grau de redundância em troca de maior disponibilidade e maior velocidade nas operações de leitura, já que joins se tornam desnecessários ou mais raros.

### Redis
A opção mais popular para armazenamento de dados em memória e caching. A escolha do Redis se deu por sua simplicidade, popularidade e bom desempenho para as demandas desta aplicação.

## Autenticação
A autenticação faz uso de Bearer tokens JWT, utilizando-se do sistema de Access Tokens e Refresh Tokens como meio de segurança.

### Tokens
Os tokens JWT podem ser de dois tipos: Access Tokens e Refresh Tokens. A escolha desse método de autenticação deve-se ao fato de que, além de ser amplamente consolidado e seguro, ele reduz consideravelmente a carga de acesso ao banco de dados. Isso ocorre porque o processo de verificação de Access Tokens não exige consultas ao banco de dados, sendo necessário acessá-lo apenas eventualmente ao usar os Refresh Tokens.

Os Refresh Tokens foram armazenados em memória no banco de dados Redis. Embora essa escolha possa ser um pouco controversa, ela tem uma justificativa: apesar de os Refresh Tokens serem informações sensíveis, eles são descartáveis. No pior cenário, se a aplicação sofrer uma queda, os usuários apenas precisarão fazer login novamente antes do vencimento previsto do Refresh Token. Em minha análise, o ganho em desempenho e a redução de custos proporcionados por essa implementação compensam a eventual necessidade de login antecipado.

### Sobre a autenticação
A autenticação da aplicação é simples, baseada em Bearer Tokens JWT e realizada pelo API Gateway. Os serviços não têm responsabilidade de autenticar usuários; eles apenas entregam o conteúdo, confiando que o API Gateway já tenha lidado com essa responsabilidade.


### Autorização
A autorização também é simples e direta: consiste em permitir que o usuário autenticado modifique apenas seus próprios dados com base no ID presente no JWT de autenticação.