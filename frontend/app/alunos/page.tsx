"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
type Opcao = { id: string; nome: string };
type Aluno = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  login: string;
  instituicaoId: string;
  instituicaoNome: string;
  cursoId: string;
  cursoNome: string;
};
type Form = {
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  login: string;
  senha: string;
  instituicaoId: string;
  cursoId: string;
};
const vazio: Form = {
  nome: "",
  email: "",
  cpf: "",
  rg: "",
  endereco: "",
  login: "",
  senha: "",
  instituicaoId: "",
  cursoId: "",
};
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se o back-end está iniciado.",
    );
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.mensagem || err.message || err.detail || `Erro HTTP ${res.status}`,
    );
  }
  return res.status === 204 ? (undefined as T) : res.json();
}
export default function Home() {
  const [alunos, setAlunos] = useState<Aluno[]>([]),
    [instituicoes, setInstituicoes] = useState<Opcao[]>([]),
    [cursos, setCursos] = useState<Opcao[]>([]);
  const [form, setForm] = useState<Form>(vazio),
    [editId, setEditId] = useState<string | null>(null);
  const [erro, setErro] = useState(""),
    [sucesso, setSucesso] = useState(""),
    [busy, setBusy] = useState(false),
    [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => {
    try {
      const [a, i] = await Promise.all([
        api<Aluno[]>("/alunos"),
        api<Opcao[]>("/instituicoes"),
      ]);
      setAlunos(a);
      setInstituicoes(i);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  }, []);
  useEffect(() => {
    void carregar();
  }, [carregar]);
  useEffect(() => {
    if (!form.instituicaoId) {
      setCursos([]);
      return;
    }
    let ativo = true;
    api<Opcao[]>(`/instituicoes/${form.instituicaoId}/cursos`)
      .then((c) => {
        if (ativo) setCursos(c);
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      });
    return () => {
      ativo = false;
    };
  }, [form.instituicaoId]);
  const mudar = (campo: keyof Form, valor: string) => {
    setForm((f) =>
      campo === "instituicaoId"
        ? { ...f, instituicaoId: valor, cursoId: "" }
        : { ...f, [campo]: valor },
    );
    setErro("");
    setSucesso("");
  };
  const cancelar = () => {
    setEditId(null);
    setForm(vazio);
    setErro("");
    setSucesso("");
  };
  const editar = (a: Aluno) => {
    setEditId(a.id);
    setForm({
      nome: a.nome,
      email: a.email,
      cpf: a.cpf,
      rg: a.rg,
      endereco: a.endereco,
      login: a.login,
      senha: "",
      instituicaoId: a.instituicaoId,
      cursoId: a.cursoId,
    });
    setErro("");
    setSucesso("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  async function salvar(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErro("");
    setSucesso("");
    try {
      const payload = { ...form, cpf: form.cpf.replace(/\D/g, "") };
      await api<Aluno>(editId ? `/alunos/${editId}` : "/alunos", {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      const msg = editId
        ? "Aluno atualizado com sucesso!"
        : "Aluno cadastrado com sucesso!";
      cancelar();
      setSucesso(msg);
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function excluir(a: Aluno) {
    if (!window.confirm(`Excluir o aluno ${a.nome}?`)) return;
    setBusy(true);
    setErro("");
    setSucesso("");
    try {
      await api<void>(`/alunos/${a.id}`, { method: "DELETE" });
      if (editId === a.id) cancelar();
      setSucesso("Aluno excluído com sucesso!");
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#fcfcfd]">
      <header className="border-b border-[#ececf0] bg-white">
        <div className="mx-auto flex max-w-[1000px] items-center gap-3 px-5 py-6">
          <div className="rounded-xl bg-[#8618f4] p-2 text-white">
            <span aria-hidden="true">🎓</span>
          </div>
          <div>
            <h1 className="text-sm font-bold">Moeda Estudantil</h1>
            <p className="text-[11px] text-slate-500">Painel de alunos</p>
          </div>
        </div>
      </header>
      <section className="mx-auto grid max-w-[1000px] items-start gap-7 px-5 py-8 md:grid-cols-[350px_minmax(0,1fr)]">
        <form
          onSubmit={salvar}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4">
            <h2 className="text-[16px] font-bold">
              {editId ? "Editar aluno" : "Novo aluno"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Preencha os dados para{" "}
              {editId ? "atualizar o cadastro." : "cadastrar um aluno."}
            </p>
          </div>
          {(
            [
              ["nome", "Nome completo", "Nome do aluno"],
              ["email", "E-mail", "aluno@email.com"],
              ["cpf", "CPF (11 dígitos)", "00000000000"],
              ["rg", "RG", "Número do RG"],
              ["endereco", "Endereço", "Rua, número, bairro e cidade"],
              ["login", "Login", "nome de usuário"],
              [
                "senha",
                editId ? "Nova senha (opcional)" : "Senha",
                "Mínimo de 6 caracteres",
              ],
            ] as const
          ).map(([campo, titulo, placeholder]) => (
            <div key={campo}>
              <label
                className="mb-1.5 block text-xs font-medium text-slate-700"
                htmlFor={campo}
              >
                {titulo}
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50"
                id={campo}
                type={
                  campo === "senha"
                    ? "password"
                    : campo === "email"
                      ? "email"
                      : "text"
                }
                placeholder={placeholder}
                required={campo !== "senha" || !editId}
                minLength={campo === "senha" && !editId ? 6 : undefined}
                value={form[campo]}
                onChange={(e) => mudar(campo, e.target.value)}
              />
            </div>
          ))}
          <div>
            <label
              htmlFor="instituicao"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Instituição de ensino
            </label>
            <select
              id="instituicao"
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50"
              value={form.instituicaoId}
              onChange={(e) => mudar("instituicaoId", e.target.value)}
            >
              <option value="">Selecione uma instituição</option>
              {instituicoes.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="curso"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Curso
            </label>
            <select
              id="curso"
              required
              disabled={!form.instituicaoId}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50"
              value={form.cursoId}
              onChange={(e) => mudar("cursoId", e.target.value)}
            >
              <option value="">Selecione um curso</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          {erro && (
            <p
              role="alert"
              className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-700"
            >
              {erro}
            </p>
          )}
          {sucesso && (
            <p
              role="status"
              className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700"
            >
              <span aria-hidden="true">✓</span>
              {sucesso}
            </p>
          )}
          <button
            disabled={busy}
            type="submit"
            className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {busy
              ? "Salvando..."
              : editId
                ? "Salvar alterações"
                : "Cadastrar aluno"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={cancelar}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
            >
              Cancelar edição
            </button>
          )}
        </form>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-[15px]">Alunos cadastrados</h2>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              {alunos.length}
            </span>
          </div>
          {carregando ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Carregando alunos...
            </div>
          ) : alunos.length === 0 ? (
            <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-center">
              <span aria-hidden="true">👥</span>
              <p className="text-sm font-medium">Nenhum aluno cadastrado</p>
              <p className="mt-1 text-xs text-slate-500">
                Use o formulário ao lado para cadastrar o primeiro.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alunos.map((a) => (
                <div
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  key={a.id}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold">{a.nome}</h3>
                      <p className="mt-1 text-xs text-slate-500">{a.email}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <span aria-hidden="true">🏫</span>
                        {a.instituicaoNome} • {a.cursoNome}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        CPF: {a.cpf} · Login: {a.login}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        aria-label={`Editar ${a.nome}`}
                        title="Editar"
                        className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                        onClick={() => editar(a)}
                      >
                        <span aria-hidden="true">✏️</span>
                      </button>
                      <button
                        disabled={busy}
                        aria-label={`Excluir ${a.nome}`}
                        title="Excluir"
                        className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                        onClick={() => void excluir(a)}
                      >
                        <span aria-hidden="true">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
