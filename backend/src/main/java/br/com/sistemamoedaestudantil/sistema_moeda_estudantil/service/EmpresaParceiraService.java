package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraAtualizacaoRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RecursoNaoEncontradoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RegraNegocioException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.EmpresaParceira;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.EmpresaParceiraRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.UsuarioRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.util.Cnpj;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.validator.EmpresaParceiraValidador;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EmpresaParceiraService {

    private final EmpresaParceiraRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public EmpresaParceiraService(EmpresaParceiraRepository empresaRepository,
                                  UsuarioRepository usuarioRepository,
                                  PasswordEncoder passwordEncoder) {
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public EmpresaParceiraResponse cadastrar(EmpresaParceiraRequest request) {
        EmpresaParceiraValidador.validarCadastro(request);

        String login = request.login().trim();
        String email = request.email().trim().toLowerCase();
        String cnpj = Cnpj.formatar(request.cnpj());

        if (usuarioRepository.existsByLogin(login)) {
            throw new RegraNegocioException("Login já cadastrado");
        }
        if (empresaRepository.existsByCnpj(cnpj)) {
            throw new RegraNegocioException("CNPJ já cadastrado");
        }
        if (empresaRepository.existsByEmail(email)) {
            throw new RegraNegocioException("Email já cadastrado");
        }

        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setRazaoSocial(request.razaoSocial().trim());
        empresa.setEmail(email);
        empresa.setCnpj(cnpj);
        empresa.setLogin(login);
        empresa.setSenhaHash(passwordEncoder.encode(request.senha()));

        return EmpresaParceiraResponse.de(empresaRepository.save(empresa));
    }

    @Transactional(readOnly = true)
    public List<EmpresaParceiraResponse> listar() {
        return empresaRepository.findAll().stream()
                .map(EmpresaParceiraResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmpresaParceiraResponse buscarPorId(UUID id) {
        return EmpresaParceiraResponse.de(buscarEntidade(id));
    }

    @Transactional
    public EmpresaParceiraResponse atualizar(UUID id, EmpresaParceiraAtualizacaoRequest request) {
        EmpresaParceiraValidador.validarAtualizacao(request);

        EmpresaParceira empresa = buscarEntidade(id);
        String email = request.email().trim().toLowerCase();
        String cnpj = Cnpj.formatar(request.cnpj());

        if (!empresa.getCnpj().equals(cnpj) && empresaRepository.existsByCnpj(cnpj)) {
            throw new RegraNegocioException("CNPJ já cadastrado");
        }
        if (!empresa.getEmail().equals(email) && empresaRepository.existsByEmail(email)) {
            throw new RegraNegocioException("Email já cadastrado");
        }

        empresa.setRazaoSocial(request.razaoSocial().trim());
        empresa.setEmail(email);
        empresa.setCnpj(cnpj);

        return EmpresaParceiraResponse.de(empresaRepository.save(empresa));
    }

    @Transactional
    public void excluir(UUID id) {
        empresaRepository.delete(buscarEntidade(id));
    }

    private EmpresaParceira buscarEntidade(UUID id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa parceira não encontrada"));
    }
}