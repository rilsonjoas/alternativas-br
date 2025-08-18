import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// Interface para tipagem das alternativas
interface Alternativa {
  name: string;
  category: string;
  description: string;
  logo: string;
  tags: string[];
  slug: string;
  pricing: { price: string }[];
  estrangeiro: string[];
}

// Lista de alternativas brasileiras
const alternativas: Alternativa[] = [
  {
    name: "RegataOS",
    category: "Sistema Operacional",
    description:
      "Distribuição Linux brasileira focada em desempenho, usabilidade e jogos.",
    logo: "https://regataos.com.br/img/logo.png",
    tags: ["Linux", "Desktop", "Open Source"],
    slug: "regataos",
    pricing: [{ price: "Gratuito" }],
    estrangeiro: ["Windows", "Ubuntu", "Fedora", "macOS"],
  },
  {
    name: "TOTVS",
    category: "ERP e Gestão Empresarial",
    description: "Líder nacional em soluções de ERP para diversos setores.",
    logo: "https://www.totvs.com/wp-content/themes/totvs/img/logo-totvs.svg",
    tags: ["ERP", "Gestão", "Corporativo"],
    slug: "totvs",
    pricing: [{ price: "Sob consulta" }],
    estrangeiro: ["SAP", "Oracle", "Microsoft Dynamics"],
  },
  {
    name: "E-goi",
    category: "Marketing Digital",
    description: "Plataforma de automação de marketing multicanal.",
    logo: "https://www.e-goi.com/images/logo.svg",
    tags: ["Automação", "Email", "SMS", "WhatsApp"],
    slug: "e-goi",
    pricing: [{ price: "Freemium" }],
    estrangeiro: ["Mailchimp", "HubSpot", "ActiveCampaign"],
  },
  {
    name: "Crie.art.br",
    category: "Design Online",
    description: "Ferramenta online para criação de artes e design.",
    logo: "https://crie.art.br/assets/logo.svg",
    tags: ["Design", "Criatividade", "Online"],
    slug: "crie-art-br",
    pricing: [{ price: "Freemium" }],
    estrangeiro: ["Canva", "Adobe Express"],
  },
  {
    name: "99 pop",
    category: "Mobilidade Urbana",
    description: "Aplicativo brasileiro de transporte por carros particulares.",
    logo: "https://99app.com/wp-content/uploads/2021/03/logo-99.png",
    tags: ["Transporte", "Mobilidade", "App"],
    slug: "99-pop",
    pricing: [{ price: "Variável" }],
    estrangeiro: ["Uber", "Lyft"],
  },
  {
    name: "Omie",
    category: "ERP Cloud",
    description: "ERP cloud para pequenas e médias empresas.",
    logo: "https://www.omie.com.br/images/logo.svg",
    tags: ["ERP", "Cloud", "PME"],
    slug: "omie",
    pricing: [{ price: "Sob consulta" }],
    estrangeiro: ["QuickBooks", "Xero"],
  },
  {
    name: "LeadLovers",
    category: "Automação de Marketing",
    description: "Automação de marketing e vendas.",
    logo: "https://leadlovers.com/assets/img/logo.svg",
    tags: ["Marketing", "Leads", "Vendas"],
    slug: "leadlovers",
    pricing: [{ price: "Sob consulta" }],
    estrangeiro: ["GetResponse", "Infusionsoft"],
  },
  {
    name: "V1",
    category: "Mobilidade Urbana",
    description: "App de mobilidade urbana do Grupo Caoa.",
    logo: "https://v1app.com.br/assets/logo.svg",
    tags: ["Transporte", "Mobilidade", "App"],
    slug: "v1",
    pricing: [{ price: "Variável" }],
    estrangeiro: ["Uber", "Cabify"],
  },
  {
    name: "Logaster Brasil",
    category: "Identidade Visual",
    description: "Criação de logotipos e identidade visual.",
    logo: "https://www.logaster.com.br/assets/logo.svg",
    tags: ["Logo", "Design", "Marca"],
    slug: "logaster-brasil",
    pricing: [{ price: "Freemium" }],
    estrangeiro: ["Looka", "Tailor Brands"],
  },
  {
    name: "PagSeguro",
    category: "Pagamentos Online",
    description: "Soluções de pagamento online e presencial.",
    logo: "https://pagseguro.uol.com.br/assets/logo.svg",
    tags: ["Pagamentos", "Online", "POS"],
    slug: "pagseguro",
    pricing: [{ price: "Variável" }],
    estrangeiro: ["PayPal", "Stripe"],
  },
  {
    name: "Vindi",
    category: "Pagamentos Recorrentes",
    description: "Plataforma de pagamentos recorrentes.",
    logo: "https://vindi.com.br/assets/logo.svg",
    tags: ["Pagamentos", "Recorrente", "SaaS"],
    slug: "vindi",
    pricing: [{ price: "Sob consulta" }],
    estrangeiro: ["Stripe", "Braintree"],
  },
  {
    name: "Alura",
    category: "Educação Online",
    description: "Plataforma de cursos online focada em tecnologia.",
    logo: "https://www.alura.com.br/assets/img/alura-logo.svg",
    tags: ["Cursos", "Tecnologia", "Online"],
    slug: "alura",
    pricing: [{ price: "Assinatura" }],
    estrangeiro: ["Udemy", "Coursera"],
  },
  {
    name: "Descomplica",
    category: "Educação Online",
    description: "Educação online para vestibulares e ENEM.",
    logo: "https://descomplica.com.br/assets/logo.svg",
    tags: ["Educação", "ENEM", "Vestibular"],
    slug: "descomplica",
    pricing: [{ price: "Assinatura" }],
    estrangeiro: ["Khan Academy", "Coursera"],
  },
  {
    name: "Zenvia",
    category: "Comunicação Multicanal",
    description: "Plataforma de comunicação multicanal (SMS, WhatsApp, voz).",
    logo: "https://www.zenvia.com/assets/logo.svg",
    tags: ["SMS", "WhatsApp", "Voz"],
    slug: "zenvia",
    pricing: [{ price: "Sob consulta" }],
    estrangeiro: ["Twilio", "SendGrid"],
  },
  {
    name: "Meetime",
    category: "Inside Sales",
    description: "Inside sales e automação de vendas.",
    logo: "https://meetime.com.br/assets/logo.svg",
    tags: ["Vendas", "Automação", "Inside Sales"],
    slug: "meetime",
    pricing: [{ price: "Sob consulta" }],
    estrangeiro: ["Outreach", "Salesloft"],
  },
  {
    name: "Locaweb",
    category: "Cloud e Hospedagem",
    description: "Hospedagem, cloud e serviços digitais.",
    logo: "https://www.locaweb.com.br/assets/logo.svg",
    tags: ["Cloud", "Hospedagem", "Web"],
    slug: "locaweb",
    pricing: [{ price: "Sob consulta" }],
    estrangeiro: ["GoDaddy", "HostGator", "AWS"],
  },
  {
    name: "Umbler",
    category: "Cloud e Hospedagem",
    description: "Cloud e hospedagem para desenvolvedores.",
    logo: "https://www.umbler.com/assets/logo.svg",
    tags: ["Cloud", "Hospedagem", "Dev"],
    slug: "umbler",
    pricing: [{ price: "Sob consulta" }],
    estrangeiro: ["DigitalOcean", "Heroku"],
  },
  {
    name: "GetNinjas",
    category: "Serviços Profissionais",
    description: "Marketplace de serviços profissionais.",
    logo: "https://www.getninjas.com.br/assets/logo.svg",
    tags: ["Serviços", "Marketplace", "Profissionais"],
    slug: "getninjas",
    pricing: [{ price: "Variável" }],
    estrangeiro: ["TaskRabbit", "Thumbtack"],
  },
  {
    name: "QuintoAndar",
    category: "Imóveis",
    description: "Plataforma de aluguel residencial.",
    logo: "https://www.quintoandar.com.br/assets/logo.svg",
    tags: ["Imóveis", "Aluguel", "Residencial"],
    slug: "quintoandar",
    pricing: [{ price: "Variável" }],
    estrangeiro: ["Zillow", "Airbnb"],
  },
  {
    name: "iFood",
    category: "Delivery de Comida",
    description: "Entrega de comida online.",
    logo: "https://www.ifood.com.br/assets/logo.svg",
    tags: ["Delivery", "Comida", "Online"],
    slug: "ifood",
    pricing: [{ price: "Variável" }],
    estrangeiro: ["Uber Eats", "DoorDash", "Rappi"],
  },
];

async function adicionarAlternativas(): Promise<void> {
  try {
    console.log("🚀 Iniciando inserção das alternativas brasileiras...");

    for (const alternativa of alternativas) {
      try {
        await addDoc(collection(db, "products"), alternativa);
        console.log(
          `✅ Adicionado: ${alternativa.name} (${alternativa.category})`
        );
      } catch (error) {
        console.error(`❌ Erro ao adicionar ${alternativa.name}:`, error);
      }
    }
  } catch (error) {
    console.error("❌ Erro geral ao adicionar alternativas:", error);
    process.exit(1);
  }
}

// Executar o script
adicionarAlternativas()
  .then(() => {
    console.log("🎉 Todas as alternativas brasileiras foram processadas!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Erro fatal:", error);
    process.exit(1);
  });
