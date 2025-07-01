# 🧾 API_RAC – Execução com Docker Multi-Empresa

Este projeto permite rodar uma instância da API eGestor separada para cada empresa, com seu próprio token, utilizando containers Docker isolados.

---

## 📁 Estrutura esperada

```
API_RAC/
├── src/
├── dist/
├── config/
│   ├── empresa_a.json
│   └── empresa_b.json
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

---

## 🛠️ Build manual da aplicação (opcional)

1. Compile o projeto:
   ```bash
   npm run build
   ```

2. Construa a imagem Docker manualmente:
   ```bash
   docker build -t api-rac:empresa-a .
   ```

3. Execute o container:
   ```bash
   docker run -p 3000:3000 api-rac:empresa-a
   ```

> 🔐 **Importante:** O arquivo `config/config.json` precisa existir com o token:
> ```json
> {
>   "egestorToken": "SEU_TOKEN_AQUI"
> }
> ```

---

## 🧩 Usando Docker Compose (multi-empresa)

### Exemplo de `docker-compose.yml`:

```yaml
version: "3.8"

services:
  empresa_a:
    build: .
    container_name: api_rac_empresa_a
    ports:
      - "3000:3000"
    volumes:
      - ./config/empresa_a.json:/app/config/config.json

  empresa_b:
    build: .
    container_name: api_rac_empresa_b
    ports:
      - "3001:3000"
    volumes:
      - ./config/empresa_b.json:/app/config/config.json
```

> Cada container usa uma porta distinta e um token próprio via bind do volume.

---

## 🚀 Subindo as instâncias com Docker Compose

```bash
docker-compose up --build
```

- `--build`: garante que a imagem seja atualizada com as últimas alterações.
- Os containers rodarão separadamente para cada empresa.

---

## 📡 Testando a API

Acesse via navegador ou ferramenta como Postman:

- Empresa A: [http://localhost:3000/alguma-rota](http://localhost:3000/alguma-rota)
- Empresa B: [http://localhost:3001/alguma-rota](http://localhost:3001/alguma-rota)