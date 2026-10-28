"use client";

import { FormEvent, useEffect, useState } from "react";
import Cabecalho from "../componentes/Cabecalho";
import Icone from "../componentes/Icone";

const API = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/empresas-parceiras`
    : "http://localhost:8080/api/empresas-parceiras";

type Empresa = {
    id: string;
    razaoSocial: string;
    email: string;
    cnpj: string;
    login: string;
};

type Campo = "razaoSocial" | "email" | "cnpj" | "login" | "senha";

const vazio: Record<Campo, string> = {
    razaoSocial: "",
    email: "",
    cnpj: "",
    login: "",
    senha: "",
};

const campos: {
    nome: Campo;
    rotulo: string;
    tipo: string;
    placeholder: string;
    largura: string;
    soCadastro?: boolean;
}[] = [
    { nome: "razaoSocial", rotulo: "Razão social", tipo: "text", placeholder: "Restaurante Exemplo LTDA", largura: "lg:col-span-2" },
    { nome: "email", rotulo: "E-mail", tipo: "email", placeholder: "contato@empresa.com", largura: "lg:col-span-2" },
    { nome: "cnpj", rotulo: "CNPJ", tipo: "text", placeholder: "00.000.000/0000-00", largura: "" },
    { nome: "login", rotulo: "Login", tipo: "text", placeholder: "nome de usuário", largura: "", soCadastro: true },
    { nome: "senha", rotulo: "Senha", tipo: "password", placeholder: "Mínimo de 6 caracteres", largura: "", soCadastro: true },
];

const estiloCampo =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

async function mensagemDeErro(resposta: Response): Promise<string> {
    const dados = await resposta.json().catch(() => ({}));
    return dados.erro ?? `Erro ao salvar (HTTP ${resposta.status}).`;
}

const SEM_CONEXAO = "Não foi possível conectar ao servidor. Verifique se o back-end está iniciado.";

export default function EmpresasPage() {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [form, setForm] = useState(vazio);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [ocupado, setOcupado] = useState(false);
    const [versao, setVersao] = useState(0);

    useEffect(() => {
        let ativo = true;
        fetch(API)
            .then((resposta) => resposta.json())
            .then((dados: Empresa[]) => {
                if (ativo) setEmpresas(dados);
            })
            .catch(() => {
                if (ativo) setErro(SEM_CONEXAO);
            })
            .finally(() => {
                if (ativo) setCarregando(false);
            });
        return () => {
            ativo = false;
        };
    }, [versao]);

    function recarregar() {
        setVersao((v) => v + 1);
    }

    function cancelar() {
        setForm(vazio);
        setEditandoId(null);
        setErro("");
    }

    async function enviar(e: FormEvent) {
        e.preventDefault();
        setErro("");
        setSucesso("");
        setOcupado(true);

        const corpo = editandoId
            ? { razaoSocial: form.razaoSocial, email: form.email, cnpj: form.cnpj }
            : form;

        try {
            const resposta = await fetch(editandoId ? `${API}/${editandoId}` : API, {
                method: editandoId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corpo),
            });

            if (!resposta.ok) {
                setErro(await mensagemDeErro(resposta));
                return;
            }

            const mensagem = editandoId
                ? "Empresa atualizada com sucesso!"
                : "Empresa cadastrada com sucesso!";
            cancelar();
            setSucesso(mensagem);
            recarregar();
        } catch {
            setErro(SEM_CONEXAO);
        } finally {
            setOcupado(false);
        }
    }

    function editar(empresa: Empresa) {
        setEditandoId(empresa.id);
        setErro("");
        setSucesso("");
        setForm({
            razaoSocial: empresa.razaoSocial,
            email: empresa.email,
            cnpj: empresa.cnpj,
            login: empresa.login,
            senha: "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir(empresa: Empresa) {
        if (!window.confirm(`Excluir a empresa ${empresa.razaoSocial}?`)) return;
        setErro("");
        setSucesso("");
        setOcupado(true);
        try {
            const resposta = await fetch(`${API}/${empresa.id}`, { method: "DELETE" });
            if (!resposta.ok) {
                setErro(await mensagemDeErro(resposta));
                return;
            }
            if (editandoId === empresa.id) cancelar();
            setSucesso("Empresa excluída com sucesso!");
            recarregar();
        } catch {
            setErro(SEM_CONEXAO);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <div className="min-h-screen">
            <Cabecalho ativo="empresas" />

            <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
                <form
                    onSubmit={enviar}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Icone nome={editandoId ? "editar" : "empresa"} className="h-5 w-5" />
            </span>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editandoId ? "Editar empresa" : "Nova empresa"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {editandoId
                                    ? "Altere os dados e salve."
                                    : "Preencha os dados para cadastrar uma empresa parceira."}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {campos
                            .filter((campo) => !(campo.soCadastro && editandoId))
                            .map((campo) => (
                                <div key={campo.nome} className={campo.largura}>
                                    <label
                                        htmlFor={campo.nome}
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        {campo.rotulo}
                                    </label>
                                    <input
                                        id={campo.nome}
                                        className={estiloCampo}
                                        type={campo.tipo}
                                        placeholder={campo.placeholder}
                                        minLength={campo.tipo === "password" ? 6 : undefined}
                                        maxLength={campo.tipo === "password" ? 72 : undefined}
                                        value={form[campo.nome]}
                                        onChange={(e) => setForm({ ...form, [campo.nome]: e.target.value })}
                                        required
                                    />
                                </div>
                            ))}
                    </div>

                    {erro && (
                        <p
                            role="alert"
                            className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
                        >
                            <Icone nome="alerta" className="h-4 w-4 shrink-0" />
                            {erro}
                        </p>
                    )}
                    {sucesso && (
                        <p
                            role="status"
                            className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700"
                        >
                            <Icone nome="ok" className="h-4 w-4 shrink-0" />
                            {sucesso}
                        </p>
                    )}

                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                        {editandoId && (
                            <button
                                type="button"
                                onClick={cancelar}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancelar edição
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={ocupado}
                            className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98] disabled:opacity-60"
                        >
                            {ocupado ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar empresa"}
                        </button>
                    </div>
                </form>

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Empresas cadastradas</h2>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              {empresas.length}
            </span>
                    </div>

                    {carregando ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                            Carregando empresas...
                        </div>
                    ) : empresas.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Icone nome="empresa" className="h-6 w-6" />
              </span>
                            <p className="font-medium text-slate-700">Nenhuma empresa cadastrada</p>
                            <p className="text-sm text-slate-500">Use o formulário acima para cadastrar a primeira.</p>
                        </div>
                    ) : (
                        <ul className="grid gap-4 md:grid-cols-2">
                            {empresas.map((empresa) => (
                                <li
                                    key={empresa.id}
                                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md"
                                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                    {empresa.razaoSocial.slice(0, 2).toUpperCase()}
                  </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-slate-900">{empresa.razaoSocial}</p>
                                        <p className="truncate text-sm text-slate-500">{empresa.email}</p>
                                        <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                        {empresa.cnpj}
                      </span>
                                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                        @{empresa.login}
                      </span>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            aria-label={`Editar ${empresa.razaoSocial}`}
                                            title="Editar"
                                            onClick={() => editar(empresa)}
                                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                                        >
                                            <Icone nome="editar" className="h-4 w-4" />
                                        </button>
                                        <button
                                            aria-label={`Excluir ${empresa.razaoSocial}`}
                                            title="Excluir"
                                            disabled={ocupado}
                                            onClick={() => void excluir(empresa)}
                                            className="rounded-lg border border-slate-200 p-2 text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-60"
                                        >
                                            <Icone nome="excluir" className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
}