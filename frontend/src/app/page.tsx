import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Zap, BarChart3, CheckCircle2, ChevronRight, Star, Brain, Cpu, Activity, Bot, Building2, CreditCard, Landmark, PiggyBank, Wallet, Quote, BadgePercent } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0D14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all animate-pulse-glow-sm">
              <span className="text-white font-bold text-lg font-heading tracking-tighter">S</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">SRF</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              <Bot className="w-3 h-3" /> AI Powered
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-white transition-colors">
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-bold px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/5 text-white transition-all hover:scale-105 active:scale-95"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col mt-16">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-10 pb-20 px-6 overflow-hidden">
          {/* AI Grid Background */}
          <div className="absolute inset-0 ai-grid-bg opacity-60 pointer-events-none" />
          
          {/* Glowing Backgrounds */}
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            
            {/* Left Content */}
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Brain className="w-3.5 h-3.5" /> Motor de IA Preditiva
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-white">
                O match perfeito <br className="hidden sm:block"/>para o seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400">perfil financeiro.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Um ecossistema inteligente movido por Machine Learning. Encontramos os créditos e serviços com a maior probabilidade de aprovação para si, numa questão de segundos.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <Link 
                  href="/register" 
                  className="group relative flex items-center justify-center gap-3 w-full sm:w-auto h-14 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] scan-line-effect"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative">Começar Agora</span>
                  <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mt-4 sm:mt-0">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0A0D14] flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br ${i===1?'from-amber-400 to-orange-500':i===2?'from-emerald-400 to-teal-500':'from-pink-400 to-rose-500'}`}>
                        {i===1?'JD':i===2?'MA':'CS'}
                      </div>
                    ))}
                  </div>
                  <span>+10k utilizadores</span>
                </div>
              </div>
            </div>

            {/* Right Graphic: AI Brain Orbital System */}
            <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000 delay-300">
              {/* Central AI Brain Orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600/30 to-violet-600/30 flex items-center justify-center animate-pulse-glow border border-blue-500/20 backdrop-blur-sm">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-white/10">
                    <Brain className="w-10 h-10 text-blue-400" />
                  </div>
                </div>
                {/* Status Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B22]/90 border border-emerald-500/30 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                </div>
              </div>

              {/* Orbiting Neural Nodes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
                {/* Orbit ring */}
                <div className="absolute inset-0 rounded-full border border-blue-500/10 border-dashed" />
                {/* Node 1 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{"--orbit-radius": "150px"} as React.CSSProperties}>
                  <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                </div>
                {/* Node 2 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse" style={{"--orbit-radius": "130px"} as React.CSSProperties}>
                  <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                </div>
                {/* Node 3 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-slow" style={{"--orbit-radius": "170px"} as React.CSSProperties}>
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                </div>
              </div>

              {/* Outer orbit ring */}
              <div className="absolute w-[400px] h-[400px] border border-white/[0.03] rounded-full" />
              <div className="absolute w-[340px] h-[340px] border border-blue-500/[0.06] rounded-full animate-[spin_60s_linear_infinite]" />

              {/* Floating Card 1 — High Match */}
              <div className="absolute top-[8%] right-[5%] lg:right-[0%] z-30 w-64 glass-card p-5 rounded-2xl shadow-2xl animate-float scan-line-effect gradient-line-top">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Star className="w-5 h-5 fill-emerald-400" />
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">98%</span>
                </div>
                <h3 className="font-bold text-white mb-1">Crédito Habitação</h3>
                <p className="text-xs text-muted-foreground">Banco Nacional Angola</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" style={{width: "98%"}} />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Match IA
                  </span>
                </div>
              </div>

              {/* Floating Card 2 — Analysis Complete */}
              <div className="absolute bottom-[15%] left-[0%] lg:left-[-5%] z-30 w-72 glass-card p-5 rounded-2xl shadow-2xl animate-float-delayed scan-line-effect gradient-line-top">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 animate-pulse-glow-sm">
                    <Cpu className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Análise IA Concluída
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </h4>
                    <p className="text-xs text-muted-foreground">Perfil processado pelo motor ML</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-blue-400"/>Score de Crédito</span>
                    <span className="text-white font-bold">Excelente (720)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400"/>Capacidade Máx.</span>
                    <span className="text-white font-bold">450.000 Kz/mês</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 3 — AI Processing mini card */}
              <div className="absolute top-[45%] right-[-2%] z-30 w-48 glass-card p-3 rounded-xl shadow-xl animate-float-slow">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <Bot className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Modelo v2.1</p>
                    <p className="text-[9px] text-emerald-400 font-semibold">94.2% Acurácia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Band */}
        <section className="border-y border-white/5 bg-[#161B22]/30 backdrop-blur-sm py-12 relative z-20">
          <div className="absolute inset-0 ai-grid-bg opacity-30 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 relative z-10">
            {[
              { value: "+50", label: "Instituições Financeiras", icon: "🏦" },
              { value: "1.2M+", label: "Recomendações Geradas", icon: "🤖" },
              { value: "94%", label: "Taxa de Aprovação", icon: "✅" },
              { value: "< 2s", label: "Tempo de Análise ML", icon: "⚡" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                <span className="text-lg mb-2">{stat.icon}</span>
                <h4 className="text-3xl font-bold text-white mb-1 font-heading">{stat.value}</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid — How It Works */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 ai-grid-bg opacity-30 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                <Cpu className="w-3.5 h-3.5 text-blue-400" /> Como Funciona
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">Inteligência a favor da sua carteira</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A plataforma faz a ponte perfeita entre quem precisa de serviços financeiros e quem os fornece, eliminando a burocracia e as rejeições inesperadas.
              </p>
            </div>

            {/* Steps with circuit timeline */}
            <div className="relative">
              {/* Vertical circuit line (desktop) */}
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: BarChart3,
                    step: "01",
                    title: "Análise Profunda",
                    desc: "Defina o seu perfil (rendimentos, despesas, objetivos). O sistema organiza os seus dados para apresentar um panorama real às instituições.",
                    color: "text-blue-400",
                    bg: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
                    hover: "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                  },
                  {
                    icon: Brain,
                    step: "02",
                    title: "Algoritmo Preditivo",
                    desc: "O nosso modelo de IA calcula instantaneamente a probabilidade matemática de aprovação para cada serviço disponível no mercado angolano.",
                    color: "text-violet-400",
                    bg: "bg-violet-400/10 text-violet-400 border border-violet-400/20",
                    hover: "hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
                  },
                  {
                    icon: ShieldCheck,
                    step: "03",
                    title: "Privacidade Garantida",
                    desc: "Para as instituições provedoras (bancos, seguradoras), apresentamos apenas perfis validados e compatíveis com as regras de risco.",
                    color: "text-emerald-400",
                    bg: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
                    hover: "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                  }
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className={`group relative rounded-3xl glass-card p-8 transition-all duration-500 hover:-translate-y-2 scan-line-effect ${feature.hover}`}>
                      {/* Step number */}
                      <div className="absolute top-4 right-4 text-[11px] font-mono font-bold text-muted-foreground/30 tracking-wider">
                        STEP {feature.step}
                      </div>
                      
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${feature.bg}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                      
                      <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        <ChevronRight className={`w-4 h-4 ${feature.color}`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* AI Technology Showcase */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/[0.03] to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="rounded-3xl glass-card overflow-hidden neon-border">
              <div className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
                {/* Left: AI visualization */}
                <div className="relative w-40 h-40 shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 animate-pulse-glow" />
                  <div className="absolute inset-4 rounded-full bg-[#0A0D14]/80 flex items-center justify-center border border-white/10">
                    <Brain className="w-14 h-14 text-blue-400" />
                  </div>
                  {/* Orbiting dots */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{"--orbit-radius": "80px"} as React.CSSProperties}>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse" style={{"--orbit-radius": "70px"} as React.CSSProperties}>
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                    </div>
                  </div>
                </div>
                
                {/* Right: Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-bold uppercase tracking-wider mb-4">
                    <Zap className="w-3 h-3" /> Tecnologia Proprietária
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold font-heading text-white mb-4">
                    Motor de Recomendação <span className="gradient-text">Inteligente</span>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Combinamos dados financeiros, padrões de comportamento e modelos preditivos para calcular com precisão a probabilidade de aprovação de cada serviço financeiro — tudo em menos de 2 segundos.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["Machine Learning", "XAI — Explicabilidade", "Re-treino Automático", "Análise em Tempo Real"].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/*         FEATURED FINANCIAL PRODUCTS            */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="py-28 px-6 relative">
          <div className="absolute inset-0 ai-grid-bg opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
                <CreditCard className="w-3.5 h-3.5" /> Produtos em Destaque
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">
                Créditos e serviços <span className="gradient-text">recomendados</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Descubra os serviços financeiros mais populares na nossa plataforma, seleccionados pelo nosso motor de IA para o mercado angolano.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  name: "Crédito Habitação Jovem",
                  provider: "Banco Nacional de Angola",
                  type: "Crédito Habitação",
                  rate: "12.5%",
                  match: 98,
                  icon: Landmark,
                  color: "text-amber-400",
                  iconBg: "bg-amber-400/10 border-amber-400/20",
                  gradient: "from-amber-500/30",
                  desc: "Financiamento até 80% do valor do imóvel para jovens até 35 anos. Prazo máximo de 25 anos com carência de capital.",
                },
                {
                  name: "Crédito Pessoal Flex",
                  provider: "BAI — Banco Angolano de Investimentos",
                  type: "Crédito Pessoal",
                  rate: "18.9%",
                  match: 94,
                  icon: Wallet,
                  color: "text-blue-400",
                  iconBg: "bg-blue-400/10 border-blue-400/20",
                  gradient: "from-blue-500/30",
                  desc: "Até 5.000.000 Kz sem necessidade de fiador. Aprovação em 48h com análise automatizada de risco.",
                },
                {
                  name: "Poupança Crescer+",
                  provider: "BFA — Banco de Fomento Angola",
                  type: "Conta Poupança",
                  rate: "8.2%",
                  match: 91,
                  icon: PiggyBank,
                  color: "text-emerald-400",
                  iconBg: "bg-emerald-400/10 border-emerald-400/20",
                  gradient: "from-emerald-500/30",
                  desc: "Rentabilize as suas economias com juros compostos acima da inflação. Sem taxa de manutenção nos primeiros 12 meses.",
                },
                {
                  name: "Seguro de Vida Premium",
                  provider: "ENSA — Seguros de Angola",
                  type: "Seguro de Vida",
                  rate: "—",
                  match: 89,
                  icon: ShieldCheck,
                  color: "text-violet-400",
                  iconBg: "bg-violet-400/10 border-violet-400/20",
                  gradient: "from-violet-500/30",
                  desc: "Cobertura completa com capital segurado até 50.000.000 Kz. Inclui assistência hospitalar e repatriamento.",
                },
                {
                  name: "Microcrédito Empreendedor",
                  provider: "BPC — Banco de Poupança e Crédito",
                  type: "Microcrédito",
                  rate: "15.0%",
                  match: 87,
                  icon: TrendingUp,
                  color: "text-pink-400",
                  iconBg: "bg-pink-400/10 border-pink-400/20",
                  gradient: "from-pink-500/30",
                  desc: "Impulse o seu negócio com microcrédito até 2.000.000 Kz. Ideal para empreendedores do mercado informal.",
                },
                {
                  name: "Crédito Auto Standard",
                  provider: "Banco Millennium Atlântico",
                  type: "Crédito Automóvel",
                  rate: "14.5%",
                  match: 85,
                  icon: BadgePercent,
                  color: "text-cyan-400",
                  iconBg: "bg-cyan-400/10 border-cyan-400/20",
                  gradient: "from-cyan-500/30",
                  desc: "Financiamento de viaturas novas e usadas até 70% do valor. Prazo até 7 anos com seguro automóvel incluído.",
                },
              ].map((product, i) => {
                const Icon = product.icon;
                return (
                  <div key={i} className="group relative flex flex-col rounded-2xl glass-card overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-white/15 scan-line-effect">
                    {/* Top gradient line */}
                    <div className={`h-px w-full bg-gradient-to-r ${product.gradient} to-transparent`} />
                    <div className={`absolute inset-0 bg-gradient-to-b ${product.gradient} to-transparent opacity-0 group-hover:opacity-[0.08] transition-opacity pointer-events-none`} />
                    
                    <div className="relative z-10 p-6 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${product.iconBg} border transition-transform group-hover:scale-110 duration-300`}>
                          <Icon className={`w-5 h-5 ${product.color}`} />
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-2xl font-bold text-foreground leading-none">{product.match}%</span>
                          <span className="text-[9px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" style={{color: product.color.replace('text-', '').includes('amber') ? '#FBBF24' : undefined}} /> Match IA
                          </span>
                        </div>
                      </div>

                      {/* Provider */}
                      <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${product.color}`}>
                        {product.provider}
                      </p>
                      <h3 className="text-lg font-bold text-white mb-2 leading-snug">{product.name}</h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                        {product.desc}
                      </p>

                      {/* Compatibility bar */}
                      <div className="mb-4">
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{width: `${product.match}%`}} />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                          {product.type}
                        </span>
                        {product.rate !== "—" && (
                          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                            Taxa: {product.rate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group">
                Ver todos os serviços disponíveis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/*         TRUSTED PROVIDERS / PARTNERS           */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="py-20 px-6 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#161B22]/30 via-transparent to-[#161B22]/30 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                <Building2 className="w-3.5 h-3.5 text-blue-400" /> Provedores Parceiros
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">
                Instituições que confiam na nossa IA
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Trabalhamos com as principais instituições financeiras de Angola para garantir as melhores ofertas.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "BNA", full: "Banco Nacional de Angola", services: 12, color: "from-amber-500/20 to-amber-600/5" },
                { name: "BAI", full: "Banco Angolano de Investimentos", services: 9, color: "from-blue-500/20 to-blue-600/5" },
                { name: "BFA", full: "Banco de Fomento Angola", services: 11, color: "from-emerald-500/20 to-emerald-600/5" },
                { name: "BPC", full: "Banco de Poupança e Crédito", services: 7, color: "from-violet-500/20 to-violet-600/5" },
                { name: "BMA", full: "Banco Millennium Atlântico", services: 8, color: "from-cyan-500/20 to-cyan-600/5" },
                { name: "ENSA", full: "Seguros de Angola", services: 5, color: "from-pink-500/20 to-pink-600/5" },
                { name: "BCI", full: "Banco de Comércio e Indústria", services: 6, color: "from-orange-500/20 to-orange-600/5" },
                { name: "SOL", full: "Banco Sol", services: 4, color: "from-yellow-500/20 to-yellow-600/5" },
              ].map((provider, i) => (
                <div key={i} className="group flex flex-col items-center gap-3 p-6 rounded-2xl glass-card transition-all duration-300 hover:-translate-y-1 hover:border-white/15 scan-line-effect">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${provider.color} flex items-center justify-center border border-white/10 transition-transform group-hover:scale-110 duration-300`}>
                    <span className="text-white font-bold text-lg font-heading">{provider.name}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white leading-snug">{provider.full}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {provider.services} serviços ativos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/*             USER TESTIMONIALS                  */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="py-28 px-6 relative">
          <div className="absolute inset-0 ai-grid-bg opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold uppercase tracking-wider text-violet-400 mb-4">
                <Star className="w-3.5 h-3.5" /> Testemunhos
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">
                O que dizem os nossos <span className="gradient-text">utilizadores</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Milhares de angolanos já encontraram o serviço financeiro ideal com a ajuda da nossa inteligência artificial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  name: "Ana Beatriz Sousa",
                  role: "Professora · Luanda",
                  text: "Sempre tive receio de pedir crédito, mas o SRF recomendou-me exactamente o que precisava. Fui aprovada em menos de 48 horas! A explicação da IA sobre o porquê daquele serviço ser ideal para mim deu-me muita confiança.",
                  stars: 5,
                  initials: "AB",
                  color: "from-pink-400 to-rose-500",
                  product: "Crédito Pessoal — BAI",
                },
                {
                  name: "Carlos Eduardo Neto",
                  role: "Empreendedor · Benguela",
                  text: "Consegui um microcrédito para expandir a minha loja em Benguela. O algoritmo analisou o meu perfil e sugeriu a opção com a melhor taxa de juro. Recomendo a qualquer pequeno empresário!",
                  stars: 5,
                  initials: "CE",
                  color: "from-emerald-400 to-teal-500",
                  product: "Microcrédito — BPC",
                },
                {
                  name: "Mariana da Costa",
                  role: "Enfermeira · Huambo",
                  text: "A plataforma é incrível! Em menos de 2 minutos já tinha as minhas recomendações. O match de 96% com o seguro de vida foi surpreendente — era exactamente o que eu procurava.",
                  stars: 5,
                  initials: "MC",
                  color: "from-violet-400 to-purple-500",
                  product: "Seguro de Vida — ENSA",
                },
                {
                  name: "João Francisco Silva",
                  role: "Engenheiro Civil · Luanda",
                  text: "Usei o SRF para comparar opções de crédito habitação. A IA mostrou-me 3 opções que eu nem conhecia, com taxas muito mais competitivas do que as que me ofereceram presencialmente no banco.",
                  stars: 4,
                  initials: "JF",
                  color: "from-amber-400 to-orange-500",
                  product: "Crédito Habitação — BNA",
                },
                {
                  name: "Luísa Fernanda Martins",
                  role: "Estudante Universitária · Cabinda",
                  text: "Como estudante, achei que não teria acesso a nenhum produto financeiro. O SRF encontrou-me uma conta poupança com rendimento acima da inflação e sem taxas. Fantástico!",
                  stars: 5,
                  initials: "LF",
                  color: "from-blue-400 to-indigo-500",
                  product: "Conta Poupança — BFA",
                },
                {
                  name: "Pedro Manuel Augusto",
                  role: "Comerciante · Lubango",
                  text: "Já testei várias plataformas, mas esta é diferente. A explicação que a IA dá para cada recomendação faz toda a diferença. Sinto que posso confiar nas sugestões porque são transparentes.",
                  stars: 5,
                  initials: "PM",
                  color: "from-cyan-400 to-sky-500",
                  product: "Crédito Pessoal — BMA",
                },
              ].map((testimonial, i) => (
                <div key={i} className="group flex flex-col rounded-2xl glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 relative overflow-hidden">
                  {/* Subtle quote background */}
                  <Quote className="absolute top-4 right-4 w-12 h-12 text-white/[0.03] group-hover:text-white/[0.06] transition-colors" />

                  {/* Header: Avatar + Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
                      <span className="text-white text-sm font-bold">{testimonial.initials}</span>
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-sm font-bold text-white truncate">{testimonial.name}</span>
                      <span className="text-[11px] text-muted-foreground truncate">{testimonial.role}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3.5 h-3.5 ${si < testimonial.stars ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Product badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 w-fit">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-semibold text-muted-foreground">{testimonial.product}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#161B22] to-violet-600/20" />
            <div className="absolute inset-0 ai-grid-bg opacity-40" />
            
            <div className="relative z-10 py-20 px-6 sm:px-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center mb-8 animate-pulse-glow border border-blue-500/20">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-white max-w-2xl">
                Pronto para encontrar o crédito ideal?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                Registe-se gratuitamente e descubra as melhores opções financeiras num ambiente 100% digital, alimentado por inteligência artificial.
              </p>
              <Link 
                href="/register" 
                className="group flex items-center justify-center gap-2 h-14 px-10 rounded-xl bg-white text-[#0A0D14] hover:bg-zinc-200 font-bold text-lg transition-all hover:scale-105 active:scale-95"
              >
                Criar a Minha Conta
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0D14] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center border border-white/10">
              <span className="text-white font-bold text-sm font-heading">S</span>
            </div>
            <span className="font-heading font-bold text-lg text-muted-foreground">SRF System</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-wider">AI</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 text-center md:text-left text-xs text-muted-foreground">
          © {new Date().getFullYear()} SRF — Sistema de Recomendação Financeira. Criado como Projeto de Tese.
        </div>
      </footer>
    </div>
  );
}
