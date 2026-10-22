package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RegraNegocioException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.EmpresaParceira;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.EmpresaParceiraRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        if (usuarioRepository.existsByLogin(request.login())) {
            throw new RegraNegocioException("Login já cadastrado");
        }
        if (empresaRepository.existsByCnpj(request.cnpj())) {
            throw new RegraNegocioException("CNPJ já cadastrado");
        }
        if (empresaRepository.existsByEmail(request.email())) {
            throw new RegraNegocioException("Email já cadastrado");
        }

        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setRazaoSocial(request.razaoSocial());
        empresa.setEmail(request.email());
        empresa.setCnpj(request.cnpj());
        empresa.setLogin(request.login());
        empresa.setSenhaHash(passwordEncoder.encode(request.senha()));

        return EmpresaParceiraResponse.de(empresaRepository.save(empresa));
    }
}
