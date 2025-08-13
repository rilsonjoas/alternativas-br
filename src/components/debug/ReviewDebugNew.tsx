import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

interface ReviewDebugProps {
  productId: string;
  className?: string;
}

const ReviewDebug: React.FC<ReviewDebugProps> = ({ productId, className }) => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);
  const [isTestingService, setIsTestingService] = useState(false);

  const addLog = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log('🔧 ReviewDebug:', message);
  };

  const testFirebaseConnection = async () => {
    setIsTestingFirebase(true);
    addLog('🔥 Iniciando teste Firebase...');
    
    try {
      // 1. Testar importação básica
      addLog('📦 Importando Firebase...');
      const firebaseModule = await import('@/lib/firebase');
      const { db } = firebaseModule;
      addLog('✅ Firebase importado com sucesso');
      
      // 2. Testar se o DB está inicializado
      if (!db) {
        throw new Error('Database não inicializado');
      }
      addLog('✅ Database inicializado');
      
      // 3. Testar acesso à coleção
      addLog('📚 Testando acesso à coleção reviews...');
      const { collection, getDocs, query, limit } = await import('firebase/firestore');
      const reviewsRef = collection(db, 'reviews');
      addLog('✅ Coleção reviews acessada');
      
      // 4. Testar consulta simples
      addLog('🔍 Executando consulta básica...');
      const testQuery = query(reviewsRef, limit(5));
      const snapshot = await getDocs(testQuery);
      addLog(`✅ Consulta executada: ${snapshot.size} documentos encontrados na coleção`);
      
      // 5. Verificar documentos
      interface ReviewDoc {
        id: string;
        productId: string;
        title: string;
      }
      
      const allDocs: ReviewDoc[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        allDocs.push({ id: doc.id, productId: data.productId, title: data.title });
      });
      
      if (allDocs.length > 0) {
        addLog(`📄 Primeiros documentos: ${JSON.stringify(allDocs, null, 2)}`);
        
        // Verificar se há reviews para este produto específico
        const productReviews = allDocs.filter(doc => doc.productId === productId);
        addLog(`🎯 Reviews para produto '${productId}': ${productReviews.length} encontradas`);
        
        if (productReviews.length > 0) {
          addLog(`✨ Reviews encontradas: ${JSON.stringify(productReviews, null, 2)}`);
        }
      } else {
        addLog('⚠️ Nenhum documento encontrado na coleção reviews');
      }
      
    } catch (error) {
      addLog(`❌ Erro Firebase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      addLog(`🔍 Stack trace: ${error instanceof Error ? error.stack : 'N/A'}`);
      console.error('Firebase test error:', error);
    } finally {
      setIsTestingFirebase(false);
    }
  };

  const testReviewService = async () => {
    setIsTestingService(true);
    addLog('📝 Iniciando teste do reviewService...');
    
    try {
      // 1. Importar o serviço
      addLog('📦 Importando reviewService...');
      const { reviewService } = await import('@/lib/services/reviewService');
      addLog('✅ reviewService importado');
      
      // 2. Testar busca de reviews
      addLog(`🔍 Buscando reviews para produto: ${productId}`);
      const reviews = await reviewService.getProductReviews(productId);
      addLog(`✅ Reviews carregadas: ${reviews.length} encontradas`);
      
      // 3. Mostrar detalhes das reviews
      if (reviews.length > 0) {
        reviews.forEach((review, index) => {
          addLog(`📝 Review #${index + 1}: "${review.title}" - ${review.rating}★ por ${review.userName}`);
        });
      } else {
        addLog('⚠️ Nenhuma review encontrada para este produto');
        
        // 4. Testar se é problema geral ou específico do produto
        addLog('🔍 Testando se há reviews em geral...');
        try {
          const { db } = await import('@/lib/firebase');
          const { collection, getDocs, limit, query } = await import('firebase/firestore');
          const allReviewsSnapshot = await getDocs(query(collection(db, 'reviews'), limit(5)));
          addLog(`📊 Total de reviews no sistema: ${allReviewsSnapshot.size}`);
          
          if (allReviewsSnapshot.size > 0) {
            const productIds = new Set<string>();
            allReviewsSnapshot.forEach(doc => {
              productIds.add(doc.data().productId);
            });
            addLog(`🏷️ Produtos com reviews: ${Array.from(productIds).join(', ')}`);
          }
        } catch (err) {
          addLog(`❌ Erro ao verificar reviews gerais: ${err instanceof Error ? err.message : 'Erro'}`);
        }
      }
      
      // 5. Testar stats
      addLog('📊 Testando estatísticas...');
      const stats = await reviewService.getProductReviewStats(productId);
      addLog(`📈 Stats: ${stats.totalReviews} total, média ${stats.averageRating}`);
      
    } catch (error) {
      addLog(`❌ Erro reviewService: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error('ReviewService test error:', error);
    } finally {
      setIsTestingService(false);
    }
  };

  const testCreateReview = async () => {
    if (!user) {
      addLog('❌ Usuário não está logado - não é possível criar review');
      return;
    }

    addLog('🧪 Criando review de teste...');
    try {
      const { reviewService } = await import('@/lib/services/reviewService');
      
      const testReviewData = {
        productId,
        rating: 5,
        title: `Review Teste - ${new Date().toLocaleTimeString()}`,
        content: `Review de teste criada em ${new Date().toLocaleString()} para diagnosticar problemas.`,
        pros: ['Funcionalidade teste', 'Interface teste'],
        cons: ['Ponto de melhoria teste']
      };

      addLog(`📝 Dados da review: ${JSON.stringify(testReviewData, null, 2)}`);
      
      const newReview = await reviewService.createReview(
        user.id,
        user.displayName || 'Usuário Teste',
        testReviewData
      );
      
      addLog(`✅ Review criada com sucesso! ID: ${newReview.id}`);
      
      // Testar se consegue buscar a review recém-criada
      setTimeout(async () => {
        const reviews = await reviewService.getProductReviews(productId);
        addLog(`🔄 Após criação: ${reviews.length} reviews encontradas`);
      }, 1000);
      
    } catch (error) {
      addLog(`❌ Erro ao criar review: ${error instanceof Error ? error.message : 'Erro'}`);
      console.error('Create review error:', error);
    }
  };

  useEffect(() => {
    addLog('🔧 ReviewDebug iniciado');
    addLog(`📦 ProductId: ${productId}`);
    addLog(`👤 User: ${user ? `${user.email} (${user.id})` : 'Não logado'}`);
    
    // Verificar configuração básica
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    addLog(`🔑 Firebase API Key: ${apiKey ? '✅ Configurada' : '❌ Não encontrada'}`);
  }, [productId, user]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🔧 Debug - Sistema de Reviews
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={testFirebaseConnection}
              disabled={isTestingFirebase}
              variant={isTestingFirebase ? "secondary" : "default"}
            >
              {isTestingFirebase ? "🔄" : "🔥"} Firebase
            </Button>
            <Button 
              size="sm" 
              onClick={testReviewService}
              disabled={isTestingService}
              variant={isTestingService ? "secondary" : "default"}
            >
              {isTestingService ? "🔄" : "📝"} Service
            </Button>
            <Button size="sm" onClick={testCreateReview} disabled={!user}>
              🧪 Criar
            </Button>
            <Button size="sm" onClick={() => setDebugInfo([])} variant="outline">
              🗑️ Limpar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status rápido */}
        <div className="grid grid-cols-3 gap-2">
          <Badge variant={user ? "default" : "destructive"}>
            {user ? "👤 Logado" : "🚫 Não logado"}
          </Badge>
          <Badge variant="outline">
            🏷️ {productId}
          </Badge>
          <Badge variant={import.meta.env.VITE_FIREBASE_API_KEY ? "default" : "destructive"}>
            {import.meta.env.VITE_FIREBASE_API_KEY ? "🔑 Config OK" : "🔑 Sem config"}
          </Badge>
        </div>

        <Separator />

        {/* Log de debug */}
        <div>
          <h4 className="font-semibold mb-2">📋 Log de Debug ({debugInfo.length}):</h4>
          
          {debugInfo.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p className="mb-2">👋 Clique nos botões acima para iniciar o diagnóstico</p>
              <p className="text-xs">Recomendamos começar com "Firebase" depois "Service"</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-80 overflow-y-auto border rounded p-2">
              {debugInfo.map((log, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded text-xs font-mono ${
                    log.includes('❌') ? 'bg-red-50 text-red-800' :
                    log.includes('✅') ? 'bg-green-50 text-green-800' :
                    log.includes('⚠️') ? 'bg-yellow-50 text-yellow-800' :
                    'bg-muted/50'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dicas de solução */}
        <div className="text-xs space-y-1 text-muted-foreground border-t pt-2">
          <p><strong>💡 Dicas de solução:</strong></p>
          <p>• Se Firebase falhar: verifique arquivo .env.local</p>
          <p>• Se Service falhar: pode ser problema de permissões Firestore</p>
          <p>• Se não aparecem reviews: pode ser ID do produto diferente</p>
          <p>• Use F12 para ver logs detalhados no console</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewDebug;
