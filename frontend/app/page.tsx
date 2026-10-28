import Link from "next/link";
import Cabecalho from "./componentes/Cabecalho";
import Icone, { NomeIcone } from "./componentes/Icone";

const modulos: { href: string; icone: NomeIcone; titulo: string; descricao: string }[] = [
  {
    href: "/alunos",
    icone: "aluno",
    titulo: "Alunos",
    descricao: "Cadastre, consulte, edite e exclua alunos, escolhendo a instituição de ensino e o curso.",
  },
  {
    href: "/empresas",
    icone: "empresa",
    titulo: "Empresas parceiras",
    descricao: "Cadastre, consulte, edite e exclua as empresas que oferecem vantagens aos alunos.",
  },
];

export default function Inicio() {
  return (
      <div className="min-h-screen">
        <Cabecalho ativo="inicio" />
        <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Reconheça o mérito, troque por vantagens</h1>
            <p className="text-base text-slate-900">
              Professores distribuem moedas aos alunos como reconhecimento, e os alunos as trocam por produtos e descontos oferecidos por empresas parceiras.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {modulos.map((modulo) => (
                <Link
                    key={modulo.href}
                    href={modulo.href}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-300 hover:shadow-md"
                >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Icone nome={modulo.icone} className="h-6 w-6" />
              </span>
                  <span className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-slate-900">{modulo.titulo}</span>
                <span className="text-sm text-slate-500">{modulo.descricao}</span>
                <span className="mt-2 flex items-center gap-1 text-sm font-medium text-violet-700">
                  Abrir
                  <Icone nome="seta" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </span>
                </Link>
            ))}
          </div>
        </main>
      </div>
  );
}