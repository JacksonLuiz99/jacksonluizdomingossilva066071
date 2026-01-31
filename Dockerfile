# =============================================================================
# Dockerfile - Pet Friends Angular Application
# =============================================================================
# Multi-stage build para otimizar o tamanho da imagem final
# Stage 1: Build da aplicação Angular
# Stage 2: Servidor Nginx para servir os arquivos estáticos
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copia apenas arquivos de dependências primeiro (cache optimization)
COPY package*.json ./

# Instala dependências
RUN npm ci --legacy-peer-deps

# Copia o resto do código fonte
COPY . .

# Build de produção
RUN npm run build -- --configuration=production

# -----------------------------------------------------------------------------
# Stage 2: Nginx Production Server
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Remove configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos buildados do estágio anterior
COPY --from=build /app/dist/jacksonluizdomingossilva066071/browser /usr/share/nginx/html

# Copia configuração customizada do Nginx para SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
