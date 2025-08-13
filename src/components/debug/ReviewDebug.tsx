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

  const addLog = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log('🔧 ReviewDebug:', message);
  };

  const testFirebaseConnection = async () => {
    addLog('Testando conexão Firebase...');
    
    try {
      // Tentar importar o Firebase
      const { db } = await import('@/lib/firebase');
      addLog('✅ Firebase importado com sucesso');
      
      // Tentar acessar o banco
      const { collection, getDocs } = await import('firebase/firestore');
      const reviewsRef = collection(db, 'reviews');
      addLog('✅ Coleção reviews acessada');
      
      // Tentar listar reviews
      const snapshot = await getDocs(reviewsRef);
      addLog(`✅ Consulta executada: ${snapshot.size} documentos encontrados`);
      
      const docs = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
      addLog(`📄 Documentos: ${JSON.stringify(docs.slice(0, 2), null, 2)}`);
      
    } catch (error) {
      addLog(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error('Firebase test error:', error);
    }
  };

  const testReviewService = async () => {
    addLog('Testando reviewService...');
    
    try {
      const { reviewService } = await import('@/lib/services/reviewService');
      addLog('✅ reviewService importado');
      
      const reviews = await reviewService.getProductReviews(productId);
      addLog(`✅ Reviews carregadas: ${reviews.length} encontradas`);
      
      if (reviews.length > 0) {
        addLog(`📝 Primeira review: ${JSON.stringify(reviews[0], null, 2)}`);
      }
      
    } catch (error) {
      addLog(`❌ Erro no reviewService: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error('ReviewService test error:', error);
    }
  };

  useEffect(() => {
    addLog('🔧 ReviewDebug iniciado');
    addLog(`📦 ProductId: ${productId}`);
    addLog(`👤 User: ${user ? user.email : 'Não logado'}`);
  }, [productId, user]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🔧 Debug - Reviews
          <div className="flex gap-2">
            <Button size="sm" onClick={testFirebaseConnection}>
              � Firebase
            </Button>
            <Button size="sm" onClick={testReviewService}>
              📝 Service
            </Button>
            <Button size="sm" onClick={() => setDebugInfo([])}>
              🗑️ Limpar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status básico */}
        <div>
          <h4 className="font-semibold mb-2">� Status:</h4>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant={user ? "default" : "destructive"}>
              {user ? "Logado" : "Não logado"}
            </Badge>
            <Badge variant="outline">
              Product: {productId}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Log de debug */}
        <div>
          <h4 className="font-semibold mb-2">� Log de Debug ({debugInfo.length}):</h4>
          
          {debugInfo.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum log ainda. Clique nos botões para testar.</p>
          ) : (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {debugInfo.map((log, index) => (
                <div key={index} className="p-2 bg-muted/50 rounded text-xs font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações adicionais */}
        <div className="text-xs text-muted-foreground">
          💡 Use F12 para ver logs detalhados no console
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewDebug;
