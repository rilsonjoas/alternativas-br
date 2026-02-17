import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const Termos = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Termos de Uso - AlternativasBR"
        description="Termos de uso e condições de utilização do AlternativasBR"
      />
      
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">
              Termos de Uso
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground mb-4">
                Ao acessar e usar o AlternativasBR, você concorda em cumprir e estar vinculado a estes 
                Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground mb-4">
                O AlternativasBR é uma plataforma que lista e compara produtos e serviços brasileiros 
                como alternativas a soluções internacionais. Nosso objetivo é promover o ecossistema 
                tecnológico nacional.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Uso Permitido</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Você pode usar nosso site para:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Pesquisar e descobrir produtos brasileiros</li>
                  <li>Comparar diferentes soluções</li>
                  <li>Sugerir novos produtos para inclusão</li>
                  <li>Entrar em contato conosco</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Uso Proibido</h2>
              <p className="text-muted-foreground mb-4">
                É proibido usar nosso site para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Atividades ilegais ou fraudulentas</li>
                <li>Enviar spam ou conteúdo malicioso</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Interferir no funcionamento do site</li>
                <li>Coletar dados de outros usuários sem autorização</li>
                <li>Usar o site para fins comerciais não autorizados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Conteúdo do Usuário</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Ao enviar conteúdo para nosso site (sugestões, comentários, etc.), você:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Garante que possui os direitos necessários para compartilhar o conteúdo</li>
                  <li>Concede ao AlternativasBR uma licença não exclusiva para usar o conteúdo</li>
                  <li>É responsável pela veracidade e legalidade do conteúdo</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Propriedade Intelectual</h2>
              <p className="text-muted-foreground mb-4">
                Todo o conteúdo do AlternativasBR, incluindo textos, gráficos, logotipos, imagens e 
                software, é propriedade nossa ou de nossos licenciadores e está protegido por leis de 
                direitos autorais e outras leis de propriedade intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Isenção de Responsabilidade</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  O AlternativasBR é fornecido "como está" e "conforme disponível". Não garantimos:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>A precisão ou completude das informações listadas</li>
                  <li>A disponibilidade contínua do site</li>
                  <li>A ausência de erros ou vulnerabilidades</li>
                </ul>
                <p className="mt-4">
                  Recomendamos que você sempre verifique informações diretamente com os fornecedores 
                  dos produtos antes de tomar decisões de compra.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground mb-4">
                Em nenhuma circunstância seremos responsáveis por danos diretos, indiretos, incidentais, 
                especiais ou consequentes resultantes do uso ou incapacidade de usar nosso site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Links para Sites Terceiros</h2>
              <p className="text-muted-foreground mb-4">
                Nosso site pode conter links para sites de terceiros. Não somos responsáveis pelo 
                conteúdo ou práticas de privacidade desses sites. Recomendamos que você leia os 
                termos e políticas desses sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Modificações</h2>
              <p className="text-muted-foreground mb-4">
                Reservamos o direito de modificar estes Termos de Uso a qualquer momento. As mudanças 
                entrarão em vigor imediatamente após a publicação no site. Seu uso continuado constitui 
                aceitação dos termos modificados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Rescisão</h2>
              <p className="text-muted-foreground mb-4">
                Podemos suspender ou encerrar seu acesso ao site a qualquer momento, sem aviso prévio, 
                se acreditarmos que você violou estes termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Lei Aplicável</h2>
              <p className="text-muted-foreground mb-4">
                Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
                Qualquer disputa será resolvida nos tribunais brasileiros competentes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contato</h2>
              <p className="text-muted-foreground mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através 
                da página de contato.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Termos;