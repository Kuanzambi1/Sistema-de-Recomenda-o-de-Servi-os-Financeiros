"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, MoreHorizontal, ShieldAlert, Filter, Loader2, Power, PowerOff, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { adminService } from "@/services/admin.service";

const statusConfig: Record<string, { dot: string; label: string }> = {
  ativo: { dot: "bg-emerald-400", label: "Ativo" },
  inativo: { dot: "bg-red-400", label: "Bloqueado" },
};

const gradients = [
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-pink-500 to-rose-400",
];

export default function GestaoUtilizadoresPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string | undefined>(undefined);
  const [menu, setMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminService.listarUtilizadores(tipoFilter);
        setUsers(data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    })();
  }, [tipoFilter]);

  const filtered = users.filter(u =>
    u.nome?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const abrirMenu = (e: React.MouseEvent, id: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenu(m => (m?.id === id ? null : { id, x: rect.right, y: rect.bottom + 4 }));
  };

  const alternarAtivo = async (user: any) => {
    setToggling(user.id);
    try {
      const data = await adminService.alternarAtivo(user.id, !user.ativo);
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, ativo: data.utilizador?.ativo } : u)));
    } catch {
    } finally {
      setToggling(null);
      setMenu(null);
    }
  };

  const eliminar = async (id: string, nome: string) => {
    if (!window.confirm(`Tem a certeza que deseja eliminar "${nome}"? Esta acção não pode ser revertida.`)) {
      setMenu(null);
      return;
    }
    try {
      await adminService.eliminarUtilizador(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
    } finally {
      setMenu(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Gestão de Utilizadores</h1>
          <p className="text-muted-foreground mt-1 text-sm">Todos os utilizadores registados na plataforma.</p>
        </div>
        <Button asChild className="gap-2 font-semibold">
          <Link href="/admin/utilizadores/novo"><UserPlus className="w-4 h-4" />Adicionar Novo</Link>
        </Button>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por nome ou e-mail..." className="pl-9 bg-muted/30 border-border/50 h-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {[undefined, "utilizador", "provedor", "administrador"].map((t) => (
              <button key={t ?? "all"} onClick={() => { setTipoFilter(t); setLoading(true); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${tipoFilter === t ? "bg-primary/15 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground"}`}>
                {t === undefined ? "Todos" : t === "utilizador" ? "Utilizadores" : t === "provedor" ? "Provedores" : "Admins"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/20">
                <tr>
                  <th className="px-5 py-3 font-medium">Utilizador</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Registado em</th>
                  <th className="px-5 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Nenhum utilizador encontrado.</td></tr>
                )}
                {filtered.map((user, i) => {
                  const initials = user.nome?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                  const grad = gradients[i % gradients.length];
                  const isActive = user.ativo !== false;
                  return (
                    <tr key={user.id} className={`group transition-colors hover:bg-muted/60 ${i !== filtered.length - 1 ? "border-b border-border" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center shrink-0`}>
                            <span className="text-white text-xs font-bold">{initials}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{user.nome}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${user.tipo === "provedor" ? "text-primary bg-primary/10 border-primary/20" : user.tipo === "administrador" ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-muted-foreground bg-muted border-border"}`}>
                          {user.tipo}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-red-400"}`} />
                          <span className="text-xs font-semibold">{isActive ? "Ativo" : "Bloqueado"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">
                        {new Date(user.criado_em).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground" title="Mais ações" onClick={(e) => abrirMenu(e, user.id)}>
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-5 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground">
          {filtered.length} utilizadores
        </div>
      </div>

      {menu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenu(null)} />
          <div className="fixed z-50 w-48 rounded-xl border border-border bg-card shadow-xl py-1.5" style={{ top: menu.y, right: window.innerWidth - menu.x }}>
            <Link
              href={`/admin/utilizadores/${menu.id}/editar`}
              onClick={() => setMenu(null)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5 text-muted-foreground" /> Editar
            </Link>
            {(() => {
              const target = users.find(u => u.id === menu.id);
              if (!target) return null;
              return (
                <>
                  <button
                    onClick={() => alternarAtivo(target)}
                    disabled={toggling === target.id}
                    className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left text-foreground hover:bg-muted transition-colors disabled:opacity-60"
                  >
                    {toggling === target.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" /> : target.ativo !== false ? <PowerOff className="w-3.5 h-3.5 text-destructive" /> : <Power className="w-3.5 h-3.5 text-emerald-400" />}
                    {target.ativo !== false ? "Bloquear" : "Ativar"}
                  </button>
                  <div className="my-1 h-px bg-border" />
                  <button
                    onClick={() => eliminar(target.id, target.nome)}
                    className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}
