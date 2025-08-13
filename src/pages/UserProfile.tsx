import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { reviewService } from "@/lib/services/reviewService";
import { Review } from "@/types/review";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Settings, 
  Star, 
  MessageSquare, 
  Plus,
  Award,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const loadUserReviews = useCallback(async () => {
    if (!user) return;
    
    setLoadingReviews(true);
    try {
      const reviews = await reviewService.getUserReviews(user.id);
      setUserReviews(reviews);
    } catch (error) {
      console.error('Erro ao carregar reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading) {
      setIsLoading(false);
      // Carregar reviews do usuário
      if (user) {
        loadUserReviews();
      }
    }
  }, [user, loading, navigate, loadUserReviews]);

  const getUserInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      'user': 'Usuário',
      'moderator': 'Moderador',
      'admin': 'Administrador'
    };
    return roles[role as keyof typeof roles] || 'Usuário';
  };

  const getRoleColor = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    const colors = {
      'user': 'default' as const,
      'moderator': 'secondary' as const,
      'admin': 'destructive' as const
    };
    return colors[role as keyof typeof colors] || 'default';
  };

  if (loading || isLoading) {
    return (
      <>
        <SEO 
          title="Meu Perfil"
          description="Gerencie seu perfil no Alternativas BR"
        />
        
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          
          <main className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Loading Skeleton */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }

  if (!user) {
    return null; // Redirect já foi feito no useEffect
  }

  return (
    <>
      <SEO 
        title={`Perfil de ${user.displayName || 'Usuário'}`}
        description={`Perfil de ${user.displayName || 'usuário'} no Alternativas BR - Descubra tecnologias brasileiras`}
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Header do Perfil */}
              <Card className="relative overflow-hidden">
                {/* Background com gradiente brasileiro */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 opacity-10" />
                
                <CardHeader className="relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-green-500 to-blue-500 text-white">
                        {getUserInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h1 className="text-2xl font-bold text-foreground">
                            {user.displayName || "Usuário"}
                          </h1>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={getRoleColor(user.role)} className="flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              {getRoleLabel(user.role)}
                            </Badge>
                            
                            {user.emailVerified && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <Award className="w-3 h-3 mr-1" />
                                Verificado
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button asChild className="shrink-0">
                          <Link to="/configuracoes" className="flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            Configurações
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Membro desde {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Cards de Estatísticas */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                      <Plus className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">Produtos</CardTitle>
                    <CardDescription>Adicionados por você</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <p className="text-xs text-muted-foreground mt-1">Em breve</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <CardTitle className="text-lg">Avaliações</CardTitle>
                    <CardDescription>Produtos avaliados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {loadingReviews ? "..." : userReviews.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {loadingReviews ? "Carregando..." : 
                       userReviews.length > 0 ? "Obrigado pela contribuição!" : "Avalie produtos para ajudar a comunidade"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Comentários</CardTitle>
                    <CardDescription>Suas contribuições</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <p className="text-xs text-muted-foreground mt-1">Em breve</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Ranking</CardTitle>
                    <CardDescription>Sua posição</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">-</div>
                    <p className="text-xs text-muted-foreground mt-1">Em breve</p>
                  </CardContent>
                </Card>
              </div>

              {/* Seções de Atividade */}
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Atividade Recente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                      Suas Avaliações
                    </CardTitle>
                    <CardDescription>
                      Suas últimas avaliações de produtos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingReviews ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <Skeleton className="h-10 w-10 rounded" />
                            <div className="space-y-1 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : userReviews.length > 0 ? (
                      <div className="space-y-4">
                        {userReviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{review.title}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {review.content}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {review.createdAt.toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        ))}
                        {userReviews.length > 3 && (
                          <Button variant="outline" size="sm" className="w-full">
                            Ver todas as {userReviews.length} avaliações
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Nenhuma avaliação ainda</p>
                        <p className="text-xs mt-1">
                          Explore produtos e deixe sua opinião!
                        </p>
                        <Button variant="outline" size="sm" className="mt-3" asChild>
                          <Link to="/explorar">
                            Explorar Produtos
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Preferências */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-primary" />
                      Preferências
                    </CardTitle>
                    <CardDescription>
                      Suas categorias favoritas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.preferences?.categories && user.preferences.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.categories.map((category, index) => (
                          <Badge key={index} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma preferência definida</p>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <Link to="/configuracoes">
                            Configurar preferências
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Contribua com a comunidade!</CardTitle>
                  <CardDescription className="text-base">
                    Ajude outros brasileiros a descobrir alternativas nacionais
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <Link to="/adicionar" className="flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Produto
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/categorias" className="flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Explorar Categorias
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default UserProfile;
