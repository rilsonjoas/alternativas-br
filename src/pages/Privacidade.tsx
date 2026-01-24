import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const Privacidade = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Política de Privacidade - AlternativasBR"
        description="Política de privacidade e proteção de dados do AlternativasBR"
      />
      
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">
              Política de Privacidade
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introdução</h2>
              <p className="text-muted-foreground mb-4">
                O AlternativasBR respeita sua privacidade e está comprometido em proteger suas informações pessoais. 
                Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações 
                quando você usa nosso site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Informações que Coletamos</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">2.1 Informações Fornecidas por Você</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Dados de contato quando você envia mensagens através do formulário</li>
                    <li>Informações de produtos quando você sugere novas alternativas</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">2.2 Informações Coletadas Automaticamente</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Dados de navegação e uso do site</li>
                    <li>Endereço IP e informações do dispositivo</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Como Usamos suas Informações</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Responder às suas solicitações e perguntas</li>
                <li>Analisar o uso do site para melhorar a experiência do usuário</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Compartilhamento de Informações</h2>
              <p className="text-muted-foreground mb-4">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Quando necessário para cumprir obrigações legais</li>
                <li>Com provedores de serviços que nos ajudam a operar o site</li>
                <li>Em caso de fusão, aquisição ou venda de ativos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Usamos cookies para melhorar sua experiência de navegação. Você pode configurar seu navegador 
                para recusar cookies, mas isso pode afetar algumas funcionalidades do site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Segurança de Dados</h2>
              <p className="text-muted-foreground mb-4">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
                suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Seus Direitos (LGPD)</h2>
              <p className="text-muted-foreground mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Exclusão de dados pessoais</li>
                <li>Portabilidade de dados</li>
                <li>Revogação do consentimento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Retenção de Dados</h2>
              <p className="text-muted-foreground mb-4">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos 
                descritos nesta política, a menos que um período de retenção mais longo seja exigido por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Alterações nesta Política</h2>
              <p className="text-muted-foreground mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças 
                significativas através do site ou por outros meios adequados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contato</h2>
              <p className="text-muted-foreground mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
                entre em contato conosco através da página de contato.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacidade;