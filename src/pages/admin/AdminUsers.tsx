import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft,
  Search,
  MoreHorizontal,
  Shield,
  User,
  UserCheck,
  UserX,
  Crown,
  Mail,
  Calendar,
  MessageSquare,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'moderator' | 'admin';
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  reviewCount: number;
  productCount: number;
  loginProvider: 'email' | 'google' | 'facebook';
}

const AdminUsers: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'moderator' | 'admin'>('user');

  // Mock data - substituir por service real
  const mockUsers: AdminUser[] = [
    {
      id: '1',
      email: 'admin@alternativas.br',
      displayName: 'Administrador',
      photoURL: '',
      role: 'admin',
      emailVerified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
      isActive: true,
      reviewCount: 5,
      productCount: 12,
      loginProvider: 'email'
    },
    {
      id: '2',
      email: 'joao.silva@email.com',
      displayName: 'João Silva',
      photoURL: '',
      role: 'user',
      emailVerified: true,
      createdAt: new Date('2024-01-10'),
      lastLoginAt: new Date('2024-01-15'),
      isActive: true,
      reviewCount: 8,
      productCount: 2,
      loginProvider: 'google'
    },
    {
      id: '3',
      email: 'maria.santos@email.com',
      displayName: 'Maria Santos',
      photoURL: '',
      role: 'moderator',
      emailVerified: true,
      createdAt: new Date('2024-01-05'),
      lastLoginAt: new Date('2024-01-14'),
      isActive: true,
      reviewCount: 15,
      productCount: 0,
      loginProvider: 'email'
    },
    {
      id: '4',
      email: 'usuario.inativo@email.com',
      displayName: 'Usuário Inativo',
      photoURL: '',
      role: 'user',
      emailVerified: false,
      createdAt: new Date('2024-01-08'),
      lastLoginAt: new Date('2024-01-09'),
      isActive: false,
      reviewCount: 2,
      productCount: 0,
      loginProvider: 'email'
    }
  ];

  // Query para buscar usuários
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, roleFilter, statusFilter],
    queryFn: async () => {
      // Simular busca no Firebase
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredUsers = mockUsers;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.displayName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
        );
      }
      
      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }
      
      if (statusFilter !== 'all') {
        if (statusFilter === 'active') {
          filteredUsers = filteredUsers.filter(user => user.isActive);
        } else if (statusFilter === 'inactive') {
          filteredUsers = filteredUsers.filter(user => !user.isActive);
        } else if (statusFilter === 'verified') {
          filteredUsers = filteredUsers.filter(user => user.emailVerified);
        }
      }
      
      return filteredUsers;
    },
    enabled: user?.role === 'admin'
  });

  // Mutation para alterar role do usuário
  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'user' | 'moderator' | 'admin' }) => {
      // Simular mudança de role
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Alterando role:', { userId, role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Permissão alterada!",
        description: "O role do usuário foi atualizado com sucesso.",
      });
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao alterar permissão",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation para ativar/desativar usuário
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      // Simular mudança de status
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Alterando status:', { userId, isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Status alterado!",
        description: "O status do usuário foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao alterar status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800"><Crown className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-800"><Shield className="w-3 h-3 mr-1" />Moderador</Badge>;
      case 'user':
        return <Badge variant="outline"><User className="w-3 h-3 mr-1" />Usuário</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (isActive: boolean, emailVerified: boolean) => {
    if (!isActive) {
      return <Badge variant="destructive">Inativo</Badge>;
    }
    if (!emailVerified) {
      return <Badge variant="outline" className="text-orange-600">Não verificado</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRoleChange = (user: AdminUser) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    toggleUserStatusMutation.mutate({ userId, isActive: !currentStatus });
  };

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.isActive).length;
  const adminUsers = mockUsers.filter(u => u.role === 'admin').length;
  const unverifiedUsers = mockUsers.filter(u => !u.emailVerified).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Painel
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gerenciar Usuários
              </h1>
              <p className="text-gray-600 mt-1">
                {users.length} usuários encontrados
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Administradores</p>
                  <p className="text-2xl font-bold text-red-600">{adminUsers}</p>
                </div>
                <Crown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Não Verificados</p>
                  <p className="text-2xl font-bold text-orange-600">{unverifiedUsers}</p>
                </div>
                <UserX className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os roles</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="moderator">Moderadores</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="verified">Verificados</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>
              Gerencie usuários, permissões e status da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Atividade</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={userData.photoURL} alt={userData.displayName} />
                            <AvatarFallback>{getUserInitials(userData.displayName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{userData.displayName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {userData.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              Login: {userData.loginProvider}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(userData.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(userData.isActive, userData.emailVerified)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {userData.reviewCount} avaliações
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {userData.productCount} produtos
                          </div>
                          {userData.lastLoginAt && (
                            <div className="text-xs text-gray-500">
                              Último login: {userData.lastLoginAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {userData.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRoleChange(userData)}>
                              <Shield className="w-4 h-4 mr-2" />
                              Alterar Permissão
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(userData.id, userData.isActive)}
                            >
                              {userData.isActive ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Enviar Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Dialog para alterar role */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar Permissão de Usuário</DialogTitle>
              <DialogDescription>
                Altere o nível de permissão para <strong>{selectedUser?.displayName}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nova Permissão</label>
                <Select value={newRole} onValueChange={(value: 'user' | 'moderator' | 'admin') => setNewRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Usuário - Pode avaliar produtos
                      </div>
                    </SelectItem>
                    <SelectItem value="moderator">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Moderador - Pode moderar avaliações
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Administrador - Acesso completo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => selectedUser && changeRoleMutation.mutate({ 
                  userId: selectedUser.id, 
                  role: newRole 
                })}
                disabled={changeRoleMutation.isPending}
              >
                Alterar Permissão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminUsers;
