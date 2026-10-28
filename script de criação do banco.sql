CREATE DATABASE IF NOT EXISTS oficinaflux CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oficinaflux;

-- Tabela de usuários para Autenticação e RBAC (Autorização por Papel)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    papel ENUM('cliente', 'mecanico', 'orcamentista', 'atendente') NOT NULL,
    telefone VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de veículos (cadastrados pelo atendente para os clientes)
CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    modelo VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    ano INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de atendimentos/ordens de serviço (fluxo central)
CREATE TABLE IF NOT EXISTS atendimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    veiculo_id INT NOT NULL,
    cliente_id INT NOT NULL,
    relato_problema TEXT,
    lista_servicos_pecas TEXT,
    valor_orcamento DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('fila', 'aguardando_mecanico', 'aguardando_orcamento', 'aguardando_aprovacao', 'aprovado', 'recusado', 'concluido') DEFAULT 'fila',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE
);