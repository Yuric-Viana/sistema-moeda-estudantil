"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

const API = "http://localhost:8080/api/empresas-parceiras";

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
    soCadastro?: boolean;
}[] = [
    { nome: "razaoSocial", rotulo: "Razão social", tipo: "text", placeholder: "Restaurante Exemplo LTDA" },
    { nome: "email", rotulo: "Email", tipo: "email", placeholder: "contato@empresa.com" },
    { nome: "cnpj", rotulo: "CNPJ", tipo: "text", placeholder: "00.000.000/0000-00" },
    { nome: "login", rotulo: "Login", tipo: "text", placeholder: "nome de usuário", soCadastro: true },
    { nome: "senha", rotulo: "Senha", tipo: "password", placeholder: "••••••••", soCadastro: true },
];

const estiloInput =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export default function EmpresasPage() {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [form, setForm] = useState(vazio);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    const carregar = useCallback(async () => {
        try {
            const resposta = await fetch(API);
            setEmpresas(await resposta.json());
        } catch {
            setErro("Não foi possível conectar ao servidor.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    function cancelar() {
        setForm(vazio);
        setEditandoId(null);
        setErro("");
    }

    async function enviar(e: FormEvent) {
        e.preventDefault();
        setErro("");

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
                const dados = await resposta.json();
                setErro(dados.erro ?? "Erro ao salvar.");
                return;
            }

            cancelar();
            carregar();
        } catch {
            setErro("Não foi possível conectar ao servidor.");
        }
    }

    function editar(empresa: Empresa) {
        setEditandoId(empresa.id);
        setErro("");
        setForm({
            razaoSocial: empresa.razaoSocial,
            email: empresa.email,
            cnpj: empresa.cnpj,
            login: empresa.login,
            senha: "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir(id: string) {
        if (!window.confirm("Excluir esta empresa parceira?")) return;
        await fetch(`${API}/${id}`, { method: "DELETE" });
        if (editandoId === id) cancelar();
        carregar();
    }

    return (
        <div className="min-h-screen">
            <header className="border-b border-blue-100 bg-white">
                <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-sm">
                        🪙
                    </div>
                    <div>
                        <p className="text-base font-bold leading-tight text-slate-900">Moeda Estudantil</p>
                        <p className="text-xs text-slate-500">Painel de empresas parceiras</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-[360px_1fr]">
                <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {editandoId ? "Editar empresa" : "Nova empresa"}
                    </h2>
                    <p className="mb-5 mt-1 text-sm text-slate-500">
                        {editandoId
                            ? "Altere os dados e salve."
                            : "Preencha os dados para cadastrar uma empresa parceira."}
                    </p>

                    <form onSubmit={enviar} className="grid gap-4">
                        {campos
                            .filter((campo) => !(campo.soCadastro && editandoId))
                            .map((campo) => (
                                <label key={campo.nome} className="grid gap-1.5">
                                    <span className="text-sm font-medium text-slate-700">{campo.rotulo}</span>
                                    <input
                                        className={estiloInput}
                                        type={campo.tipo}
                                        placeholder={campo.placeholder}
                                        value={form[campo.nome]}
                                        onChange={(e) => setForm({ ...form, [campo.nome]: e.target.value })}
                                        required
                                    />
                                </label>
                            ))}

                        {erro && (
                            <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                                {erro}
                            </p>
                        )}

                        <div className="mt-1 flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                            >
                                {editandoId ? "Salvar alterações" : "Cadastrar"}
                            </button>
                            {editandoId && (
                                <button
                                    type="button"
                                    onClick={cancelar}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Empresas cadastradas</h2>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {empresas.length}
            </span>
                    </div>

                    <ul className="grid gap-3">
                        {empresas.map((empresa) => (
                            <li
                                key={empresa.id}
                                className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                                    {empresa.razaoSocial.slice(0, 2).toUpperCase()}
                                </div>

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

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => editar(empresa)}
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => excluir(empresa.id)}
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {!carregando && empresas.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
                            <p className="text-3xl">🏢</p>
                            <p className="mt-2 font-medium text-slate-700">Nenhuma empresa cadastrada</p>
                            <p className="text-sm text-slate-500">Use o formulário ao lado para cadastrar a primeira.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}