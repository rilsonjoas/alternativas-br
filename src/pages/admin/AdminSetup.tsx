import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  User, 
  Code, 
  Database,
  Copy,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSetup: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const promoteScript = `// Execute este código no console do navegador (F12)
// Primeiro, faça login na aplicação

// 1. Obter seu User ID
console.log('Seu User ID:', firebase.auth().currentUser?.uid);

// 2. Copie o User ID e substitua abaixo
const userId = 'SEU_USER_ID_AQUI';

// 3. Execute para se promover a admin
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase';

async function promoteToAdmin(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: 'admin' });
    console.log('✅ Promovido a administrador!');
    window.location.reload();
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

promoteToAdmin(userId);`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuração de Administrador
          </h1>
          <p className="text-gray-600">
            Configure seu primeiro usuário administrador para gerenciar a plataforma
          </p>
        </div>

        {/* Status atual */}
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Sistema Administrativo Pronto!</strong> Agora você precisa promover seu usuário para acessar o painel admin.
          </AlertDescription>
        </Alert>

        {/* Passos para se tornar admin */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Passo 1: Faça Login
              </CardTitle>
              <CardDescription>
                Primeiro, você precisa estar logado na aplicação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p>Se ainda não tem uma conta:</p>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link to="/registrar">
                      <User className="w-4 h-4 mr-2" />
                      Criar Conta
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/login">
                      <User className="w-4 h-4 mr-2" />
                      Fazer Login
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Passo 2: Execute o Script no Console
              </CardTitle>
              <CardDescription>
                Use o console do navegador para se promover a administrador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Script de Promoção</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(promoteScript)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                    {promoteScript}
                  </pre>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Como executar:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Pressione <kbd className="bg-gray-200 px-1 rounded">F12</kbd> para abrir DevTools</li>
                    <li>Vá para a aba <strong>Console</strong></li>
                    <li>Cole o script acima</li>
                    <li>Substitua <code>SEU_USER_ID_AQUI</code> pelo seu ID real</li>
                    <li>Pressione <kbd className="bg-gray-200 px-1 rounded">Enter</kbd> para executar</li>
                    <li>A página recarregará automaticamente</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Alternativa: Firebase Console
              </CardTitle>
              <CardDescription>
                Edite diretamente no banco de dados Firebase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Se preferir, você pode editar diretamente no Firebase:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Acesse o <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
                  <li>Vá para o projeto <strong>alternativas-br</strong></li>
                  <li>Firestore Database → Collection <code>users</code></li>
                  <li>Encontre seu documento de usuário</li>
                  <li>Edite o campo <code>role</code> para <code>'admin'</code></li>
                  <li>Salve as alterações</li>
                </ol>
                
                <Button variant="outline" size="sm" asChild>
                  <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Firebase Console
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funcionalidades disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              O que você poderá fazer como Admin
            </CardTitle>
            <CardDescription>
              Funcionalidades disponíveis no painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  📊 Dashboard
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Estatísticas gerais da plataforma</li>
                  <li>• Métricas de uso e engagement</li>
                  <li>• Ações rápidas para gerenciamento</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  📁 Gerenciar Categorias
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Criar e editar categorias</li>
                  <li>• Configurar ícones e cores</li>
                  <li>• SEO e meta tags</li>
                  <li>• Ativar/desativar categorias</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  📦 Gerenciar Produtos
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Adicionar novos produtos</li>
                  <li>• Editar informações detalhadas</li>
                  <li>• Destacar produtos populares</li>
                  <li>• Moderar e filtrar conteúdo</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  ⚙️ Administração
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Gerenciar usuários e permissões</li>
                  <li>• Moderar avaliações</li>
                  <li>• Configurações do sistema</li>
                  <li>• Analytics e relatórios</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <div className="text-center mt-8">
          <h3 className="text-lg font-semibold mb-4">Após se tornar administrador</h3>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/admin">
                <Shield className="w-4 h-4 mr-2" />
                Acessar Painel Admin
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">
                Voltar ao Início
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
