# Guía de Despliegue en VPS (Ubuntu / Debian) — CloudScope

Esta guía explica cómo desplegar **CloudScope** en tu servidor VPS de forma rápida y automatizada usando Docker y Nginx.

---

## 1. Requisitos Previos en el VPS

Asegúrate de tener instalado **Docker** y **Docker Compose** en tu VPS:

```bash
# Actualizar repositorios
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Añadir tu usuario al grupo docker (opcional para no usar sudo)
sudo usermod -aG docker $USER

# Verificar instalación
docker --version
docker compose version
```

---

## 2. Clonar el Repositorio en el VPS

```bash
# Clonar el proyecto
git clone <URL_DE_TU_REPOSITORIO_GITHUB>
cd proyecto-si784-2026-ii-halanocca_marca/CLOUDSCOPE
```

---

## 3. Despliegue con Docker Compose (Modo Producción)

Simplemente ejecuta:

```bash
# Construir la imagen y levantar el contenedor en segundo plano
docker compose up -d --build
```

Verifica el estado del contenedor:
```bash
docker compose ps
docker compose logs -f
```

¡Listo! Abre en tu navegador la dirección IP pública de tu VPS:
`http://<TU_IP_VPS>/`

---

## 4. (Opcional) Configurar Dominio Propio y SSL Gratis (HTTPS con Certbot)

Si tienes un dominio apuntando a la IP de tu VPS (por ejemplo `cloudscope.tudominio.com`):

1. Instalar Nginx y Certbot en el host:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

2. O cambiar el puerto en `docker-compose.yml` a `3000:80` y configurar Nginx reverse proxy con SSL:
```nginx
server {
    server_name cloudscope.tudominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Obtener certificado SSL gratuito de Let's Encrypt:
```bash
sudo certbot --nginx -d cloudscope.tudominio.com
```

---

## 5. Comandos Útiles de Mantenimiento

```bash
# Ver logs en tiempo real
docker compose logs -f

# Detener el servicio
docker compose down

# Actualizar el código y redesplegar
git pull
docker compose up -d --build
```
